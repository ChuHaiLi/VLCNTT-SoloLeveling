/*
 * One firmware for Wokwi and real ESP32. Select the PlatformIO environment.
 * Sensor/buzzer/Serial run on the Arduino loop; only the network task owns MQTT.
 */

#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <Preferences.h>
#include <PubSubClient.h>
#include <math.h>
#include <freertos/FreeRTOS.h>
#include <freertos/queue.h>
#include <freertos/task.h>
#include "config.h"
#include "buzzer_alert.h"
#include "static_tilt.h"
#include "monitoring_control.h"

constexpr uint8_t MPU_ADDRESS = 0x68;
constexpr uint8_t MPU_POWER = 0x6B;
constexpr uint8_t MPU_ID = 0x75;
constexpr uint8_t MPU_ACCEL_FIRST = 0x3B;
constexpr uint8_t MPU_ACCEL_CONFIG = 0x1C;
constexpr uint8_t SDA_PIN = 21;
constexpr uint8_t SCL_PIN = 22;
constexpr uint8_t BUZZER_PIN = 25;
constexpr uint8_t BUZZER_CHANNEL = 0;
constexpr uint8_t MODE_LED_PIN = 26;

constexpr float THRESHOLD_ON = 15.0f;
constexpr float THRESHOLD_OFF = 12.0f;
constexpr uint32_t SENSOR_PERIOD_MS = 100;
constexpr uint32_t TELEMETRY_PERIOD_MS = 500;
constexpr uint32_t RETRY_PERIOD_MS = 5000;

Preferences preferences;

struct Telemetry
{
    bool sensorOk;
    bool alarmOn;
    float angleDeg;
    uint32_t seq;
    uint32_t sampledAt;
    bool monitoringEnabled;
    bool modeLedOn;
    uint32_t lastCommandId;
};

QueueHandle_t telemetryQueue = nullptr;
QueueHandle_t commandQueue = nullptr;
MonitoringState monitoring;
bool modeLedOn = false;
char commandTopic[120];

bool sensorOk = false;
bool alarmOn = false;
bool angleInitialized = false;
float rawAngle = 0.0f;
float filteredAngle = 0.0f;
StaticTilt staticTilt;
Acceleration rawAcceleration = {0.0f, 0.0f, 1.0f};

uint32_t bootId = 0;
uint32_t sequenceNumber = 0;
uint32_t lastSensor = 0;
uint32_t lastTelemetry = 0;
uint32_t lastLog = 0;
uint32_t maxSampleGap = 0;
uint32_t maxSampleWorkUs = 0;
bool calibrating = false;
uint8_t calibrationSamples = 0;
uint8_t calibrationValid = 0;
Acceleration calibrationSum = {0.0f, 0.0f, 0.0f};

#if TILT_WOKWI
bool serialAccelEnabled = false;
bool serialFault = false;
float serialAx = 0.0f;
float serialAy = 0.0f;
float serialAz = 1.0f;
#endif

bool writeRegister(uint8_t reg, uint8_t value)
{
    Wire.beginTransmission(MPU_ADDRESS);
    Wire.write(reg);
    Wire.write(value);
    return Wire.endTransmission() == 0;
}

bool readRegister(uint8_t reg, uint8_t &value)
{
    Wire.beginTransmission(MPU_ADDRESS);
    Wire.write(reg);
    if (Wire.endTransmission(false) != 0)
    {
        return false;
    }
    if (Wire.requestFrom(MPU_ADDRESS, static_cast<uint8_t>(1)) != 1)
    {
        return false;
    }
    value = Wire.read();
    return true;
}

bool initializeMpu()
{
    uint8_t id = 0;
    return readRegister(MPU_ID, id) && id == 0x68 &&
           writeRegister(MPU_POWER, 0x00) &&
           writeRegister(MPU_ACCEL_CONFIG, 0x00); // Select +/-2g => 16384 LSB/g.
}

int16_t readAxis()
{
    // Sequence the two reads explicitly: high byte first, then low byte.
    uint8_t highByte = static_cast<uint8_t>(Wire.read());
    uint8_t lowByte = static_cast<uint8_t>(Wire.read());
    return static_cast<int16_t>((static_cast<uint16_t>(highByte) << 8) | lowByte);
}

