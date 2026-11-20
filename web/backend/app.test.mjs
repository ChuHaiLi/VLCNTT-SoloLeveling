import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "./app.mjs";

test("API exposes paused state and validates control requests", async (context) =>
{
    const calls = [];
    const state = {
        brokerConnected: true,
        lastReceivedAt: Date.now(),
        latest: {
            deviceId: "khay-01-WOKWI", bootId: 1, seq: 2,
            sensorOk: true, alarmOn: false, angleDeg: null, thresholdOn: 15, thresholdOff: 12,
            monitoringEnabled: false, modeLedOn: false, lastCommandId: 9,
        },
    };
    const app = createApp({
        getState: () => state,
        setMonitoring: async (enabled) =>
        {
            calls.push(enabled);
            return { confirmed: true, monitoringEnabled: enabled, modeLedOn: enabled };
        },
    });
    const server = app.listen(0, "127.0.0.1");
    context.after(() => server.close());
    await once(server, "listening");
    const url = `http://127.0.0.1:${server.address().port}`;
    const status = await fetch(`${url}/api/status`);
    assert.equal(status.headers.get("cache-control"), "no-store");
    const packet = await status.json();
    assert.equal(packet.status, "paused");
    assert.equal(packet.reading.angleDeg, null);
    assert.equal(packet.reading.modeLedOn, false);

    for (const body of [{ enabled: "false" }, {}, { enabled: true, angleDeg: 0 }, []])
    {
        const response = await fetch(`${url}/api/monitoring`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        assert.equal(response.status, 400);
    }
    assert.equal(calls.length, 0);
    const response = await fetch(`${url}/api/monitoring`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: true }),
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).confirmed, true);
    assert.deepEqual(calls, [true]);
    state.lastReceivedAt = Date.now() - 5001;
    const stale = await (await fetch(`${url}/api/status`)).json();
    assert.equal(stale.status, "stale");
    assert.equal(stale.reading, null);
});
