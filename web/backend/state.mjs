export const STALE_MS = 5000;

export function validAlertSettings(settings)
{
    return Boolean(settings) && typeof settings.alertsEnabled === "boolean" &&
        Number.isInteger(settings.thresholdOn) && Number.isInteger(settings.thresholdOff) &&
        settings.thresholdOff >= 0 && settings.thresholdOff < settings.thresholdOn && settings.thresholdOn <= 90;
}

export function validateTelemetry(raw)
{
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
    {
        return null;
    }
    const { deviceId, bootId, seq, sensorOk, alarmOn, angleDeg, thresholdOn, thresholdOff } = raw;
    const hasControl = ["monitoringEnabled", "modeLedOn", "lastCommandId"].some((key) => key in raw);
    if (hasControl &&
        (typeof raw.monitoringEnabled !== "boolean" || typeof raw.modeLedOn !== "boolean" ||
         raw.modeLedOn !== raw.monitoringEnabled ||
         !Number.isInteger(raw.lastCommandId) || raw.lastCommandId < 0 || raw.lastCommandId > 0xffffffff))
    {
        return null;
    }
    if (typeof deviceId !== "string" || deviceId.length === 0 || deviceId.length > 80 ||
        typeof bootId !== "number" || !Number.isSafeInteger(bootId) || bootId < 0 ||
        !Number.isSafeInteger(seq) || seq < 0 ||
        typeof sensorOk !== "boolean" || typeof alarmOn !== "boolean" ||
        typeof thresholdOn !== "number" || typeof thresholdOff !== "number" ||
        !Number.isFinite(thresholdOn) || !Number.isFinite(thresholdOff) ||
        thresholdOff < 0 || thresholdOn <= thresholdOff || thresholdOn > 90)
    {
        return null;
    }
    const hasAlertSettings = "alertsEnabled" in raw || "settingsSaveFailed" in raw;
    if (hasAlertSettings &&
        (!hasControl || !validAlertSettings(raw) ||
         ("settingsSaveFailed" in raw && typeof raw.settingsSaveFailed !== "boolean") ||
         (!raw.alertsEnabled && alarmOn)))
    {
        return null;
    }
    const paused = hasControl && !raw.monitoringEnabled;
    if (paused && (angleDeg !== null || alarmOn))
    {
        return null;
    }
    if (!paused && sensorOk && (typeof angleDeg !== "number" || !Number.isFinite(angleDeg) || Math.abs(angleDeg) > 180))
    {
        return null;
    }
    if (!sensorOk && angleDeg !== null)
    {
        return null;
    }
    const reading = { deviceId, bootId, seq, sensorOk, alarmOn, angleDeg, thresholdOn, thresholdOff };
    if (hasControl)
    {
        reading.monitoringEnabled = raw.monitoringEnabled;
        reading.modeLedOn = raw.modeLedOn;
        reading.lastCommandId = raw.lastCommandId;
    }
    if (hasAlertSettings)
    {
        reading.alertsEnabled = raw.alertsEnabled;
        reading.settingsSaveFailed = raw.settingsSaveFailed === true;
    }
    return reading;
}

export function calculateStatus(reading, receivedAt, now = Date.now(), staleMs = STALE_MS)
{
    if (!reading || !receivedAt || now - receivedAt > staleMs || now < receivedAt)
    {
        return "stale";
    }
    if (reading.monitoringEnabled === false)
    {
        return "paused";
    }
    if (!reading.sensorOk)
    {
        return "sensor-error";
    }
    return reading.alertsEnabled === false ? "angle-only" : reading.alarmOn ? "alarm" : "safe";
}

export function nextAlarmState(currentAlarm, absAngle, sensorOk, on = 15, off = 12)
{
    if (!sensorOk || !Number.isFinite(absAngle))
    {
        return false;
    }
    if (currentAlarm)
    {
        return absAngle > off;
    }
    return absAngle >= on;
}
