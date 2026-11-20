# Tech Stack của hộp cảnh báo độ nghiêng

Hệ thống dùng ESP32 tính góc và phát cảnh báo tại hộp. Máy tính chạy Mosquitto, backend Express và giao diện React. Hai phía trao đổi số đo và lệnh bật hoặc tạm dừng giám sát.

Phạm vi hiện tại là đo nghiêng tĩnh hoặc nghiêng chậm. Phần mềm đã được thử bằng Wokwi và các bài kiểm thử tự động. Nguyên mẫu phần cứng thật chưa được lắp. Cơ cấu tự điều chỉnh khay thuộc hướng phát triển sau này.

## 1. Phần cứng và mô phỏng

| Thành phần | Vai trò | Cấu hình trong dự án | File liên quan |
| --- | --- | --- | --- |
| ESP32 DevKit | Đọc cảm biến, tính góc, điều khiển còi và LED, trao đổi MQTT | Board `esp32dev` | [platformio.ini:5-10](../platformio.ini#L5-L10) |
| MPU6050 | Cung cấp gia tốc X, Y, Z | I²C `0x68`, thang ±2 g, 16.384 LSB/g | [tilt_tray.cpp:20-29](../firmware/tilt_tray.cpp#L20-L29), [109-123](../firmware/tilt_tray.cpp#L109-L123) |
| Bus I²C | Nối ESP32 với MPU6050 | SDA GPIO21, SCL GPIO22, clock 100 kHz | [tilt_tray.cpp:558-560](../firmware/tilt_tray.cpp#L558-L560) |
| Piezo thụ động trong Wokwi | Phát hai cao độ cảnh báo và bíp lỗi | GPIO25, PWM LEDC channel 0 | [tilt_tray.cpp:166-187](../firmware/tilt_tray.cpp#L166-L187), [551-557](../firmware/tilt_tray.cpp#L551-L557) |
| LED xanh và điện trở 330 Ω | Báo chế độ giám sát | GPIO26, LED sáng khi giám sát và tắt khi tạm dừng | [diagram.json:23-25](../diagram.json#L23-L25), [tilt_tray.cpp:296-297](../firmware/tilt_tray.cpp#L296-L297) |
| Wokwi for VS Code | Chạy firmware ESP32 trong mô phỏng | Nạp `.bin` và `.elf` do PlatformIO build | [wokwi.toml:1-4](../wokwi.toml#L1-L4) |
| USB và Serial | Cấp nguồn, nạp board thật và nhập lệnh kiểm tra | Serial 115200 baud. Trong Wokwi dùng UART mô phỏng | [platformio.ini:9](../platformio.ini#L9), [diagram.json](../diagram.json) |

MPU6050 có cả accelerometer và gyroscope, nhưng firmware hiện chỉ đọc gia tốc. Giá trị Rotation trên Wokwi không được dùng để tính góc.

Loại buzzer thật chưa chốt. Build `hardware` mặc định dùng nhánh active. Khi chọn buzzer thụ động cần cấu hình lại `BUZZER_PASSIVE`. Còi active chỉ được bật/tắt, không bảo đảm phát hai cao độ như piezo Wokwi. Xem [config.h:18-24](../firmware/config.h#L18-L24).

## 2. Firmware

| Công nghệ hoặc thư viện | Cách dùng | Vị trí |
| --- | --- | --- |
| C++ với Arduino framework | Viết `setup()`, `loop()` và các lớp xử lý | [platformio.ini:8](../platformio.ini#L8), [tilt_tray.cpp:544-655](../firmware/tilt_tray.cpp#L544-L655) |
| PlatformIO | Quản lý board, framework, thư viện và hai cấu hình build | [platformio.ini](../platformio.ini) |
| Platform `espressif32@6.12.0` | Phiên bản platform được khóa trong cấu hình | [platformio.ini:6](../platformio.ini#L6) |
| PubSubClient `2.8` | MQTT client chạy trên ESP32 | [platformio.ini:10](../platformio.ini#L10), [tilt_tray.cpp:369-439](../firmware/tilt_tray.cpp#L369-L439) |
| `Wire.h` | Đọc và ghi thanh ghi MPU6050 qua I²C | [tilt_tray.cpp:85-164](../firmware/tilt_tray.cpp#L85-L164) |
| `WiFi.h` và `WiFiClient` | Kết nối Wi-Fi và cung cấp TCP cho MQTT | [tilt_tray.cpp:369-414](../firmware/tilt_tray.cpp#L369-L414) |
| `Preferences.h` | Lưu vector CAL bằng khóa `ref-v1`, đọc lại khi khởi động | [tilt_tray.cpp:260-269](../firmware/tilt_tray.cpp#L260-L269), [562-577](../firmware/tilt_tray.cpp#L562-L577) |
| FreeRTOS | Task mạng riêng, queue trao đổi với vòng xử lý cảm biến | [tilt_tray.cpp:272-339](../firmware/tilt_tray.cpp#L272-L339), [585-590](../firmware/tilt_tray.cpp#L585-L590) |
| `<math.h>` | `atan2f`, `sqrtf`, `isfinite`, `fabsf` | [static_tilt.h:3-61](../firmware/static_tilt.h#L3-L61) |
| LEDC PWM và `millis()` | Chọn tần số còi theo thời gian, không chờ hết một âm mới xử lý tiếp | [buzzer_alert.h:9-47](../firmware/buzzer_alert.h#L9-L47), [tilt_tray.cpp:166-187](../firmware/tilt_tray.cpp#L166-L187) |

`atan2f` là hàm toán học được thư viện toán của toolchain cung cấp qua `<math.h>`. Dự án tự viết cách tính tích có hướng, tích vô hướng và chuẩn hóa vector, rồi gọi hàm này để nhận góc theo radian. Hệ số `57.2957795131f` đổi radian sang độ. Hàm được gọi tại [static_tilt.h:51](../firmware/static_tilt.h#L51).

### Hai cấu hình build

| Mục | `wokwi` | `hardware` |
| --- | --- | --- |
| Cờ build | `TILT_WOKWI=1`, `BUZZER_PASSIVE=1` | `TILT_WOKWI=0` |
| Wi-Fi | `Wokwi-GUEST` | Đọc cấu hình cục bộ từ `secrets.h` |
| Broker | `host.wokwi.internal:1883` | Địa chỉ broker phù hợp mạng của ESP32 thật |
| Mã thiết bị | `khay-01-WOKWI` | `khay-01` |
| Lệnh kiểm tra | `CAL`, `I2C`, `ACCEL`, `FAULT ON/OFF` | `CAL` |
| Buzzer mặc định | Thụ động, phát hai cao độ | Active, có thể đổi theo linh kiện |

Cấu hình nằm trong [platformio.ini:12-21](../platformio.ini#L12-L21) và [config.h:7-24](../firmware/config.h#L7-L24). Hai môi trường dùng chung `firmware/tilt_tray.cpp`.

## 3. Backend và giao tiếp

| Công nghệ | Phiên bản trong cấu hình | Phiên bản trong lockfile | Vai trò |
| --- | --- | --- | --- |
| Node.js | Repo không khóa phiên bản Node cụ thể | Không áp dụng | Chạy backend, công cụ giả lập và bài kiểm thử |
| JavaScript ES modules | `type: module` | Không áp dụng | Các file `.mjs` dùng `import` và `export` |
| Express | `^4.21.2` | `4.22.3` | Cung cấp API trạng thái, health và điều khiển |
| MQTT.js | `^5.12.0` | `5.16.1` | Backend kết nối và trao đổi bản tin với broker |
| Eclipse Mosquitto | Repo không khóa phiên bản bộ cài | Không áp dụng | MQTT broker chạy trên máy tính |

Nguồn phiên bản: [backend/package.json](../backend/package.json), [Express trong lockfile](../backend/package-lock.json#L413-L416), [MQTT.js trong lockfile](../backend/package-lock.json#L756-L759). Dải `^...` trong `package.json` và phiên bản đã giải quyết trong lockfile có ý nghĩa khác nhau. Dùng `npm ci` để cài theo lockfile.

Backend giữ một bản tin hợp lệ mới nhất trong RAM. Chưa có database, lịch sử đo hoặc biểu đồ lưu dài hạn. Phần lưu trạng thái ở [index.mjs:20-25](../backend/index.mjs#L20-L25) và [64-73](../backend/index.mjs#L64-L73).

### Kênh giao tiếp chính

| Kênh | Địa chỉ hoặc nội dung | Cách sử dụng |
| --- | --- | --- |
| Telemetry MQTT | `tilt-tray/telemetry` | ESP32 gửi JSON khoảng 500 ms/lần |
| Lệnh MQTT | `tilt-tray/command/<deviceId>` | Backend gửi `SET_MONITORING <bootId> <requestId> <0\|1>` |
| HTTP GET | `/api/status` | Web lấy số đo và trạng thái |
| HTTP GET | `/api/health` | Kiểm tra backend và trạng thái kết nối broker |
| HTTP POST | `/api/monitoring` | Body chỉ gồm `enabled: true` hoặc `enabled: false` |

API ở [app.mjs:9-47](../backend/app.mjs#L9-L47). Telemetry được tạo ở [tilt_tray.cpp:341-367](../firmware/tilt_tray.cpp#L341-L367), lệnh được tạo ở [control.mjs:84-96](../backend/control.mjs#L84-L96).

MQTT dùng QoS 0. Lệnh không retain, backend không xếp hàng QoS 0 khi mất kết nối. Xác nhận điều khiển nằm trong telemetry sau khi ESP32 áp dụng chế độ và GPIO, không có topic ACK riêng.

## 4. Frontend

| Công nghệ | Dải trong `package.json` | Trong lockfile | Cách dùng |
| --- | --- | --- | --- |
| React | `^19.0.0` | `19.3.1` | Hiển thị góc, trạng thái, kết nối và các nút điều khiển |
| React DOM | `^19.0.0` | `19.3.1` | Gắn ứng dụng vào phần tử `root` |
| Vite | `^6.3.0` | `6.4.6` | Dev server, build và proxy `/api` sang backend |
| JSX và CSS | Không có phiên bản riêng | Không áp dụng | Khai báo giao diện và định dạng |
| Fetch API | API trình duyệt | Không áp dụng | HTTP GET trạng thái và POST điều khiển |

Nguồn: [frontend/package.json](../frontend/package.json), [React](../frontend/package-lock.json#L975-L978), [React DOM](../frontend/package-lock.json#L985-L988), [Vite](../frontend/package-lock.json#L1076-L1079), [main.jsx:1-3](../frontend/src/main.jsx#L1-L3), [style.css:1-15](../frontend/src/style.css#L1-L15).

Web lấy trạng thái bằng polling khoảng mỗi giây, không dùng WebSocket. Yêu cầu lấy trạng thái có timeout 2,5 giây. Yêu cầu đổi chế độ có timeout 6,5 giây. Xem [main.jsx:22-71](../frontend/src/main.jsx#L22-L71) và [85-138](../frontend/src/main.jsx#L85-L138).

Vite proxy `/api` đến `http://127.0.0.1:3000` trong môi trường phát triển. Đây là cấu hình dev server, không phải cấu hình triển khai production. Xem [vite.config.js:3-9](../frontend/vite.config.js#L3-L9).

## 5. Địa chỉ và chu kỳ cần nhớ

| Mục | Giá trị | Nơi khai báo |
| --- | --- | --- |
| Broker demo | `127.0.0.1:1883` | [mosquitto.conf:2](../mosquitto.conf#L2), [index.mjs:8](../backend/index.mjs#L8) |
| Broker nhìn từ Wokwi | `host.wokwi.internal:1883` | [config.h:10-11](../firmware/config.h#L10-L11) |
| Backend | `http://127.0.0.1:3000` mặc định | [index.mjs:6](../backend/index.mjs#L6), [82-86](../backend/index.mjs#L82-L86) |
| Web dev | Mặc định Vite thường dùng `http://127.0.0.1:5173`, có thể đổi cổng khi cổng bận | [frontend/package.json](../frontend/package.json), địa chỉ thực tế do Vite in khi chạy |
| Lấy mẫu cảm biến | Khoảng 100 ms | [tilt_tray.cpp:33](../firmware/tilt_tray.cpp#L33) |
| Chuẩn bị telemetry | Khoảng 500 ms, có thể thêm bản tin sau lệnh | [tilt_tray.cpp:34](../firmware/tilt_tray.cpp#L34), [320-321](../firmware/tilt_tray.cpp#L320-L321) |
| Thử nối lại Wi-Fi/MQTT | Mốc thử lại 5 giây | [tilt_tray.cpp:35](../firmware/tilt_tray.cpp#L35), [391-421](../firmware/tilt_tray.cpp#L391-L421) |
| Dữ liệu cũ | Hơn 5 giây không có telemetry hợp lệ | [state.mjs:1](../backend/state.mjs#L1), [51-65](../backend/state.mjs#L51-L65) |
| Chờ xác nhận tại backend | Khoảng 4 giây | [control.mjs:9](../backend/control.mjs#L9), [90-93](../backend/control.mjs#L90-L93) |

Các chu kỳ trên là tham số phần mềm. Chưa có phép đo độ trễ đầu cuối trên phần cứng thật.

Broker demo chỉ lắng nghe localhost, cho phép anonymous và tắt persistence. Cấu hình này phục vụ demo cục bộ. ESP32 thật cần địa chỉ LAN và cấu hình mạng phù hợp. `bootId` và `requestId` giúp đối chiếu phiên và yêu cầu, không thay thế xác thực người dùng hoặc mã hóa.

## 6. Kiểm thử và công cụ phụ

| Công cụ | Kiểm tra gì | File |
| --- | --- | --- |
| `node:test`, `node:assert/strict` | Validator, trạng thái, API và điều khiển | [state.test.mjs](../backend/state.test.mjs), [control.test.mjs](../backend/control.test.mjs), [app.test.mjs](../backend/app.test.mjs) |
| C++ assertions, biên dịch bằng g++ | Góc XYZ, vector CAL, dữ liệu sai, chu kỳ còi và parser điều khiển | [static_tilt.test.cpp](../tests/static_tilt.test.cpp), [buzzer_alert.test.cpp](../tests/buzzer_alert.test.cpp), [monitoring_control.test.cpp](../tests/monitoring_control.test.cpp) |
| Mosquitto/API integration | Điều khiển, heartbeat, thiếu ACK, mất và phục hồi broker | [check-control.mjs:118-186](../backend/check-control.mjs#L118-L186) |
| Publisher giả lập Node | Cấp góc mẫu để thử đường MQTT đến backend/web, chưa hỗ trợ điều khiển đầy đủ | [simulate.mjs:21-48](../backend/simulate.mjs#L21-L48) |
| Demo HTML độc lập | Minh họa logic bằng biến trong trình duyệt, không nối ESP32/MQTT | [demo-gia-lap.html:87-164](../demo-gia-lap.html#L87-L164) |

Integration dùng broker cổng 19883 và API cổng 13000, peer ESP32 được giả lập bằng Node. Bài này không chạy firmware Wokwi và không kiểm tra âm thanh hay LED vật lý.

## 7. Công cụ thiết kế và trình bày

- VS Code, PlatformIO IDE và Wokwi phục vụ lập trình, build và mô phỏng.
- Autodesk Fusion phục vụ mô hình cơ khí dự kiến. Archive `TiltTray_Report_Concept.f3d` hiện không có trong repo. Bản vẽ tham khảo ở [TiltTray_Drawing_Concept.pdf](../../docs/output/pdf/TiltTray_Drawing_Concept.pdf).
- Canva và PowerPoint phục vụ slide. Bản trình bày ở [24127030.pptx](../../docs/24127030.pptx).

Chi tiết luồng và nơi xử lý trong code nằm trong [Luồng và chức năng](Luong_va_Chuc_nang.md). Lời trình bày theo slide nằm trong [Kịch bản thuyết trình](../../docs/Kich_ban_Thuyet_trinh.md).