bool readAcceleration(Acceleration &result)
{
    float ax;
    float ay;
    float az;
#if TILT_WOKWI
    if (serialFault)
    {
        return false;
    }
    if (serialAccelEnabled)
    {
        ax = serialAx;
        ay = serialAy;
        az = serialAz;
    }
    else
#endif
    {
        Wire.beginTransmission(MPU_ADDRESS);
        Wire.write(MPU_ACCEL_FIRST);
        if (Wire.endTransmission(false) != 0)
        {
            return false;
        }
        if (Wire.requestFrom(MPU_ADDRESS, static_cast<uint8_t>(6)) != 6)
        {
            return false;
        }

        int16_t x = readAxis();
        int16_t y = readAxis();
        int16_t z = readAxis();
        ax = static_cast<float>(x) / 16384.0f;
        ay = static_cast<float>(y) / 16384.0f;
        az = static_cast<float>(z) / 16384.0f;
    }
    result = {ax, ay, az};
    return true;
}

void setBuzzer(uint32_t now)
{
#if BUZZER_PASSIVE
    static BuzzerAlert alert;
    static uint16_t previousFrequency = 0;
    uint16_t frequency = alert.frequency(now, !monitoring.enabled || sensorOk, monitoring.enabled && alarmOn);
    if (frequency != previousFrequency)
    {
        ledcWriteTone(BUZZER_CHANNEL, frequency);
        previousFrequency = frequency;
    }
#else
    // Active buzzers contain an oscillator, so preserve their on/off behavior.
    bool active = monitoring.enabled && (sensorOk ? alarmOn : ((now % 1000) < 170));
    static bool previous = false;
    if (active != previous)
    {
        digitalWrite(BUZZER_PIN, (active != static_cast<bool>(BUZZER_ACTIVE_LOW)) ? HIGH : LOW);
        previous = active;
    }
#endif
}

void sampleSensor(uint32_t now)
{
    Acceleration acceleration;
    float value = 0.0f;
    if (!readAcceleration(acceleration) || !staticTilt.angle(acceleration, value))
    {
        sensorOk = false;
        alarmOn = false;
        angleInitialized = false;
        setBuzzer(now);
        return;
    }
    sensorOk = true;
    rawAcceleration = acceleration;
    rawAngle = value;
    if (!angleInitialized)
    {
        filteredAngle = rawAngle;
        angleInitialized = true;
    }
    else
    {
        filteredAngle = 0.75f * filteredAngle + 0.25f * rawAngle;
    }
    float absAngle = fabsf(filteredAngle);
    if (!alarmOn && absAngle >= THRESHOLD_ON)
    {
        alarmOn = true;
    }
    else if (alarmOn && absAngle <= THRESHOLD_OFF)
    {
        alarmOn = false;
    }
    setBuzzer(now);
}

void serviceCalibration()
{
    if (!calibrating)
    {
        return;
    }
    calibrationSamples++;
    if (sensorOk)
    {
        calibrationSum.x += rawAcceleration.x;
        calibrationSum.y += rawAcceleration.y;
        calibrationSum.z += rawAcceleration.z;
        calibrationValid++;
    }
    if (calibrationSamples < 30)
    {
        return;
    }
    calibrating = false;
    if (calibrationValid < 25)
    {
        Serial.println("CAL failed: sensor data unavailable");
        return;
    }
    Acceleration average = {
        calibrationSum.x / calibrationValid,
        calibrationSum.y / calibrationValid,
        calibrationSum.z / calibrationValid
    };
    StaticTilt calibrated;
    if (!calibrated.setReference(average))
    {
        Serial.println("CAL failed: invalid gravity reference; keep tray still");
        return;
    }
    const Acceleration &reference = calibrated.reference();
    if (preferences.putBytes("ref-v1", &reference, sizeof(reference)) != sizeof(reference))
    {
        Serial.println("CAL failed: cannot save Preferences");
        return;
    }
    staticTilt = calibrated;
    angleInitialized = false;
    alarmOn = false;
    Serial.printf("CAL done: gravityReference=(%.5f,%.5f,%.5f)\r\n", reference.x, reference.y, reference.z);
}

void queueTelemetry(uint32_t now)
{
    if (telemetryQueue)
    {
        Telemetry reading = {
            sensorOk, alarmOn, filteredAngle, sequenceNumber++, now,
            monitoring.enabled, modeLedOn, monitoring.lastCommandId
        };
        xQueueOverwrite(telemetryQueue, &reading);
    }
}

