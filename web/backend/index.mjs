import mqtt from "mqtt";
import { validateTelemetry } from "./state.mjs";
import { createMonitoringController } from "./control.mjs";
import { createApp } from "./app.mjs";

const port = Number(process.env.PORT || 3000);
const topic = process.env.MQTT_TOPIC || "tilt-tray/telemetry";
const broker = process.env.MQTT_URL || "mqtt://127.0.0.1:1883";
const options = {
    clientId: `tilt-tray-backend-${Math.random().toString(16).slice(2, 10)}`,
    clean: true,
    queueQoSZero: false,
};
if (process.env.MQTT_USER)
{
    options.username = process.env.MQTT_USER;
    options.password = process.env.MQTT_PASSWORD || "";
}

let latest = null;
let lastReceivedAt = 0;
let brokerConnected = false;

const client = mqtt.connect(broker, options);
const getState = () => ({ latest, lastReceivedAt, brokerConnected });
const control = createMonitoringController({
    client,
    getState,
    commandPrefix: process.env.MQTT_COMMAND_TOPIC || "tilt-tray/command",
});
const app = createApp({ getState, setMonitoring: control.setMonitoring });
client.on("connect", () =>
{
    client.subscribe(topic, { qos: 0 }, (error) =>
    {
        if (error)
        {
            console.error("Cannot subscribe", error.message);
        }
        brokerConnected = !error;
    });
});
client.on("reconnect", () =>
{
    brokerConnected = false;
});
client.on("close", () =>
{
    brokerConnected = false;
    control.disconnected();
});
client.on("error", (error) =>
{
    console.error("MQTT:", error.message);
});
client.on("message", (receivedTopic, payload) =>
{
    if (receivedTopic !== topic || payload.length > 1024)
    {
        return;
    }
    try
    {
        const parsed = validateTelemetry(JSON.parse(payload.toString("utf8")));
        if (parsed)
        {
            if (latest && parsed.deviceId === latest.deviceId && parsed.bootId === latest.bootId && parsed.seq <= latest.seq)
            {
                return;
            }
            latest = parsed;
            lastReceivedAt = Date.now();
            control.observe(parsed);
        }
    }
    catch
    {
        // Ignore malformed messages so the service stays available.
    }
});

app.listen(port, "127.0.0.1", () =>
{
    console.log(`Backend at http://127.0.0.1:${port}`);
    console.log(`MQTT ${broker}, topic ${topic}`);
});
