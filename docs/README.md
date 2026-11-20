# Báo cáo và thuyết trình

- [Báo cáo Word](24127030.docx) và [bản PDF](24127030.pdf).
- [Slide PowerPoint](24127030.pptx) và [kịch bản thuyết trình, câu hỏi vấn đáp](Kich_ban_Thuyet_trinh.md).
- [Quy định và báo cáo tham khảo](references/).
- [Ảnh gốc](images/), [hình chú thích](report_images/) và [ảnh, log kiểm thử Wokwi](images/wokwi_2026-11-12/README.md).
- [Bản vẽ cơ khí](output/pdf/TiltTray_Drawing_Concept.pdf) và [tài liệu chuẩn bị slide Canva](output/slides/).
- [Hồ sơ bàn giao các phiên trước](Ho_so_ban_giao.md).
- [Tài liệu kỹ thuật](../web/docs/) và [hướng dẫn chạy dự án](../web/README.md).

## Trạng thái và quy định cần đối chiếu - 14/11/2026

Lưu Chí Hải, MSSV 24127030, lớp 24C11, nhóm 24, thực hiện cá nhân. Người thực hiện đã xác nhận nộp đề cương và slide. Bản nguồn là [24127030.docx](24127030.docx) và [24127030.pptx](24127030.pptx). Hai bản PDF đã kiểm tra ngày 13/11 là [báo cáo 32 trang](24127030.pdf) và slide 16 trang, mục lục khớp số trang và các bảng/hình đã chỉnh hiển thị đúng.

### Yêu cầu tối thiểu mới được cung cấp

Người thực hiện chép lại các yêu cầu sau từ tài liệu học phần trong cuộc trò chuyện ngày 14/11/2026. Chưa xác định tên tài liệu chứa đoạn này:

1. Dùng board ESP8266 hoặc tương đương có thể kết nối Internet.
2. Có tối thiểu một thiết bị INPUT và một thiết bị OUTPUT.
3. Xem thông tin thiết bị INPUT trên website qua Internet.
4. Điều khiển thiết bị OUTPUT từ website qua Internet.
5. Lưu dữ liệu cảm biến hoặc lịch sử hoạt động của thiết bị lên cloud.
6. Thông báo về điện thoại hoặc email cho người dùng trong tình huống khẩn cấp.
7. Mỗi sinh viên trong nhóm bắt buộc tham gia một phần công việc liên quan đến lập trình.
8. Chỉ dùng Node-RED hoặc code thủ công để xây dựng app quản lý.

### Đối chiếu với phiên bản hiện tại

| Yêu cầu | Đã có | Phần còn thiếu hoặc cần xác nhận |
| --- | --- | --- |
| Board có thể kết nối Internet | ESP32 có Wi-Fi, đang dùng trong Wokwi | Chưa lắp và thử ESP32 vật lý |
| Có INPUT và OUTPUT | MPU6050, LED và buzzer trong mạch mô phỏng | Kiểm tra lại linh kiện khi lắp thật |
| Xem INPUT trên web qua Internet | Web hiển thị góc/trạng thái từ firmware qua MQTT và backend | Demo cục bộ, chưa chứng minh truy cập từ mạng Internet bên ngoài |
| Điều khiển OUTPUT qua Internet | Web đổi chế độ, điều khiển GPIO26/LED và chờ phản hồi | Chưa chứng minh thao tác từ mạng Internet bên ngoài |
| Lưu dữ liệu hoặc lịch sử lên cloud | Backend giữ một bản tin mới nhất trong RAM tại laptop | Chưa có lưu cloud hoặc lịch sử trên cloud |
| Thông báo điện thoại/email | Còi tại thiết bị và trạng thái trên web | Chưa có gửi thông báo điện thoại hoặc email |
| Tham gia lập trình | Người thực hiện phụ trách firmware, backend và frontend | Cách áp dụng điểm nhóm cho cá nhân cần theo xác nhận của giảng viên |
| Node-RED hoặc code thủ công | Firmware C++, backend Express và frontend React tự viết | Không dùng Node-RED |

**Chưa thể kết luận phiên bản hiện tại đáp ứng đủ mọi yêu cầu của đoạn mới.** RAM của backend không phải lưu trữ cloud. Còi hoặc trạng thái trên web không thay cho thông báo điện thoại/email. Địa chỉ `127.0.0.1` phục vụ demo cục bộ, Wi-Fi Wokwi không tự chứng minh web đã truy cập và điều khiển được qua Internet bên ngoài.

[PDF quy định chi tiết](<references/TCTA_QUY ĐỊNH ĐỒ ÁN CUỐI KỲ.pdf>) xếp cloud và thông báo vào các mục nâng cao, còn đoạn mới dùng cụm “phải đáp ứng ít nhất”. Cần xác nhận với giảng viên cách áp dụng hai tài liệu, mốc phải hoàn thành các mục này và cách nghiệm thu yêu cầu Internet. Trong khi chờ làm rõ, theo dõi cloud, thông báo và kiểm chứng Internet là các yêu cầu còn cần xử lý, không mặc định tùy chọn hoặc tự cam kết điểm số.

### Những việc đã hoàn thành

