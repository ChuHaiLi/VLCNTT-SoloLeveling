#include "../firmware/buzzer_alert.h"

#include <assert.h>
#include <stdio.h>

void testCycle()
{
    BuzzerAlert alert;
    assert(alert.frequency(900, true, false) == 0);
    for (uint32_t elapsed = 0; elapsed < 4000; elapsed++)
    {
        uint32_t phase = elapsed % 400;
        uint16_t expected = phase < 150 ? 1200 : phase < 300 ? 1800 : 0;
        assert(alert.frequency(1000 + elapsed, true, true) == expected);
    }
}

void testImmediateStopAndRestart()
{
    // Stop at every possible point in a cycle, including during either tone.
    for (uint32_t phase = 0; phase < 400; phase++)
    {
        BuzzerAlert alert;
        assert(alert.frequency(1000, true, true) == 1200);
        alert.frequency(1000 + phase, true, true);
        assert(alert.frequency(1000 + phase, true, false) == 0);
        assert(alert.frequency(1001 + phase, true, false) == 0);
        assert(alert.frequency(1002 + phase, true, true) == 1200);
    }
}

void testFaultAndRecovery()
{
    BuzzerAlert alert;
    assert(alert.frequency(500, true, true) == 1200);
    assert(alert.frequency(650, true, true) == 1800);
    assert(alert.frequency(1000, false, false) == 2000);
    assert(alert.frequency(1169, false, false) == 2000);
    assert(alert.frequency(1170, false, false) == 0);
    assert(alert.frequency(2000, false, true) == 2000);
    assert(alert.frequency(2170, false, true) == 0);
    assert(alert.frequency(2200, true, false) == 0);
    assert(alert.frequency(2300, true, true) == 1200);
    assert(alert.frequency(2450, true, true) == 1800);
}

void testClockWrapAndMissedUpdates()
{
    BuzzerAlert alert;
    uint32_t start = UINT32_MAX - 80;
    for (uint32_t elapsed = 0; elapsed < 2000; elapsed++)
    {
        uint32_t phase = elapsed % 400;
        uint16_t expected = phase < 150 ? 1200 : phase < 300 ? 1800 : 0;
        assert(alert.frequency(start + elapsed, true, true) == expected);
    }
    assert(alert.frequency(start + 40000, true, true) == 1200);
    assert(alert.frequency(start + 40150, true, true) == 1800);
    assert(alert.frequency(start + 40300, true, true) == 0);
}

int main()
{
    testCycle();
    testImmediateStopAndRestart();
    testFaultAndRecovery();
    testClockWrapAndMissedUpdates();
    puts("PASS: dual-tone timing, immediate stop/restart, fault beep, clock wrap, missed updates");
    return 0;
}
