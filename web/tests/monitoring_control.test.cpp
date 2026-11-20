#include "../firmware/monitoring_control.h"
#include "../firmware/buzzer_alert.h"

#include <assert.h>
#include <stdio.h>

bool parse(const char *text, MonitoringCommand &command, uint32_t bootId = 123)
{
    return parseControlCommand(reinterpret_cast<const uint8_t *>(text), strlen(text), bootId, command);
}

int main()
{
    MonitoringCommand command;
    assert(parse("SET_MONITORING 123 10 0", command));
    assert(command.bootId == 123 && command.requestId == 10 && !command.enabled);
    MonitoringState state;
    BuzzerAlert alert;
    assert(state.enabled && state.lastCommandId == 0);
    assert(alert.frequency(1000, true, true) == 1200);
    assert(state.apply(command, 123));
    assert(!state.enabled && state.lastCommandId == 10);
    assert(alert.frequency(1050, !state.enabled, state.enabled) == 0);
    assert(!state.apply(command, 123));
    assert(parse("SET_MONITORING 123 11 1", command));
    assert(state.apply(command, 123));
    assert(state.enabled && state.lastCommandId == 11);
    assert(alert.frequency(1100, true, state.enabled) == 1200);
    assert(!state.apply(command, 456));

    const char *invalid[] = {
        "SET_MONITORING 999 12 0", "SET_MONITORING 123 0 0", "SET_MONITORING 123 12 2",
        "SET_MONITORING 123 -1 0", "SET_MONITORING 123 4294967296 0",
        "SET_MONITORING 123 12 0 garbage", "SET_MONITORING 123 12", "CAL", "",
        "SET_MONITORING 123 12 0\n"
    };
    for (const char *text : invalid)
    {
        assert(!parse(text, command));
    }
    assert(parse("SET_MONITORING 4294967295 4294967295 1", command, UINT32_MAX));
    const uint8_t embeddedNull[] = "SET_MONITORING 123 12 0\0junk";
    assert(!parseControlCommand(embeddedNull, sizeof(embeddedNull) - 1, 123, command));

    assert(parse("SET_ALERT_SETTINGS 123 12 1 90 0", command));
    assert(command.updatesSettings && command.settings.valid());
    assert(command.settings.thresholdOn == 90 && command.settings.thresholdOff == 0);
    assert(state.accepts(command, 123) && !state.apply(command, 123));
    assert(parse("SET_ALERT_SETTINGS 123 13 1 20 16", command));
    assert(!command.settings.nextAlarm(false, 19.99f));
    assert(command.settings.nextAlarm(false, 20.0f));
    assert(command.settings.nextAlarm(true, 16.01f));
    assert(!command.settings.nextAlarm(true, 16.0f));
    assert(parse("SET_ALERT_SETTINGS 123 14 0 20 16", command));
    assert(!command.settings.nextAlarm(true, 90.0f));
    assert(!parse("SET_ALERT_SETTINGS 123 15 1 91 0", command));
    assert(!parse("SET_ALERT_SETTINGS 123 15 1 20 20", command));
    assert(!parse("SET_ALERT_SETTINGS 123 15 1 20 -1", command));
    assert(!parse("SET_ALERT_SETTINGS 123 15 1 20.5 16", command));
    assert(!parse("SET_ALERT_SETTINGS 123 15 2 20 16", command));
    assert(!parse("SET_ALERT_SETTINGS 124 15 1 20 16", command));
    assert(!parse("SET_ALERT_SETTINGS 123 15 1 20 16 ", command));
    puts("PASS: monitoring controls, alert settings, hysteresis, and angle-only mode");
    return 0;
}
