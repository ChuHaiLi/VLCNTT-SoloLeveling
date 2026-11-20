#pragma once

#ifndef TILT_WOKWI
#define TILT_WOKWI 0
#endif

#if TILT_WOKWI
constexpr char WIFI_NAME[] = "Wokwi-GUEST";
constexpr char WIFI_PASSWORD[] = "";
constexpr char MQTT_HOST[] = "host.wokwi.internal";
constexpr unsigned short MQTT_PORT = 1883;
constexpr char DEVICE_ID[] = "khay-01-WOKWI";
#else
#include "secrets.h"
constexpr char DEVICE_ID[] = "khay-01";
#endif

#ifndef BUZZER_PASSIVE
#define BUZZER_PASSIVE 0
#endif

#ifndef BUZZER_ACTIVE_LOW
#define BUZZER_ACTIVE_LOW 0
#endif

