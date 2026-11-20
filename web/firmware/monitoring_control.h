#pragma once

#include <stdint.h>
#include <stddef.h>
#include <string.h>

struct AlarmSettings
{
    uint8_t thresholdOn = 15;
    uint8_t thresholdOff = 12;
    uint8_t alertsEnabled = 1;

    bool valid() const
    {
        return thresholdOn <= 90 && thresholdOff < thresholdOn && alertsEnabled <= 1;
    }

    bool nextAlarm(bool previous, float angle) const
    {
        return alertsEnabled && (previous ? angle > thresholdOff : angle >= thresholdOn);
    }
};

struct MonitoringCommand
{
    uint32_t bootId;
    uint32_t requestId;
    bool enabled;
    bool updatesSettings;
    AlarmSettings settings;
};

inline bool parseControlCommand(const uint8_t *payload, size_t length, uint32_t bootId, MonitoringCommand &command)
{
    const char monitoringPrefix[] = "SET_MONITORING ";
    const char settingsPrefix[] = "SET_ALERT_SETTINGS ";
    if (!payload || length > 80)
    {
        return false;
    }
    bool updatesSettings = length > sizeof(settingsPrefix) - 1 &&
        memcmp(payload, settingsPrefix, sizeof(settingsPrefix) - 1) == 0;
    if (!updatesSettings && (length <= sizeof(monitoringPrefix) - 1 ||
        memcmp(payload, monitoringPrefix, sizeof(monitoringPrefix) - 1) != 0))
    {
        return false;
    }
    const char *cursor = reinterpret_cast<const char *>(payload) +
        (updatesSettings ? sizeof(settingsPrefix) : sizeof(monitoringPrefix)) - 1;
    const char *end = reinterpret_cast<const char *>(payload) + length;
    auto readUnsigned = [&](uint32_t &value) -> bool
    {
        value = 0;
        const char *start = cursor;
        while (cursor < end && *cursor >= '0' && *cursor <= '9')
        {
            uint32_t digit = static_cast<uint32_t>(*cursor - '0');
            if (value > (UINT32_MAX - digit) / 10)
            {
                return false;
            }
            value = value * 10 + digit;
            cursor++;
        }
        return cursor > start;
    };
    uint32_t targetBoot;
    uint32_t requestId;
    uint32_t enabled;
    if (!readUnsigned(targetBoot) || cursor == end || *cursor++ != ' ' ||
        !readUnsigned(requestId) || cursor == end || *cursor++ != ' ' ||
        !readUnsigned(enabled) || enabled > 1 || requestId == 0 || targetBoot != bootId)
    {
        return false;
    }
    AlarmSettings settings;
    if (updatesSettings)
    {
        uint32_t on;
        uint32_t off;
        if (cursor == end || *cursor++ != ' ' || !readUnsigned(on) ||
            cursor == end || *cursor++ != ' ' || !readUnsigned(off) ||
            on > 90 || off >= on)
        {
            return false;
        }
        settings.thresholdOn = static_cast<uint8_t>(on);
        settings.thresholdOff = static_cast<uint8_t>(off);
        settings.alertsEnabled = static_cast<uint8_t>(enabled);
    }
    if (cursor != end)
    {
        return false;
    }
    command = {targetBoot, requestId, enabled == 1, updatesSettings, settings};
    return true;
}

struct MonitoringState
{
    bool enabled = true;
    uint32_t lastCommandId = 0;

    bool accepts(const MonitoringCommand &command, uint32_t bootId) const
    {
        return command.bootId == bootId && command.requestId != 0 && command.requestId != lastCommandId;
    }

    bool apply(const MonitoringCommand &command, uint32_t bootId)
    {
        if (command.updatesSettings || !accepts(command, bootId))
        {
            return false;
        }
        enabled = command.enabled;
        lastCommandId = command.requestId;
        return true;
    }
};