void applyPendingControl(uint32_t now)
{
    MonitoringCommand command;
    if (!commandQueue || xQueueReceive(commandQueue, &command, 0) != pdTRUE)
    {
        return;
    }
    bool wasEnabled = monitoring.enabled;
    if (!monitoring.apply(command, bootId))
    {
        return;
    }
    digitalWrite(MODE_LED_PIN, monitoring.enabled ? HIGH : LOW);
    modeLedOn = digitalRead(MODE_LED_PIN) == HIGH;
    if (wasEnabled != monitoring.enabled)
    {
        angleInitialized = false;
        alarmOn = false;
        rawAngle = NAN;
        filteredAngle = NAN;
        if (!monitoring.enabled)
        {
            if (calibrating)
            {
                Serial.println("CAL cancelled: monitoring paused");
            }
            calibrating = false;
        }
        else
        {
            // Resume with a fresh reading rather than the angle before pausing.
            sampleSensor(now);
        }
        lastSensor = now;
    }
    setBuzzer(now);
    // Publish acknowledgement only after the mode and physical GPIO are applied.
    queueTelemetry(now);
    Serial.printf("CONTROL requestId=%lu monitoring=%s led=%d\r\n",
                  static_cast<unsigned long>(monitoring.lastCommandId), monitoring.enabled ? "on" : "paused", modeLedOn);
}

void receiveMqttCommand(char *topic, uint8_t *payload, unsigned int length)
{
    MonitoringCommand command;
    if (strcmp(topic, commandTopic) == 0 &&
        parseMonitoringCommand(payload, length, bootId, command))
    {
        // MQTT runs on its own task; GPIO, sensor and alarm state belong to loop().
        xQueueOverwrite(commandQueue, &command);
    }
    else
    {
        Serial.println("CONTROL rejected: invalid command or wrong bootId");
    }
}

bool publishTelemetry(PubSubClient &mqtt, const Telemetry &reading)
{
    char payload[384];
    char angle[25];
    if (reading.sensorOk && reading.monitoringEnabled)
    {
        snprintf(angle, sizeof(angle), "%.2f", reading.angleDeg);
    }
    else
    {
        snprintf(angle, sizeof(angle), "null");
    }
    snprintf(
        payload, sizeof(payload),
        "{\"deviceId\":\"%s\",\"bootId\":%lu,\"seq\":%lu,\"sensorOk\":%s,\"alarmOn\":%s,\"angleDeg\":%s,\"thresholdOn\":15,\"thresholdOff\":12,\"monitoringEnabled\":%s,\"modeLedOn\":%s,\"lastCommandId\":%lu}",
        DEVICE_ID,
        static_cast<unsigned long>(bootId),
        static_cast<unsigned long>(reading.seq),
        reading.sensorOk ? "true" : "false",
        reading.alarmOn ? "true" : "false",
        angle,
        reading.monitoringEnabled ? "true" : "false",
        reading.modeLedOn ? "true" : "false",
        static_cast<unsigned long>(reading.lastCommandId)
    );
    return mqtt.publish("tilt-tray/telemetry", payload, false);
}

