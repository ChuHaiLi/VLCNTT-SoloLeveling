#pragma once

// Copy this file to secrets.h and fill in your own LAN settings.
// Do NOT upload secrets.h to a public repository.
constexpr char WIFI_NAME[] = "YOUR_WIFI_NAME";
constexpr char WIFI_PASSWORD[] = "YOUR_WIFI_PASSWORD";

// IP address of the computer running the MQTT broker on your local network.
// Never use 127.0.0.1 here: that would refer to the ESP32 itself.
constexpr char MQTT_HOST[] = "192.168.1.100";
constexpr unsigned short MQTT_PORT = 1883;

// Active buzzer is the default. Set these to match the actual component.
// Passive piezo: BUZZER_PASSIVE 1 (dual-tone PWM 1200/1800 Hz).
// Active-low module: BUZZER_PASSIVE 0, BUZZER_ACTIVE_LOW 1.
#define BUZZER_PASSIVE 0
#define BUZZER_ACTIVE_LOW 0