- Firmware đo góc tổng XYZ so với vector CAL, lọc EMA, hysteresis 15°/12°, còi nghiêng/bíp lỗi, LED báo chế độ, task mạng MQTT và điều khiển có phản hồi.
- Backend kiểm tra telemetry, bỏ bản tin cũ trong cùng phiên, tính độ mới, cung cấp API và đối chiếu lệnh. React lấy trạng thái khoảng mỗi giây, hiển thị và gửi yêu cầu bắt đầu/tạm dừng.
- Lượt Wokwi ngày 12/11 đã ghi nhận CAL ngang qua I²C, chuỗi góc 0°/10°/16°/14°/11° và mẫu ±X/±Y/chéo qua ACCEL. Người thực hiện xác nhận nghe còi theo trạng thái. Chưa đo sai số cảm biến thật hoặc tần số/âm lượng bằng dụng cụ.
- Đã thử pause khi cảnh báo, đổi mẫu trong lúc pause, resume với mẫu mới, heartbeat khi pause ít nhất 10 giây theo quan sát người thực hiện, dừng/chạy lại Wokwi, FAULT và ngắt/phục hồi broker. Mất broker khi đang cảnh báo không làm dừng còi tại firmware Wokwi.
- Người thực hiện đã chạy `test:integration` và gửi kết quả PASS với Mosquitto/API thật và peer ESP32 giả lập. Bài này kiểm tra ACK, heartbeat, resume, lỗi, timeout, broker và không phát lại lệnh cũ. Đây không phải kiểm thử firmware hoặc phần cứng thật.
- Đã hoàn thiện CAD dự kiến, Drawing tham khảo, báo cáo, slide và kiểm tra các PDF trước khi người thực hiện xác nhận nộp. Giữ dòng nguồn ảnh PowerPoint ở slide 2 theo lựa chọn của người thực hiện.
- Đã tạo [Tech Stack](../web/docs/Tech_Stack.md), [luồng và chức năng có dẫn dòng code](../web/docs/Luong_va_Chuc_nang.md), [kịch bản thuyết trình và 25 câu hỏi vấn đáp](Kich_ban_Thuyet_trinh.md). Đã kiểm tra 274 liên kết dẫn dòng code khi tạo. Phần hướng dẫn điểm/kế hoạch trong ba file cần đối chiếu với yêu cầu mới ở trên.

Ảnh/log của lượt thử nằm trong [images/wokwi_2026-11-12](images/wokwi_2026-11-12/README.md). Chưa xác nhận lưu/khôi phục CAL qua reboot trong lượt Wokwi có log `ref-v1 NOT_FOUND`. Chưa lắp phần cứng thật, chưa đo độ trễ đầu cuối, chưa dùng gyro để xử lý khi xe chuyển động và chưa có cơ cấu tự điều chỉnh.

### Việc tiếp theo

Người thực hiện đã chọn kế hoạch bổ sung lưu dữ liệu cảm biến hoặc lịch sử lên cloud và gửi thông báo điện thoại hoặc email trong giai đoạn hoàn thiện cuối kỳ. Hiện hai phần này chưa triển khai hoặc kiểm thử, chưa chọn nhà cung cấp cloud và kênh thông báo cụ thể. Mốc bổ sung này chưa có xác nhận chấp thuận của giảng viên. Cần làm rõ cách nghiệm thu phần Internet và các yêu cầu tối thiểu, sau đó chọn phương án triển khai và kiểm thử. Phần cứng thật vẫn theo kế hoạch sau buổi thuyết trình.

## Tư liệu CAD, Drawing và hình dùng cho báo cáo

- `images/` giữ **15 ảnh/sơ đồ gốc**; `report_images/` có **15 PNG cùng tên đã thêm chú thích bằng script**. Ảnh CAD gốc được giữ nguyên khi thêm nhãn. Xem [danh mục và nguồn hình](report_images/README.md) hoặc [gallery](report_images/index.html).
- [Drawing PDF A3](output/pdf/TiltTray_Drawing_Concept.pdf) có 4 hình chiếu và 10 kích thước liên kết cạnh CAD. Đây là thiết kế sơ bộ; kích thước cần chỉnh theo hộp, khay và linh kiện mua thật. Nguồn rút gọn lưu tại `TiltTray_Drawing_Source.f3d` và trên Fusion ở `Default Project → TiltTray_Report`.
- Drawing cuối trong Fusion mang tên `TiltTray_Drawing_Report_Final`. Trạng thái lưu cloud cuối cùng cần kiểm tra nếu tiếp tục chỉnh CAD, không mặc định hộp thoại Save As của lượt trước còn mở. Các bản `TiltTray_Drawing_Concept` và `TiltTray_Drawing_Layout_Draft` là bản thử. Bản Layout_Draft đã chuyển sang Read-Only để còn chỗ editable trong Fusion Personal.
- Hình web 13-14 trong bộ `report_images/` lấy từ lượt Wokwi ngày 10/11/2026. Sơ đồ 07-12 và 15 mô tả nguyên lý, không phải số đo thực nghiệm. Bộ ảnh bổ sung ngày 12/11 nằm trong `images/wokwi_2026-11-12/`. Báo cáo đã nộp có các hình mô phỏng tiêu biểu và Bảng 15 tổng hợp ca thử. Ảnh sản phẩm thật vẫn chưa có.

Từ terminal PowerShell ở thư mục `docs/`, mở bộ hình hoặc bản vẽ bằng:

```powershell
Start-Process .\report_images\index.html
Start-Process .\output\pdf\TiltTray_Drawing_Concept.pdf
```
