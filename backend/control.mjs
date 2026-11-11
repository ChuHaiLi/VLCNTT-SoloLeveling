import { randomInt } from "node:crypto";
import { STALE_MS } from "./state.mjs";

function commandError(statusCode, message)
{
    return Object.assign(new Error(message), { statusCode });
}

export function createMonitoringController({ client, getState, commandPrefix = "tilt-tray/command", timeoutMs = 4000 })
{
    let pending = null;

    function finish(error, reading)
    {
        if (!pending)
        {
            return;
        }
        const request = pending;
        pending = null;
        clearTimeout(request.timer);
        if (error)
        {
            request.reject(error);
        }
        else
        {
            request.resolve({
                confirmed: true,
                deviceId: reading.deviceId,
                bootId: reading.bootId,
                requestId: reading.lastCommandId,
                monitoringEnabled: reading.monitoringEnabled,
                modeLedOn: reading.modeLedOn,
            });
        }
    }

    function observe(reading)
    {
        if (!pending)
        {
            return;
        }
        if (reading.deviceId !== pending.deviceId || reading.bootId !== pending.bootId)
        {
            finish(commandError(409, "Nguồn dữ liệu đã đổi hoặc ESP32 vừa khởi động lại. Hãy thử lại."));
            return;
        }
        if (reading.lastCommandId === pending.requestId &&
            reading.monitoringEnabled === pending.enabled && reading.modeLedOn === pending.enabled)
        {
            finish(null, reading);
        }
    }

    function setMonitoring(enabled)
    {
        if (typeof enabled !== "boolean")
        {
            throw commandError(400, "enabled phải là true hoặc false.");
        }
        const { latest, lastReceivedAt, brokerConnected } = getState();
        const age = Date.now() - lastReceivedAt;
        if (!brokerConnected || !client.connected || !latest || !lastReceivedAt || age < 0 || age > STALE_MS)
        {
            throw commandError(503, "Chưa có kết nối và dữ liệu mới từ ESP32. Không gửi lệnh.");
        }
        if (typeof latest.monitoringEnabled !== "boolean" || !/^[a-zA-Z0-9_-]{1,80}$/.test(latest.deviceId))
        {
            throw commandError(409, "Nguồn dữ liệu chưa hỗ trợ điều khiển. Hãy chạy firmware mới.");
        }
        if (pending)
        {
            throw commandError(409, "Đang chờ ESP32 xác nhận lệnh trước.");
        }
        // Never reuse the previous acknowledgement, including after a backend restart.
        let requestId;
        do
        {
            requestId = randomInt(1, 0x100000000);
        }
        while (requestId === latest.lastCommandId);
        const topic = `${commandPrefix.replace(/\/$/, "")}/${latest.deviceId}`;
        const payload = `SET_MONITORING ${latest.bootId} ${requestId} ${enabled ? 1 : 0}`;
        return new Promise((resolve, reject) =>
        {
            const request = { resolve, reject, enabled, requestId, deviceId: latest.deviceId, bootId: latest.bootId };
            pending = request;
            request.timer = setTimeout(() =>
            {
                finish(commandError(504, "Chưa nhận được xác nhận từ ESP32. Kiểm tra trạng thái trước khi thử lại."));
            }, timeoutMs);
            try
            {
                client.publish(topic, payload, { qos: 0, retain: false }, (error) =>
                {
                    if (error && pending === request)
                    {
                        finish(commandError(503, "Không gửi được lệnh qua MQTT."));
                    }
                });
            }
            catch
            {
                finish(commandError(503, "Không gửi được lệnh qua MQTT."));
            }
        });
    }

    function disconnected()
    {
        finish(commandError(503, "Mất kết nối MQTT khi đang chờ xác nhận từ ESP32."));
    }

    return { setMonitoring, observe, disconnected };
}
