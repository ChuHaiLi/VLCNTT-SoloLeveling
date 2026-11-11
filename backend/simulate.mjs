import mqtt from "mqtt";

const broker = process.env.MQTT_URL || "mqtt://127.0.0.1:1883";
const topic = process.env.MQTT_TOPIC || "tilt-tray/telemetry";
const client = mqtt.connect(broker, { clientId: `tilt-tray-sim-${Math.random().toString(16).slice(2, 9)}` });
const steps = [0, 5, 10, 14, 16, 14, 13, 11, 4, 0];
let index = 0;
let alarm = false;
let seq = 0;
const bootId = Math.floor(Math.random() * 0xffffffff);

client.on("connect", () =>
{
    console.log("SIMULATOR CONNECTED — values are NOT from real hardware");
});
client.on("error", (error) =>
{
    console.error("MQTT simulator:", error.message);
});

setInterval(() =>
{
    if (!client.connected)
    {
        return;
    }
    const angle = steps[index++ % steps.length];
    if (!alarm && angle >= 15)
    {
        alarm = true;
    }
    else if (alarm && angle <= 12)
    {
        alarm = false;
    }
    const packet = {
        deviceId: "khay-01-SIM",
        bootId,
        seq: seq++,
        angleDeg: angle,
        alarmOn: alarm,
        sensorOk: true,
        thresholdOn: 15,
        thresholdOff: 12,
    };
    client.publish(topic, JSON.stringify(packet));
    console.log(packet);
}, 1000);
