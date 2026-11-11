import test from "node:test";
import assert from "node:assert/strict";
import { calculateStatus, validateTelemetry, nextAlarmState } from "./state.mjs";

const sample = {
    deviceId: "khay-01",
    bootId: 123,
    seq: 5,
    sensorOk: true,
    alarmOn: false,
    angleDeg: 7.1,
    thresholdOn: 15,
    thresholdOff: 12,
};

test("valid telemetry is accepted", () =>
{
    assert.deepEqual(validateTelemetry(sample), sample);
});

test("sensor error must carry null, not fake zero", () =>
{
    assert.equal(validateTelemetry({ ...sample, sensorOk: false, angleDeg: 0 }), null);
    assert.ok(validateTelemetry({ ...sample, sensorOk: false, angleDeg: null }));
});

test("malformed numeric fields are rejected", () =>
{
    assert.equal(validateTelemetry({ ...sample, angleDeg: "NaN" }), null);
    assert.equal(validateTelemetry({ ...sample, thresholdOff: 16 }), null);
});

test("hysteresis: 14 -> 16 -> 14 -> 11", () =>
{
    let alarm = false;
    for (const [angle, expected] of [[14, false], [16, true], [14, true], [11, false]])
    {
        alarm = nextAlarmState(alarm, angle, true);
        assert.equal(alarm, expected);
    }
});

test("stale beats old safe or alarm states", () =>
{
    assert.equal(calculateStatus(sample, 1000, 8000), "stale");
    assert.equal(calculateStatus(sample, 1000, 2000), "safe");
    assert.equal(calculateStatus({ ...sample, alarmOn: true }, 1000, 2000), "alarm");
});

test("sensor fault has separate status", () =>
{
    assert.equal(calculateStatus({ ...sample, sensorOk: false, angleDeg: null }, 1000, 2000), "sensor-error");
});

test("paused telemetry keeps connection state but cannot carry an old angle or alarm", () =>
{
    const paused = { ...sample, monitoringEnabled: false, modeLedOn: false, lastCommandId: 9, angleDeg: null };
    assert.deepEqual(validateTelemetry(paused), paused);
    assert.equal(calculateStatus(paused, 1000, 2000), "paused");
    assert.equal(calculateStatus({ ...paused, sensorOk: false }, 1000, 2000), "paused");
    assert.equal(calculateStatus(paused, 1000, 6001), "stale");
    assert.equal(validateTelemetry({ ...paused, angleDeg: 16 }), null);
    assert.equal(validateTelemetry({ ...paused, alarmOn: true }), null);
});

test("control metadata must be complete and agree with the mode LED", () =>
{
    const controlled = { ...sample, monitoringEnabled: true, modeLedOn: true, lastCommandId: 0 };
    assert.deepEqual(validateTelemetry(controlled), controlled);
    assert.equal(validateTelemetry({ ...controlled, modeLedOn: false }), null);
    assert.equal(validateTelemetry({ ...controlled, lastCommandId: -1 }), null);
    assert.equal(validateTelemetry({ ...controlled, lastCommandId: 0x100000000 }), null);
    assert.equal(validateTelemetry({ ...sample, monitoringEnabled: false }), null);
});
