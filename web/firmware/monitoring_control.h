#pragma once

#include <stdint.h>
#include <stddef.h>
#include <string.h>

struct MonitoringCommand
{
    uint32_t bootId;
    uint32_t requestId;
    bool enabled;
};

inline bool parseMonitoringCommand(const uint8_t *payload, size_t length, uint32_t bootId, MonitoringCommand &command)
{
    const char prefix[] = "SET_MONITORING ";
    const size_t prefixLength = sizeof(prefix) - 1;
    if (!payload || length <= prefixLength || length > 80 || memcmp(payload, prefix, prefixLength) != 0)
    {
        return false;
    }
    const char *cursor = reinterpret_cast<const char *>(payload) + prefixLength;
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
        !readUnsigned(enabled) || cursor != end || enabled > 1 || requestId == 0 || targetBoot != bootId)
    {
        return false;
    }
    command = {targetBoot, requestId, enabled == 1};
    return true;
}

struct MonitoringState
{
    bool enabled = true;
    uint32_t lastCommandId = 0;

    bool apply(const MonitoringCommand &command, uint32_t bootId)
    {
        if (command.bootId != bootId || command.requestId == 0 || command.requestId == lastCommandId)
        {
            return false;
        }
        enabled = command.enabled;
        lastCommandId = command.requestId;
        return true;
    }
};
