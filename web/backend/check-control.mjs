// Isolated real-MQTT/API check. The ESP32 peer is emulated, not Wokwi firmware.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import mqtt from "mqtt";

const bundledBroker = fileURLToPath(new URL("../../.tools/mosquitto/mosquitto.exe", import.meta.url));
const brokerExecutable = process.env.MOSQUITTO_BIN || (existsSync(bundledBroker) ? bundledBroker : "mosquitto");
const brokerPort = 19883;
const apiPort = 13000;
const url = `http://127.0.0.1:${apiPort}`;
const deviceId = "khay-CONTROL-TEST";
const commandTopic = `tilt-tray/command/${deviceId}`;
let broker;
let backend;
let peer;
let timer;
let logs = "";
let enabled = true;
let sensorOk = true;
let alertSettings = { alertsEnabled: true, thresholdOn: 15, thresholdOff: 12 };
let respond = true;
let lastCommandId = 0;
let seq = 0;
const received = [];

function launch(executable, args, options = {})
{
    const child = spawn(executable, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"], ...options });
    child.stdout.on("data", (chunk) =>
    {
        logs += chunk;
    });
    child.stderr.on("data", (chunk) =>
    {
        logs += chunk;
    });
    child.on("error", (error) =>
    {
        logs += error.message;
    });
    return child;
}

async function waitFor(predicate, label, timeoutMs = 6000)
{
    const started = Date.now();
    while (Date.now() - started < timeoutMs)
    {
        try
        {
            if (await predicate())
            {
                return;
            }
        }
        catch
        {
            // Services may still be starting or reconnecting.
        }
        await sleep(80);
    }
    throw new Error(`Timeout: ${label}`);
}

async function status()
{
    return (await fetch(`${url}/api/status`, { signal: AbortSignal.timeout(1000) })).json();
}

async function post(path, body)
{
    const response = await fetch(`${url}/api/${path}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), signal: AbortSignal.timeout(6500),
    });
    return { code: response.status, body: await response.json() };
}

const command = (enabled) => post("monitoring", { enabled });

function publish()
{
    if (!peer?.connected)
    {
        return;
    }
    peer.publish("tilt-tray/telemetry", JSON.stringify({
        deviceId, bootId: 123, seq: seq++, sensorOk,
        angleDeg: enabled && sensorOk ? 16 : null,
        alarmOn: enabled && sensorOk && alertSettings.alertsEnabled && 16 >= alertSettings.thresholdOn,
        ...alertSettings,
        monitoringEnabled: enabled, modeLedOn: enabled, lastCommandId,
    }), { qos: 0, retain: false });
}

async function stop(child)
{
    if (child && child.exitCode === null && child.pid)
    {
        const closed = once(child, "close");
        child.kill();
        await closed;
    }
}

try
{
    // Refuse to share these test ports with an existing process.
    const { createServer } = await import("node:net");
    for (const port of [brokerPort, apiPort])
    {
        const probe = createServer();
        probe.listen(port, "127.0.0.1");
        await once(probe, "listening");
        await new Promise((resolve) => probe.close(resolve));
    }
    broker = launch(brokerExecutable, ["-p", String(brokerPort)]);
    backend = launch(process.execPath, [fileURLToPath(new URL("index.mjs", import.meta.url))], {
        env: { ...process.env, MQTT_URL: `mqtt://127.0.0.1:${brokerPort}`, MQTT_TOPIC: "tilt-tray/telemetry", MQTT_COMMAND_TOPIC: "tilt-tray/command", PORT: String(apiPort) },
    });
    peer = mqtt.connect(`mqtt://127.0.0.1:${brokerPort}`, { clientId: "tilt-tray-control-test", clean: true, queueQoSZero: false });
    peer.on("error", (error) =>
    {
        logs += error.message;
    });
    peer.on("connect", () =>
    {
        peer.subscribe(commandTopic, { qos: 0 }, publish);
    });
    peer.on("message", (_topic, payload, packet) =>
    {
        const text = payload.toString();
        const monitoring = /^SET_MONITORING 123 (\d+) ([01])$/.exec(text);
        const settings = /^SET_ALERT_SETTINGS 123 (\d+) ([01]) (\d+) (\d+)$/.exec(text);
        assert.ok(monitoring || settings, text);
        assert.equal(packet.retain, false);
        received.push(text);
        if (respond)
        {
            if (settings)
            {
                const [, id, alerts, on, off] = settings;
                lastCommandId = Number(id);
                alertSettings = { alertsEnabled: alerts === "1", thresholdOn: Number(on), thresholdOff: Number(off) };
            }
            else
            {
                lastCommandId = Number(monitoring[1]);
                enabled = monitoring[2] === "1";
            }
            publish();
        }
    });
    timer = setInterval(publish, 250);
    await waitFor(async () => (await status()).reading?.deviceId === deviceId, "MQTT telemetry to API");
    assert.equal((await status()).status, "alarm");
    const paused = await command(false);
    assert.equal(paused.code, 200);
    assert.equal(paused.body.modeLedOn, false);
    assert.equal((await status()).status, "paused");
    assert.equal((await status()).reading.angleDeg, null);
    await sleep(5500);
    assert.equal((await status()).status, "paused", "Paused heartbeat must prevent stale status");
    assert.equal((await command(true)).code, 200);
    assert.equal((await status()).status, "alarm");
    assert.equal((await status()).reading.modeLedOn, true);

    sensorOk = false;
    publish();
    await waitFor(async () => (await status()).status === "sensor-error", "sensor fault");
    assert.equal((await command(false)).code, 200);
    assert.equal((await status()).status, "paused");
    sensorOk = true;
    assert.equal((await command(true)).code, 200);

    respond = false;
    assert.equal((await command(false)).code, 504);
    assert.equal((await status()).reading.monitoringEnabled, true, "Missing ACK must not change reported mode");
    respond = true;
    await stop(broker);
    await waitFor(async () => !(await status()).brokerConnected, "broker disconnect");
    const receivedBeforeReconnect = received.length;
    assert.equal((await command(false)).code, 503);
    await sleep(5500);
    assert.equal((await status()).status, "stale");
    assert.equal((await status()).reading, null);

    broker = launch(brokerExecutable, ["-p", String(brokerPort)]);
    await waitFor(async () => (await status()).status === "alarm" && (await status()).brokerConnected, "broker reconnect");
    await sleep(300);
    assert.equal(received.length, receivedBeforeReconnect, "No stale control command may replay after reconnect");
    assert.equal((await command(false)).code, 200);
    assert.equal((await command(true)).code, 200);

    const muted = { alertsEnabled: false, thresholdOn: 14, thresholdOff: 9 };
    assert.equal((await post("alert-settings", { ...muted, thresholdOff: 14 })).code, 400);
    const saved = await post("alert-settings", muted);
    assert.equal(saved.code, 200);
    assert.equal(saved.body.confirmed, true);
    const angleOnly = await status();
    assert.equal(angleOnly.status, "angle-only");
    assert.equal(angleOnly.reading.angleDeg, 16);
    assert.equal(angleOnly.reading.alarmOn, false);
    assert.equal(angleOnly.reading.modeLedOn, true);
    assert.deepEqual(angleOnly.thresholds, { on: 14, off: 9 });
    sensorOk = false;
    publish();
    await waitFor(async () => (await status()).status === "sensor-error", "fault in angle-only mode");
    assert.equal((await status()).reading.angleDeg, null);
    assert.equal((await command(false)).code, 200);
    assert.equal((await status()).status, "paused");
    sensorOk = true;
    assert.equal((await command(true)).code, 200);
    assert.equal((await status()).status, "angle-only");
    assert.equal((await post("alert-settings", { ...muted, alertsEnabled: true })).code, 200);
    assert.equal((await status()).status, "alarm");
    console.log("PASS: real Mosquitto + API control, alert settings, angle only, exact ACK, pause heartbeat >5s, resume, fault, timeout, broker stop/restart, no replay");
    console.log("ESP32 peer was emulated; physical LED and Wokwi firmware still require simulator verification.");
}
catch (error)
{
    console.error(error);
    console.error(logs.slice(-6000));
    process.exitCode = 1;
}
finally
{
    clearInterval(timer);
    if (peer)
    {
        await new Promise((resolve) => peer.end(true, {}, resolve));
    }
    await stop(backend);
    await stop(broker);
}