void networkTask(void *)
{
    WiFiClient tcp;
    PubSubClient mqtt(tcp);
    mqtt.setServer(MQTT_HOST, MQTT_PORT);
    mqtt.setSocketTimeout(1);
    mqtt.setBufferSize(512);
    mqtt.setCallback(receiveMqttCommand);
    WiFi.mode(WIFI_STA);
    uint32_t lastWifiAttempt = millis() - RETRY_PERIOD_MS;
    uint32_t lastMqttAttempt = millis() - RETRY_PERIOD_MS;
    uint32_t lastPublishedSeq = UINT32_MAX;
    bool wifiWasConnected = false;
    for (;;)
    {
        uint32_t now = millis();
        bool wifiConnected = WiFi.status() == WL_CONNECTED;
        if (wifiConnected != wifiWasConnected)
        {
            Serial.printf("NET wifi=%s\r\n", wifiConnected ? "connected" : "disconnected");
            wifiWasConnected = wifiConnected;
        }
        if (!wifiConnected)
        {
            // Drop the previous TCP session before Wi-Fi reconnects.
            tcp.stop();
            if (now - lastWifiAttempt >= RETRY_PERIOD_MS)
            {
                lastWifiAttempt = now;
#if TILT_WOKWI
                WiFi.begin(WIFI_NAME, WIFI_PASSWORD, 6);
#else
                WiFi.begin(WIFI_NAME, WIFI_PASSWORD);
#endif
            }
        }
        else if (!mqtt.connected())
        {
            if (now - lastMqttAttempt >= RETRY_PERIOD_MS)
            {
                lastMqttAttempt = now;
                char clientId[40];
                snprintf(clientId, sizeof(clientId), "tilt-tray-%08lx", static_cast<unsigned long>(bootId));
                uint32_t started = millis();
                // Clean session: commands are not queued while the device is offline.
                bool connected = mqtt.connect(clientId);
                if (connected && !mqtt.subscribe(commandTopic, 0))
                {
                    mqtt.disconnect();
                    connected = false;
                }
                Serial.printf("NET mqtt=%s state=%d attemptMs=%lu\r\n", connected ? "connected" : "retry", mqtt.state(), static_cast<unsigned long>(millis() - started));
            }
        }
        else
        {
            mqtt.loop();
            Telemetry reading;
            // Queue length 1: reconnect publishes the newest sample, never a backlog.
            if (xQueuePeek(telemetryQueue, &reading, 0) == pdTRUE &&
                reading.seq != lastPublishedSeq && millis() - reading.sampledAt <= 1000)
            {
                if (publishTelemetry(mqtt, reading))
                {
                    lastPublishedSeq = reading.seq;
                }
            }
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}

void handleCommand(const char *command)
{
    Serial.printf("CMD> %s\r\n", command);
    if (strcasecmp(command, "CAL") == 0)
    {
        if (!monitoring.enabled)
        {
            Serial.println("CAL rejected: start monitoring from the web first");
            return;
        }
#if TILT_WOKWI
        if (serialAccelEnabled || serialFault)
        {
            Serial.println("CAL rejected: send I2C and FAULT OFF; place MPU flat first");
            return;
        }
#endif
        calibrationSum = {0.0f, 0.0f, 0.0f};
        calibrationValid = 0;
        calibrationSamples = 0;
        calibrating = true;
        Serial.println("CAL started: keep horizontal for 3 seconds");
        return;
    }
#if TILT_WOKWI
    if (strcasecmp(command, "I2C") == 0)
    {
        serialAccelEnabled = false;
        Serial.println("SOURCE=I2C");
        return;
    }
    if (strcasecmp(command, "FAULT ON") == 0 || strcasecmp(command, "FAULT OFF") == 0)
    {
        serialFault = strcasecmp(command, "FAULT ON") == 0;
        Serial.printf("FAULT=%s (Wokwi injected fault)\r\n", serialFault ? "ON" : "OFF");
        return;
    }
    float ax;
    float ay;
    float az;
    char extra;
    if (sscanf(command, "ACCEL %f %f %f %c", &ax, &ay, &az, &extra) == 3 &&
        isfinite(ax) && isfinite(ay) && isfinite(az) &&
        fabsf(ax) <= 2 && fabsf(ay) <= 2 && fabsf(az) <= 2)
    {
        if (calibrating)
        {
            Serial.println("ACCEL rejected: wait for CAL done");
            return;
        }
        serialAx = ax;
        serialAy = ay;
        serialAz = az;
        serialAccelEnabled = true;
        Serial.printf("SOURCE=SERIAL_ACCEL (bypasses I2C) ax=%.5f ay=%.5f az=%.5f\r\n", ax, ay, az);
        return;
    }
#endif
    Serial.println("Unknown command (CAL; Wokwi only: ACCEL x y z, I2C, FAULT ON/OFF)");
}

void serviceSerial()
{
    static char command[80];
    static size_t length = 0;
    static bool overflow = false;
    // Bounded non-blocking parser: even a partial line cannot stall sampling.
    for (uint8_t count = 0; count < 32 && Serial.available(); count++)
    {
        char c = static_cast<char>(Serial.read());
        if ((c == '\b' || c == 127) && !overflow)
        {
            if (length > 0)
            {
                length--;
            }
            continue;
        }
        if (c == '\r' || c == '\n')
        {
            if (overflow)
            {
                Serial.println("Command too long");
            }
            else if (length > 0)
            {
                command[length] = '\0';
                handleCommand(command);
            }
            length = 0;
            overflow = false;
        }
        else if (length < sizeof(command) - 1 && !overflow)
        {
            command[length++] = c;
        }
        else
        {
            overflow = true;
        }
    }
}

void setup()
{
    Serial.begin(115200);
    pinMode(MODE_LED_PIN, OUTPUT);
    digitalWrite(MODE_LED_PIN, monitoring.enabled ? HIGH : LOW);
    modeLedOn = digitalRead(MODE_LED_PIN) == HIGH;
    pinMode(BUZZER_PIN, OUTPUT);
#if BUZZER_PASSIVE
    ledcSetup(BUZZER_CHANNEL, 1200, 10);
    ledcAttachPin(BUZZER_PIN, BUZZER_CHANNEL);
    ledcWriteTone(BUZZER_CHANNEL, 0);
#else
    digitalWrite(BUZZER_PIN, BUZZER_ACTIVE_LOW ? HIGH : LOW);
#endif
    Wire.begin(SDA_PIN, SCL_PIN);
    Wire.setClock(100000);
    Wire.setTimeOut(50);

    preferences.begin("tilt-tray", false);
    // Versioned vector reference replaces the previous one-axis scalar offset.
    // Never interpret an old "zero" value as a three-axis calibration.
    if (preferences.getBytesLength("ref-v1") == sizeof(Acceleration))
    {
        Acceleration stored;
        if (preferences.getBytes("ref-v1", &stored, sizeof(stored)) != sizeof(stored) ||
            !staticTilt.setReference(stored))
        {
            Serial.println("CAL reference invalid: using +Z; send CAL on a horizontal surface");
        }
    }
    else
    {
        Serial.println("CAL reference missing: using +Z; send CAL on a horizontal surface");
    }
    bootId = esp_random();

    sensorOk = initializeMpu();
    if (!sensorOk)
    {
        Serial.println("MPU6050 not found: check wiring and 3.3 V");
    }
    telemetryQueue = xQueueCreate(1, sizeof(Telemetry));
    commandQueue = xQueueCreate(1, sizeof(MonitoringCommand));
    snprintf(commandTopic, sizeof(commandTopic), "tilt-tray/command/%s", DEVICE_ID);
    if (!telemetryQueue || !commandQueue || xTaskCreatePinnedToCore(networkTask, "network", 6144, nullptr, 1, nullptr, 0) != pdPASS)
    {
        Serial.println("NET task allocation failed; local alarm continues");
    }
    const Acceleration &reference = staticTilt.reference();
    Serial.printf("BOOT device=%s bootId=%lu gravityReference=(%.5f,%.5f,%.5f) SOURCE=I2C\r\n",
                  DEVICE_ID, static_cast<unsigned long>(bootId), reference.x, reference.y, reference.z);
    Serial.println("TILT static XYZ: total inclination 0..180 degrees relative to CAL");
    Serial.printf("CONTROL topic=%s LED=GPIO%u monitoring=on\r\n", commandTopic, MODE_LED_PIN);
#if BUZZER_PASSIVE
    Serial.println("BUZZER passive: dual-tone 1200Hz/150ms, 1800Hz/150ms, silent/100ms");
#else
    Serial.println("BUZZER active: on/off only; dual-tone requires a passive buzzer");
#endif
    Serial.println("Send CAL in Serial Monitor when tray is horizontal.");
}

void loop()
{
    uint32_t now = millis();
    applyPendingControl(now);
    if (monitoring.enabled && now - lastSensor >= SENSOR_PERIOD_MS)
    {
        uint32_t gap = now - lastSensor;
        if (gap > maxSampleGap)
        {
            maxSampleGap = gap;
        }
        lastSensor = now;
        uint32_t started = micros();
        if (!sensorOk)
        {
            initializeMpu();
        }
        sampleSensor(now);
        serviceCalibration();
        uint32_t work = micros() - started;
        if (work > maxSampleWorkUs)
        {
            maxSampleWorkUs = work;
        }
    }
    setBuzzer(now);

    serviceSerial();
    if (now - lastTelemetry >= TELEMETRY_PERIOD_MS)
    {
        lastTelemetry = now;
        queueTelemetry(now);
    }
    if (now - lastLog >= 1000)
    {
        lastLog = now;
        const char *source = "I2C";
#if TILT_WOKWI
        source = serialAccelEnabled ? "SERIAL_ACCEL" : "I2C";
#endif
        Serial.printf("SAMPLE source=%s monitoring=%s led=%d sensorOk=%d raw=%.2f angle=%.2f alarmOn=%d buzzer=%s maxGapMs=%lu maxWorkUs=%lu\r\n",
                      source, monitoring.enabled ? "on" : "paused", modeLedOn,
                      sensorOk, sensorOk && monitoring.enabled ? rawAngle : NAN,
                      sensorOk && monitoring.enabled ? filteredAngle : NAN, alarmOn,
                      !monitoring.enabled ? "silent" : sensorOk ? (alarmOn ? "tilt" : "silent") : "fault-beep",
                      static_cast<unsigned long>(maxSampleGap), static_cast<unsigned long>(maxSampleWorkUs));
        maxSampleGap = 0;
        maxSampleWorkUs = 0;
    }
    delay(1);
}
