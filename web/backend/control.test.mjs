import test from "node:test";
import assert from "node:assert/strict";
import { createMonitoringController } from "./control.mjs";

function fixture(timeoutMs = 1000)
{
    const published = [];
    const client = {
        connected: true,
        publish(topic, payload, options, callback)
        {
            published.push({ topic, payload, options });
            callback(null);
        },
    };
    const state = {
        brokerConnected: true,
        lastReceivedAt: Date.now(),
        latest: { deviceId: "khay-01-WOKWI", bootId: 123, monitoringEnabled: true, modeLedOn: true, lastCommandId: 0 },
    };
    const control = createMonitoringController({ client, getState: () => state, timeoutMs });
    return { control, state, client, published };
}

test("command is unretained, targets the current boot, and waits for the exact acknowledgement", async () =>
{
    const { control, state, published } = fixture();
    let confirmed = false;
    const result = control.setMonitoring(false).then((value) =>
    {
        confirmed = true;
        return value;
    });
    assert.equal(published.length, 1);
    assert.equal(published[0].topic, "tilt-tray/command/khay-01-WOKWI");
    assert.deepEqual(published[0].options, { qos: 0, retain: false });
    const match = /^SET_MONITORING 123 (\d+) 0$/.exec(published[0].payload);
    assert.ok(match);
    const requestId = Number(match[1]);
    control.observe({ ...state.latest, monitoringEnabled: false, modeLedOn: false, lastCommandId: requestId - 1 });
    control.observe({ ...state.latest, lastCommandId: requestId });
    await Promise.resolve();
    assert.equal(confirmed, false);
    control.observe({ ...state.latest, monitoringEnabled: false, modeLedOn: false, lastCommandId: requestId });
    assert.equal((await result).confirmed, true);
    assert.equal((await result).modeLedOn, false);
});

test("offline, stale, invalid, and legacy requests are refused before publishing", () =>
{
    const { control, state, client, published } = fixture();
    assert.throws(() => control.setMonitoring("false"), { statusCode: 400 });
    client.connected = false;
    assert.throws(() => control.setMonitoring(false), { statusCode: 503 });
    client.connected = true;
    state.lastReceivedAt = Date.now() - 5001;
    assert.throws(() => control.setMonitoring(false), { statusCode: 503 });
    state.lastReceivedAt = Date.now();
    delete state.latest.monitoringEnabled;
    assert.throws(() => control.setMonitoring(false), { statusCode: 409 });
    assert.equal(published.length, 0);
});

test("one outstanding command; broker disconnect rejects rather than claiming success", async () =>
{
    const { control } = fixture();
    const result = control.setMonitoring(false);
    assert.throws(() => control.setMonitoring(true), { statusCode: 409 });
    const rejected = assert.rejects(result, { statusCode: 503 });
    control.disconnected();
    await rejected;
});

test("device reboot invalidates a pending command", async () =>
{
    const { control, state } = fixture();
    const result = control.setMonitoring(false);
    const rejected = assert.rejects(result, { statusCode: 409 });
    control.observe({ ...state.latest, bootId: 456 });
    await rejected;
});

test("missing acknowledgement times out and releases the pending command", async () =>
{
    const { control } = fixture(20);
    await assert.rejects(control.setMonitoring(false), { statusCode: 504 });
    await assert.rejects(control.setMonitoring(true), { statusCode: 504 });
});

test("publish failure is not reported as a device acknowledgement", async () =>
{
    const { control, client } = fixture();
    client.publish = (_topic, _payload, _options, callback) => callback(new Error("offline"));
    await assert.rejects(control.setMonitoring(false), { statusCode: 503 });
});

test("synchronous publish failure releases the pending command immediately", async () =>
{
    const { control, client } = fixture();
    client.publish = () =>
    {
        throw new Error("client closed");
    };
    await assert.rejects(control.setMonitoring(false), { statusCode: 503 });
    await assert.rejects(control.setMonitoring(true), { statusCode: 503 });
});
