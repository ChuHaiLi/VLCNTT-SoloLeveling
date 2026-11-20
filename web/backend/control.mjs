import { randomInt } from "node:crypto";
import { STALE_MS, validAlertSettings } from "./state.mjs";

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
                ...request.desired,
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
        if (reading.lastCommandId !== pending.requestId)
        {
            return;
        }
        if (pending.command === "SET_ALERT_SETTINGS" && reading.settingsSaveFailed)
        {
            finish(commandError(500, "ESP32 không lưu được cài đặt. Cấu hình trước đó vẫn đang được sử dụng."));
        }
        else if (Object.entries(pending.desired).every(([key, value]) => reading[key] === value))
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
        return send("SET_MONITORING", [Number(enabled)], { monitoringEnabled: enabled, modeLedOn: enabled });
    }

    function setAlertSettings(settings)
    {
        if (!validAlertSettings(settings))
        {
            throw commandError(400, "Nhập hai ngưỡng là số nguyên từ 0° đến 90°. Ngưỡng tắt phải nhỏ hơn ngưỡng bật.");
        }
        const { alertsEnabled, thresholdOn, thresholdOff } = settings;
        return send("SET_ALERT_SETTINGS", [Number(alertsEnabled), thresholdOn, thresholdOff],
            { alertsEnabled, thresholdOn, thresholdOff });
    }

    function send(command, args, desired)
    {
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
        if (command === "SET_ALERT_SETTINGS" && typeof latest.alertsEnabled !== "boolean")
        {
            throw commandError(409, "Nguồn dữ liệu chưa hỗ trợ cài đặt cảnh báo. Hãy nạp firmware mới.");
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
        const payload = `${command} ${latest.bootId} ${requestId} ${args.join(" ")}`;
        return new Promise((resolve, reject) =>
        {
            const request = { resolve, reject, command, desired, requestId, deviceId: latest.deviceId, bootId: latest.bootId };
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

    return { setMonitoring, setAlertSettings, observe, disconnected };
}
