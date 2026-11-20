# Hộp cảnh báo độ nghiêng và giám sát qua web

ESP32 đọc gia tốc từ MPU6050 để đo độ nghiêng tĩnh của khay, phát cảnh báo tại thiết bị và cho phép theo dõi, bật hoặc tạm dừng giám sát từ website.

| Thư mục | Nội dung |
| --- | --- |
| [web/](web/README.md) | Firmware ESP32, Wokwi, backend Express, frontend React và lệnh chạy, kiểm thử |
| [web/docs/](web/docs/) | [Tech stack](web/docs/Tech_Stack.md), [kiến trúc, luồng dữ liệu và chức năng](web/docs/Luong_va_Chuc_nang.md) |
| [docs/](docs/README.md) | Báo cáo, slide, kịch bản vấn đáp, quy định học phần, bản vẽ, ảnh và kết quả mô phỏng |

Mở `web/` trong VS Code để chạy Wokwi và PlatformIO. Xem [AGENTS.md](AGENTS.md) để biết các quyết định và tình trạng triển khai.
