#pragma once

#include <stdint.h>

// Returns a requested PWM frequency; zero means silence. No waiting or I/O.
class BuzzerAlert
{
public:
    uint16_t frequency(uint32_t now, bool sensorOk, bool alarmOn)
    {
        if (!sensorOk)
        {
            running = false;
            // Preserve the existing sensor-fault beep: 170 ms once per second.
            return now % 1000 < 170 ? 2000 : 0;
        }
        if (!alarmOn)
        {
            running = false;
            return 0;
        }
        if (!running)
        {
            running = true;
            cycleStarted = now;
        }

        uint32_t elapsed = now - cycleStarted;
        if (elapsed >= CYCLE_MS)
        {
            // Advance the anchor without drift, including across millis() wrap.
            cycleStarted += elapsed - elapsed % CYCLE_MS;
            elapsed %= CYCLE_MS;
        }
        if (elapsed < 150)
        {
            return 1200;
        }
        if (elapsed < 300)
        {
            return 1800;
        }
        return 0;
    }

private:
    static constexpr uint32_t CYCLE_MS = 400;
    bool running = false;
    uint32_t cycleStarted = 0;
};

