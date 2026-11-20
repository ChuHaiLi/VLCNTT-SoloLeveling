# Repository Guidelines

## Trạng thái ưu tiên khi bắt đầu phiên - 14/11/2026

Đọc mục này trước phần bàn giao cũ bên dưới. Các ghi nhận ngày 10-12/11 là lịch sử, không thay thế trạng thái hiện tại. Người dùng yêu cầu cập nhật `AGENTS.md` và `README.md` trước khi tự gửi `/init`. Không tự chạy `/init` hoặc dựng lại tài liệu từ bản cũ.

### Báo cáo, slide và tài liệu học

- Lưu Chí Hải, MSSV 24127030, lớp 24C11, nhóm 24, thực hiện cá nhân. Người dùng đã xác nhận nộp đề cương và slide.
- Bản nguồn hiện tại: `docs/24127030.docx`, `docs/24127030.pptx`. Bản PDF báo cáo: `docs/24127030.pdf`. Bản PDF slide từng dùng để đối chiếu hiện không có trong repo. Không lấy tên DOCX cập nhật cũ làm bản gốc nếu chưa kiểm tra file thực tế.
- Đã đọc và kiểm tra trực quan PDF xuất ngày 13/11: báo cáo 32 trang và slide 16 trang. Mục lục khớp số trang, các bảng/hình đã sửa không tràn chữ. Người dùng quyết định giữ dòng nguồn ảnh tự động của PowerPoint ở slide 2.
- Đã xử lý placeholder, nguồn tài liệu bàn giao nội bộ và câu giống lời trợ lý theo các lượt duyệt. Giữ bảng đối chiếu mã nguồn. Không tự sửa lại những đoạn người dùng đã chọn giữ chỉ để đổi văn phong.
- Tài liệu kỹ thuật ở `web/docs/Tech_Stack.md` và `web/docs/Luong_va_Chuc_nang.md`. Kịch bản và câu hỏi vấn đáp ở `docs/Kich_ban_Thuyet_trinh.md`. Đã kiểm tra 274 liên kết dẫn dòng code khi tạo. Phải kiểm tra lại số dòng nếu code thay đổi.
- Kịch bản có phần nói theo slide, ba slide dự phòng và 25 câu hỏi vấn đáp. Phương án luyện tập khoảng 11 phút nói trong buổi vấn đáp khoảng 20 phút là đề xuất, không phải quy định thầy. Slide 13-15 để giải thích thêm, slide 16 kết thúc.
- Đã giải thích trong CLI về MQTT, Mosquitto, I²C, telemetry, CAL, FAULT, vector mốc và gyro. Đã soạn thêm câu hỏi về chức năng, toàn bộ luồng dữ liệu, linh kiện, phân công và cách đối chiếu điểm. Không tạo thêm file cho các phần hỏi đáp CLI này.

### Kết quả thử đã ghi nhận, không phải vừa chạy lại

- CAL qua I²C tại `(0,0,1)` thành công. Chuỗi 0°, 10°, 16°, 14°, 11° và các mẫu ±X, ±Y, chéo thử bằng ACCEL qua Serial sau CAL. ACCEL bỏ qua đọc I²C, không thay thanh XYZ của part MPU6050.
- Người dùng xác nhận nghe còi ở 16°/14°, tắt ở 11°, có còi ở các lượt mẫu hướng khác. Đây là quan sát nghe, chưa đo tần số, âm lượng hoặc độ trễ bằng dụng cụ.
- Pause khi cảnh báo làm góc ẩn và còi tắt. Đổi mẫu sang 10° khi pause không hiện góc, resume hiện mẫu mới 10°. Người dùng xác nhận pause ít nhất 10 giây vẫn nhận bản tin, có ảnh hỗ trợ heartbeat.
- Dừng Wokwi làm web mất dữ liệu, ẩn góc, khóa nút theo xác nhận người dùng. Chạy lại phục hồi. Ảnh stale có tuổi dữ liệu 89,1 giây, chưa đo chính xác thời điểm chuyển trạng thái 5 giây.
- FAULT ON tạo lỗi và bíp lỗi. Pause tắt bíp, resume khi còn FAULT làm bíp trở lại, FAULT OFF phục hồi và tắt bíp. Đây là bơm lỗi phần mềm, chưa thử hỏng module hoặc đứt dây thật.
- Dừng dịch vụ Mosquitto khi mẫu 16°: web mất dữ liệu, firmware và còi còn hoạt động. Bật broker lại: MQTT/web phục hồi. Chưa thử riêng mọi tình huống phát lại lệnh cũ trên Wokwi.
- Người dùng đã chạy `test:integration` và gửi kết quả PASS. Bài này dùng Mosquitto/API thật với peer ESP32 giả lập, kiểm tra ACK, heartbeat, resume, lỗi, timeout, ngắt/phục hồi broker và không phát lại lệnh cũ. Không thay kiểm thử firmware hoặc thiết bị thật.
- KT09 mới ghi nhận mặc định bật giám sát sau reboot. Log có `ref-v1 NOT_FOUND`, chưa xác nhận lưu/khôi phục CAL qua reboot. KT10 và phần cứng vật lý chưa thử. Ảnh/log lưu ở `docs/images/wokwi_2026-11-12/`.

### Quy định tối thiểu mới do người dùng cung cấp

Nguồn là đoạn người dùng chép trực tiếp trong cuộc trò chuyện ngày 14/11/2026, chưa xác định tên tài liệu chứa đoạn này. Không tự gán đoạn này cho PDF quy định chi tiết. Nội dung:

1. Dùng board ESP8266 hoặc tương đương có thể kết nối Internet.
2. Có tối thiểu một thiết bị INPUT và một thiết bị OUTPUT.
3. Xem thông tin thiết bị INPUT trên website qua Internet.
4. Điều khiển thiết bị OUTPUT từ website qua Internet.
5. Lưu dữ liệu cảm biến hoặc lịch sử hoạt động của thiết bị lên cloud.
6. Thông báo về điện thoại hoặc email cho người dùng trong tình huống khẩn cấp.
7. Mỗi sinh viên trong nhóm bắt buộc tham gia một phần công việc liên quan đến lập trình.
8. Chỉ dùng Node-RED hoặc code thủ công để xây dựng app quản lý.

**Đối chiếu hiện tại:** ESP32 phù hợp loại board tương đương, mô phỏng có MPU6050 và LED/buzzer. Web xem số đo và điều khiển chế độ/LED đã được triển khai bằng Express + React. Backend chỉ giữ snapshot mới nhất trong RAM tại laptop. Chưa có lưu cloud, lịch sử trên cloud hoặc thông báo điện thoại/email. Demo web/API/broker hiện cục bộ, chưa chứng minh truy cập và điều khiển từ Internet bên ngoài. Wi-Fi Wokwi hoặc MQTT cục bộ không đủ để kết luận yêu cầu Internet đã đạt.

**Khác biệt cần xác nhận với thầy:** `TCTA_QUY ĐỊNH ĐỒ ÁN CUỐI KỲ.pdf` đã đọc trực tiếp xếp cloud và thông báo vào yêu cầu nâng cao. Đoạn mới ghi “phải đáp ứng ít nhất”, có thể yêu cầu các mục này bắt buộc. Không tự quyết định tài liệu nào thay thế tài liệu nào. Trong khi chờ làm rõ, coi cloud, thông báo và kiểm chứng Internet là yêu cầu còn cần xử lý, không mặc định tùy chọn hoặc khẳng định đồ án đã đủ toàn bộ yêu cầu.

Cần làm rõ cloud/thông báo có bắt buộc cho đồ án này không, hoàn thành ở mốc đề cương hay nghiệm thu, demo cục bộ Wokwi có được chấp nhận cho phần Internet không, cách áp dụng điểm nhóm/tích hợp và phân loại luồng bổ sung khi làm cá nhân. Không hỏi lại nhóm 24 đã chốt. Không cam kết điểm hoặc tự cộng điểm nhiều lần cho chức năng dùng lại thiết bị.

### Phạm vi tiếp tục

- Người dùng đã chốt sẽ trình bày cloud và thông báo điện thoại hoặc email là phần bổ sung trong giai đoạn hoàn thiện cuối kỳ. Ghi đây là kế hoạch đã chọn, hiện chưa triển khai hoặc kiểm thử. Chưa chọn nhà cung cấp cloud và chưa chốt kênh thông báo cụ thể. Việc thầy chấp nhận mốc bổ sung này chưa được xác nhận, không diễn đạt như đã được thầy duyệt. Yêu cầu truy cập/điều khiển qua Internet vẫn cần làm rõ riêng.
- Nhiệm vụ hiện tại ở lượt cập nhật quy định ngày 14/11 chỉ cập nhật hai tài liệu bàn giao. Chưa được giao triển khai cloud, thông báo, triển khai Internet hoặc đổi phần cứng. Khi được yêu cầu tiếp tục, đối chiếu quy định và thảo luận phương án trước các lựa chọn thay đổi kiến trúc hoặc chi phí.
- Phần cứng thật vẫn theo kế hoạch sau buổi thuyết trình. Chưa dùng gyro trong firmware, chưa có motor/tự cân bằng hoặc kiểm chứng góc trên xe đang chạy.
- Độ lớn vector là `sqrt(ax² + ay² + az²)`, hợp lệ từ 0,65 đến 1,35 g, không phải tổng `ax + ay + az`. Khoảng này không tách gia tốc xe. Góc so với vector CAL chuẩn hóa, mặc định +Z khi chưa có mốc hợp lệ.
- Cải tiến khi chuyển động mới là định hướng: kết hợp accelerometer/gyro, xử lý sai lệch, rung, thời gian lấy mẫu và đo đối chiếu. Chỉ thêm gyro/Kalman không bảo đảm đúng trong mọi gia tốc kéo dài. Chạy nhanh đều khác tăng tốc, phanh, rẽ hoặc rung.
- Ba file Markdown học tập được viết trước đoạn quy định tối thiểu mới. Khi dùng phần điểm/kế hoạch của chúng, đối chiếu mục này. Không tự sửa DOCX/PPTX đã nộp hoặc triển khai chức năng mới nếu chưa được giao.

## Quy ước viết báo cáo

- Hạn chế tối đa dấu chấm phẩy `;` và dấu gạch dài `—`, `–` trong lời văn vì người dùng thấy cách dùng này tạo cảm giác văn AI. Ưu tiên câu ngắn với dấu chấm, dấu phẩy hoặc dấu gạch nối `-` khi phù hợp. Giữ nguyên ký hiệu kỹ thuật, công thức và cú pháp mã nguồn cần thiết.
- Người dùng đã tự sửa dấu câu trong `24127030_cap_nhat_minh_chung.docx`. Khi chỉnh tiếp phải đọc bản đã lưu mới nhất, không dựng lại từ bản sao hoặc script cũ làm mất sửa đổi của người dùng.

## Bàn giao lịch sử - ghi nhận ngày 11-12/11/2026

Đây là hướng dẫn đóng góp và bản bàn giao ngữ cảnh để chuyển máy. Người dùng làm đồ án Vật lý cho CNTT lớp 24C11 một mình, dùng Windows 11, PowerShell, VS Code, Wokwi và Autodesk Fusion. Trao đổi bằng tiếng Việt, giải thích dễ hiểu, ưu tiên hoàn thành phần đã được giao; không tự suy diễn thông số hay kết quả thực nghiệm.

**Kế hoạch lịch sử ngày 12/11/2026:** review `24127030_cap_nhat.docx`, thu ảnh/log Wokwi, hoàn thiện báo cáo, làm slide Canva và xuất PPTX. Các bước báo cáo/slide đã hoàn thành, người dùng đã xác nhận nộp. **Chuẩn bị phần cứng thật vẫn diễn ra sau buổi thuyết trình.** Không tự sửa source hoặc CAD khi chưa có yêu cầu liên quan.

- Người dùng xác nhận giảng viên đã chốt **nhóm 24** và đã sửa trong DOCX. Đã kiểm tra nhóm 24 trong bản báo cáo/slide nộp. Không hỏi lại mã nhóm.

- Trước khi bàn giao, DOCX cập nhật bị ứng dụng khác giữ nên chưa đọc được. Ngày 12/11 đã đọc được nội dung DOCX qua OOXML, gồm Bảng 15 “Đối chiếu ca thử và nguồn minh chứng”. Bảng đang gộp KT01–KT03, KT05–KT06, KT07–KT08 và KT09–KT10; một số dòng còn chờ log hoặc chỉ dẫn ghi nhận từ hồ sơ. Đây là kiểm tra nội dung, chưa phải kiểm tra trực quan bố cục và chưa chạy lại kiểm thử.
- Báo cáo gốc trước đó được viết dựa trên `Context.md` và `ToDo.md`. Đã tạo `Huong_dan_viet_report.md` hướng dẫn hoàn thiện report theo mã và bộ hình. Không viết lại từ đầu khi chưa đọc bản mới nhất.
- Tại lúc bàn giao, thư mục chưa có Git repository; chưa thực hiện `git init`, commit hoặc push. Người dùng sẽ tự push. Không tự công bố dự án hoặc dữ liệu lên dịch vụ ngoài.
- Các kết quả kiểm thử nêu bên dưới là ghi nhận từ phiên trước, **không phải vừa chạy lại khi cập nhật AGENTS.md**.

## Tài liệu và thứ tự đối chiếu

1. Yêu cầu mới nhất của người dùng và mã/cấu hình thực tế quyết định hành vi hiện tại. Kiểm tra lại mã trước khi sửa hoặc viết khẳng định kỹ thuật.
2. `README.md` dẫn đến `web/README.md` (chạy và kiểm thử) và `docs/README.md` (báo cáo, slide và quy định).
3. `docs/Ho_so_ban_giao.md`: ngữ cảnh, kế hoạch và hướng dẫn soạn báo cáo các phiên trước. Đối chiếu với tình trạng hiện tại trước khi dùng.
4. `docs/report_images/README.md`, `index.html`, `manifest.json`: danh mục, chú thích, nguồn và dấu vết kiểm tra hình.
5. `docs/references/TCTA_QUY ĐỊNH ĐỒ ÁN CUỐI KỲ.pdf`: nguồn yêu cầu chính thức của giảng viên; phải đọc trực tiếp khi cần xác định tiêu chí. Không biến đề xuất của trợ lý thành yêu cầu chính thức hoặc cam kết điểm số.
6. `docs/references/VLCNTT (nhóm khác).pdf`: chỉ tham khảo **đề mục/cấu trúc còn thiếu**, không sao chép nội dung, linh kiện, chức năng. Nhóm này không được chấm trọn điểm; không xem là mẫu đầy đủ.

## Project Structure & Module Organization

Các đường dẫn mã nguồn và cấu hình bên dưới tính từ `web/`.

- `firmware/tilt_tray.cpp`: firmware ESP32 dùng chung cho Wokwi và thiết bị thật; không duy trì thêm sketch `.ino` trùng nguồn.
- `firmware/config.h`: cấu hình build; `static_tilt.h`, `buzzer_alert.h`, `monitoring_control.h`: logic độc lập, có bài kiểm thử C++ trong `tests/`.
- `firmware/secrets.example.h`: mẫu cho phần cứng thật. `firmware/secrets.h` là bí mật cục bộ đã ignore.
- `platformio.ini`, `diagram.json`, `wokwi.toml`: project PlatformIO/Wokwi trong `web/`. Mở `web/` trong VS Code.
- `backend/`: Express, MQTT, xác thực trạng thái, điều khiển, bài kiểm thử Node và công cụ `simulate.mjs`.
- `frontend/src/main.jsx`, `frontend/src/style.css`: React/Vite; proxy `/api` đến backend.
- `demo-gia-lap.html`: công cụ demo phụ; giữ lại cùng `backend/simulate.mjs`.
- `docs/images/`: ảnh gốc. `docs/report_images/`: ảnh đã thêm chú thích. `docs/output/pdf/`: Drawing xuất PDF.
- `docs/` chứa bản nộp, kịch bản, tài liệu tham khảo, bản vẽ và hình. `web/docs/` chứa tài liệu kỹ thuật.
- `.pio/`, `.tools/`, `node_modules/`, `dist/` là dữ liệu build/phụ thuộc/công cụ cục bộ. `.tools/` bị ignore; không coi log/script chỉ nằm ở đó là tài liệu chắc chắn tồn tại trên máy mới.

## Phạm vi và những quyết định đã chốt

- Sản phẩm hiện tại **đo/cảnh báo độ nghiêng tĩnh của khay**, có hiển thị web và bật/tắt đo từ web kèm LED báo chế độ.
- Toàn bộ hộp gắn trên khay chở hàng và nghiêng cùng khay; MPU6050 phải cố định theo hộp/khay.
- Người dùng dự định **mua hộp có sẵn**, không có máy in 3D; chưa chọn hộp và linh kiện thật. CAD hiện là thiết kế dự kiến, mọi kích thước có thể thay đổi sau khi mua.
- Đã chuyển từ công thức một trục `atan2(ax, az)` ban đầu sang đo tổng góc nghiêng **XYZ** so với vector mốc CAL. Không viết report như thể vẫn bỏ trục Y.
- Hai luồng chính: MPU6050 → ESP32 → MQTT → Express → React; và React → Express → MQTT → ESP32 → LED/chế độ đo → telemetry xác nhận → React.
- Web có điều khiển bắt đầu/tạm dừng đo; không còn là bản chỉ hiển thị ban đầu. Web không chỉnh ngưỡng trong phạm vi hiện tại.
- Chưa có motor/servo, điều khiển tự cân bằng, tách gia tốc chuyển động hoặc đo tư thế xe chạy thực tế. Đây là hướng phát triển, không được trình bày là tính năng đã có.

## Firmware, cảm biến và âm thanh

### Chân và cấu hình

- ESP32 Arduino, board cấu hình hiện tại `esp32dev`; MPU6050 I²C địa chỉ `0x68`, SDA GPIO21, SCL GPIO22; cấp 3V3, GND chung; AD0 nối GND khi dùng địa chỉ này.
- Buzzer GPIO25. LED xanh báo chế độ GPIO26 → điện trở 330 Ω → anode LED; cathode → GND. LED không biểu thị cảnh báo nghiêng hoặc chỉ thị kết nối mạng.
- Trong diagram Wokwi DevKit hiện tại, giữ đúng nhãn chân kiểu `D21`, `D22`, `D25`, `D26` theo part; không tùy tiện đổi thành số trần.
- PlatformIO pin `espressif32@6.12.0`, PubSubClient `2.8`, Arduino, Serial 115200.
- Build `wokwi`: `TILT_WOKWI=1`, `BUZZER_PASSIVE=1`; Wi-Fi `Wokwi-GUEST`, mật khẩu rỗng, MQTT `host.wokwi.internal:1883`, device `khay-01-WOKWI`; không cần Wi-Fi thật hay `secrets.h`.
- Build `hardware`: `TILT_WOKWI=0`, đọc bí mật cục bộ; mặc định buzzer active, tùy phần mua thật chọn `BUZZER_PASSIVE`/`BUZZER_ACTIVE_LOW`, đúng board và khả năng mạch điều khiển trước khi nạp. Active buzzer không đảm bảo phát được hai cao độ như passive.

### Thuật toán hiện tại

- Đọc gia tốc XYZ qua I²C, byte cao/thấp đọc tuần tự rõ ràng; thang ±2g, 16384 LSB/g; chu kỳ lấy mẫu khoảng 100 ms.
- Chỉ nhận vector hữu hạn có độ lớn 0,65–1,35 g. Đây là kiểm tra hợp lý cho đo tĩnh, **không chứng minh xe đang đứng yên**, không tách được gia tốc do phanh/tăng tốc/rẽ.
- `CAL` lấy khoảng 30 mẫu trong 3 giây, cần tối thiểu 25 mẫu hợp lệ, chuẩn hóa vector mốc và lưu Preferences (`ref-v1`). Hiệu chuẩn khi khay nằm ngang, đứng yên, monitoring bật, nguồn I²C và không bơm lỗi. Mốc scalar cũ không thay thế vector CAL hiện tại.
- Với vector mốc đơn vị `r` và gia tốc `a`: `theta = atan2(|r × a|, r · a) * 180/pi`. Mặc định mốc +Z tương đương `atan2(sqrt(ax² + ay²), az)`.
- Góc tổng 0–180°, không có dấu và không cho riêng pitch/roll hoặc hướng xe di chuyển.
- Lọc EMA: 0,75 góc cũ + 0,25 góc mới; khởi tạo lại sau lần đầu/phục hồi/bắt đầu lại theo logic hiện có.
- Bật cảnh báo khi góc đã lọc ≥15°; tắt khi ≤12°; giữ trạng thái ở khoảng giữa. Trên web phân biệt **Ngưỡng bật** và **Ngưỡng tắt**.
- Passive buzzer Dual-Tone: 1200 Hz/150 ms → 1800 Hz/150 ms → nghỉ 100 ms, lặp 400 ms bằng `millis()`/PWM. Khi trạng thái cảnh báo tắt, dừng ở lượt cập nhật kế tiếp, không chờ hết chu kỳ; vẫn có độ trễ do lấy mẫu/lọc trước khi trạng thái đổi.
- Lỗi cảm biến: `sensorOk:false`, `angleDeg:null`, `alarmOn:false`; có tiếng bíp lỗi riêng 2000 Hz/170 ms mỗi giây khi đang đo. `alarmOn` chỉ là cảnh báo nghiêng, không đại diện mọi tiếng buzzer.
- Tạm dừng đo: bỏ lấy mẫu, LED và mọi âm thanh tắt, góc null; telemetry heartbeat vẫn gửi. `sensorOk` lúc tạm dừng không phải kết quả một phép đọc cảm biến mới. Bắt đầu lại lấy mẫu mới và reset lọc; trạng thái tạm dừng không lưu qua reboot.
- Task mạng FreeRTOS xử lý Wi-Fi/MQTT riêng, truyền snapshot mới nhất qua queue; mất broker không được chặn đọc/còi tại loop. Không khẳng định độ trễ bằng 0. Firmware vẫn có `delay(1)` nhường CPU; yêu cầu không chặn áp dụng cho bộ điều khiển âm thanh, không phải tuyên bố toàn bộ file không có delay.

### Serial / Wokwi

Serial 115200 nằm trong terminal Wokwi của VS Code khi simulator chạy; đây là UART mô phỏng, khác PlatformIO Monitor dành cho cổng COM thật.

- `I2C`: trở về đọc MPU6050 mô phỏng.
- `CAL`: hiệu chuẩn như trên; giữ yên đến `CAL done`.
- `ACCEL x y z`: chỉ Wokwi, bơm gia tốc đơn vị g vào cùng logic xử lý, **bỏ qua I²C**; giá trị giữ đến lệnh đổi nguồn/giá trị hoặc reboot, không tự hết hạn sau 5 giây.
- `FAULT ON` / `FAULT OFF`: chỉ Wokwi, bơm/bỏ lỗi; bỏ lỗi không tự đổi nguồn về I²C.
- Muốn thử cảm biến qua I²C: gửi `I2C`, `FAULT OFF`, chỉnh Acceleration XYZ trên MPU6050 Wokwi. Với nghiêng quanh Y: `x=sin(theta)`, `y=0`, `z=cos(theta)` theo g.
- Rotation của part là dữ liệu gyro (độ/giây), firmware hiện không dùng để tính góc.
- Log `SAMPLE` cho biết nguồn, monitoring, LED, sensorOk, raw/angle, alarmOn, buzzer, maxGapMs/maxWorkUs; lỗi `Wire requestFrom` cần kiểm tra nguồn/chân/địa chỉ/diagram, không che bằng dữ liệu Serial rồi tuyên bố I²C đã đạt.

## MQTT / API / React contracts

- Broker demo Mosquitto chạy trên máy Windows. Backend dùng `mqtt://127.0.0.1:1883`; Wokwi dùng gateway VS Code tới `host.wokwi.internal:1883`. ESP32 thật cần IP LAN của máy broker, Wi-Fi/LAN và listener/firewall phù hợp.
- Telemetry topic: `tilt-tray/telemetry`, khoảng 500 ms/lần; một nguồn telemetry trong mỗi lượt demo. Dừng simulator Node trước khi nghiệm thu Wokwi vì backend lưu một bản tin mới nhất trong RAM, không có database/history.
- Giữ các trường: `deviceId`, `bootId`, `seq`, `sensorOk`, `alarmOn`, `angleDeg`, `thresholdOn`, `thresholdOff`, `monitoringEnabled`, `modeLedOn`, `lastCommandId`. Backend còn chấp nhận bản tin cũ thiếu cả nhóm control; kiểm tra validator khi thay đổi.
- Topic lệnh: `tilt-tray/command/<deviceId>`. Payload: `SET_MONITORING <bootId> <requestId> <0|1>`.
- MQTT QoS 0, không retain lệnh; không xem request/boot IDs là cơ chế xác thực bảo mật. Giữ các kiểm tra chống lệnh sai phiên/trùng và hành vi không phát lại lệnh cũ sau reconnect.
- ESP32 áp dụng chế độ/GPIO rồi trả metadata xác nhận trong telemetry. Backend đối chiếu thiết bị, phiên, request ID, monitoring và LED; timeout khoảng 4 giây. Không có topic ACK riêng; HTTP thành công không chỉ dựa vào việc đã publish.
- Express mặc định `http://127.0.0.1:3000`: `GET /api/status`, `GET /api/health`, `POST /api/monitoring` với JSON `{ "enabled": true }` hoặc false.
- React mặc định `http://127.0.0.1:5173`, lấy trạng thái mỗi giây; timeout lệnh phía web khoảng 6,5 giây.
- Sau **hơn 5000 ms không có telemetry hợp lệ**, API không đưa reading cũ ra như dữ liệu mới; web báo mất dữ liệu và ẩn góc. 5 giây không phải thời hạn của lệnh ACCEL; heartbeat hợp lệ tiếp tục thì góc không mất vì lý do này.

## Build, Test, and Development Commands

Chạy trong PowerShell tại `web/`, nơi có `firmware/`, `backend/`, `frontend/`. Trên máy mới cài Git, Node.js phù hợp package, VS Code với PlatformIO IDE và Wokwi, Mosquitto; đăng nhập/kích hoạt Wokwi nếu extension yêu cầu. Fusion cần tài khoản đang giữ thiết kế cloud. Đừng tái sử dụng đường dẫn tuyệt đối/cổng COM/venv của máy cũ.

Backend và frontend có lockfile riêng. Chạy `npm ci` thông qua `--prefix backend` hoặc `--prefix frontend` từ `web/`.

```powershell
npm.cmd --prefix backend ci
npm.cmd --prefix frontend ci
npm.cmd --prefix backend test
npm.cmd --prefix frontend run build
pio run -e wokwi
```

Nếu `pio` chưa trên PATH, mở terminal PlatformIO trong VS Code rồi chạy lệnh build. `wokwi.toml` trỏ `.pio/build/wokwi/firmware.bin` và `.elf`. Build xong: Command Palette → **Wokwi: Start Simulator**.

Chạy mỗi dịch vụ ở một terminal riêng, đều tại `web/`:

```powershell
mosquitto.exe -c mosquitto.conf -v
```

```powershell
npm.cmd --prefix backend start
```

```powershell
npm.cmd --prefix frontend run dev
```

Mosquitto phải trên PATH hoặc dùng đường dẫn executable đã cài. Kiểm tra broker/MQTT subscriber và `http://127.0.0.1:3000/api/status` trước khi kết luận web lỗi. Không bật thêm broker hoặc dừng process người dùng khi chưa xác định process/cổng đang dùng.

```powershell
npm.cmd --prefix backend run test:integration
```

Integration cần Mosquitto, có thể cấu hình `MOSQUITTO_BIN` nếu không tìm thấy executable. Công cụ dùng broker/API riêng (19883/13000) và **giả lập peer ESP32**, không thay thế thử mạch Wokwi. Công cụ phụ `npm.cmd --prefix backend run simulate` chỉ kiểm tra dữ liệu mẫu → backend/web.

Phần cứng thật: sao chép `firmware/secrets.example.h` thành `firmware/secrets.h` cục bộ, nhập Wi-Fi/MQTT riêng; chọn board, chân, buzzer và cổng COM đúng; `pio run -e hardware`, sau đó `pio run -e hardware -t upload`. Hiệu chuẩn trên mặt phẳng sau khi lắp cố định.

## Coding Style & Naming Conventions

- Ưu tiên thay đổi nhỏ và giữ chức năng đang có. Dùng 4 spaces, **Allman brace style** cho các block JavaScript/C++ chỉnh sửa; giữ quy ước JSX/CSS/JSON hiện hữu.
- Tên biến/hàm camelCase có nghĩa, constant theo quy ước firmware hiện có. Không format hàng loạt file không liên quan.
- Chưa có formatter/linter script hoặc ngưỡng coverage bắt buộc được cấu hình.
- Đọc file bằng UTF-8, ví dụ `Get-Content -Encoding UTF8`; Windows PowerShell có thể hiển thị tiếng Việt sai nếu dùng encoding mặc định. Không tự ghi đè tài liệu vì lỗi hiển thị terminal.

## Testing Guidelines & mức độ minh chứng

Backend dùng `node:test`, `node:assert/strict`, tên `*.test.mjs`. C++ dùng assertions trong `tests/static_tilt.test.cpp`, `tests/buzzer_alert.test.cpp`, `tests/monitoring_control.test.cpp`. Cần g++ trên PATH để chạy, ví dụ:

```powershell
New-Item -ItemType Directory -Force .tools
g++.exe -std=c++11 -Wall -Wextra -Werror tests/static_tilt.test.cpp -o .tools/static-tilt-test.exe
.\.tools\static-tilt-test.exe
```

Áp dụng tương tự cho hai test C++ còn lại. Chạy kiểm thử phù hợp hành vi sửa, tập trung XYZ/CAL, hysteresis, Dual-Tone, lỗi, pause/resume và ACK. Thay đổi chỉ tài liệu không đòi tự chạy lại toàn bộ ứng dụng.

Ghi nhận từ phiên trước (không coi là chạy mới):

- Backend 16 tests, ba nhóm test C++, frontend build và firmware Wokwi đã đạt; hardware được kiểm tra build với cấu hình mẫu active/passive, chưa phải nạp thiết bị thật.
- Integration Mosquitto/API với peer giả lập đã thử điều khiển, heartbeat, lỗi, timeout và phục hồi broker/lệnh cũ.
- Đã thử luồng web React → Express → Mosquitto → firmware Wokwi → LED/chế độ → ACK → web; pause LED tắt/góc null, heartbeat tiếp tục khoảng 20 giây, resume LED bật/góc mới. Ảnh 13–14 là minh chứng mô phỏng của lượt này.
- Có ghi nhận I²C nằm ngang/CAL và log khoảng 100 ms giữa mẫu. Người dùng đã nghe còi khi thử ACCEL trong phiên của họ. Không biến điều đó thành đo âm thanh hoặc nghiệm thu mọi góc XYZ có số liệu.
- Đã bổ sung ảnh/log và quan sát nghe cho chuỗi góc ACCEL, lỗi và mất/phục hồi broker ngày 12/11, xem mục trạng thái đầu file. Chưa có chuỗi góc đầy đủ qua I²C, ảnh sản phẩm thật, nạp thiết bị thật, sai số hoặc độ trễ đầu cuối đo thực nghiệm.
- Một số ảnh kiểm thử UI trong `.tools/` dùng API giả để kiểm tra layout; không dùng chúng để chứng minh cảm biến/mạch thật.

Chuỗi nghiệm thu cần giữ mỗi mốc đủ lâu để lọc/web cập nhật: 0° im → 10° im → 16° kêu → 14° vẫn kêu → 11° tắt. Bắt đầu bằng I²C nằm ngang và CAL. Nếu dùng ACCEL dự phòng, ghi rõ bypass I²C; các giá trị lần lượt là `(0,0,1)`, `(0.17365,0,0.98481)`, `(0.27564,0,0.96126)`, `(0.24192,0,0.97030)`, `(0.19081,0,0.98163)` theo g. Cần thử thêm nghiêng theo Y/chéo để minh chứng XYZ.

Thử dừng broker khi Wokwi chạy: còi tại thiết bị vẫn theo nghiêng; quá 5 giây web mất dữ liệu/ẩn góc; bật lại broker phải tự cập nhật. Thử lỗi phải phân biệt bíp lỗi với `alarmOn`, sau đó kiểm tra pause/resume và LED.

## CAD / Drawing — hiện trạng và giới hạn

Các tên archive Fusion dưới đây là ghi nhận lịch sử. Các file `.f3d` đã bị xóa khỏi cây làm việc trước khi sắp xếp lại thư mục.

- `TiltTray_Report_Concept.f3d`: bản concept đầy đủ phục vụ report (đã bổ sung LED, điện trở, dây đại diện, đệm cách điện/cố định, đường cấp nguồn và khay tham chiếu); bản archive cục bộ đã từng kiểm tra đọc lại.
- `TiltTray_before_report_completion.f3d`: backup trước khi hoàn thiện; `TiltTray_Warning_System (~recovered).f3d`: bản gốc cũ. Không ghi đè nhầm bản concept bằng bản cũ.
- `TiltTray_Drawing_Source.f3d`: hình học thân/nắp/LED phục vụ Drawing.
- `docs/output/pdf/TiltTray_Drawing_Concept.pdf`: bản Drawing sạch hiện có, A3, bốn hình chiếu, 10 kích thước; ảnh `06_drawing_hop.png` là bản render để chèn report. Bản này là tham khảo concept, chưa là hồ sơ chế tạo có dung sai hoàn chỉnh.
- Người dùng đã cho phép lưu bản sao lên Fusion **Default Project → TiltTray_Report**. Nguồn cloud `TiltTray_Drawing_Source_20261111`, Drawing cuối `TiltTray_Drawing_Report_Final`; có một số bản nháp tên gần giống. Chưa có xác minh độc lập cuối cùng rằng mọi thay đổi cloud của Drawing đã lưu; kiểm tra khi cần tiếp tục CAD. Không xuất lại từ bản nháp lỗi ghi chú để thay PDF sạch.
- Có một bản nháp đã chuyển Read Only để giải phóng giới hạn editable document của Fusion Personal; không tự xóa thiết kế cloud.

Kích thước **dự kiến**, không phải số đo linh kiện đã mua:

| Chi tiết | Kích thước / ý nghĩa |
| --- | --- |
| Thân hộp | 240 × 155 × 30 mm, shell vào trong 3 mm |
| Nắp | 250 × 165 × 3 mm |
| Lỗ trên buzzer | Ø8 mm, lỗ thoát âm |
| LED | đầu xanh Ø5 mm, lỗ Ø5,2 mm, nhô khoảng 2 mm; chân/bệ là mô hình đại diện |
| Lỗ chữ nhật bên hông | 16 × 10 mm cho dây đi ra ngoài; chưa phải cổng USB đã chọn |
| Khay tham chiếu | 400 × 300 mm, đáy 3 mm, thành cao 20 mm tính từ mặt trong; **đề xuất của trợ lý, chưa được người dùng xác nhận** |

Các board, giắc, dây, vật liệu/màu trong CAD chủ yếu minh họa; không suy ra part number, PCB chi tiết hoặc vật liệu hộp thật từ appearance. Đã kiểm tra giao thoa một nhóm cơ khí nhưng chưa kiểm chứng toàn bộ dây/tiếp xúc, dung sai, tải hoặc độ bền. Không cần làm lại CAD từ đầu để viết report; chỉ sửa khi có yêu cầu hoặc kích thước thật.

## Bộ ảnh cho report

Có **15 PNG gốc trong `docs/images/` và 15 PNG cùng tên đã chú thích trong `docs/report_images/`**. Giữ nguyên ảnh gốc; người dùng đã chọn dùng script thêm chữ/mũi tên chính xác, không dùng AI vẽ lại CAD/số liệu. Không chụp lại hoặc tạo ảnh mới chỉ vì đổi máy.

| File (đuôi .png) | Nội dung |
| --- | --- |
| `01_cad_tong_the` | Tổng thể hộp gắn trên khay |
| `02_cad_ben_ngoai` | Ngoại hình hộp, LED, lỗ thoát âm |
| `03_cad_ben_trong` | Linh kiện và dây đại diện bên trong |
| `04_cad_mat_tren` | Bố trí nhìn từ trên |
| `05_cad_led_dien_tro` | LED và điện trở hạn dòng |
| `06_drawing_hop` | Drawing A3 |
| `07_so_do_he_thong` | Sơ đồ hệ thống |
| `08_so_do_dau_noi` | Sơ đồ đấu nối |
| `09_luong_firmware` | Luồng firmware |
| `10_luong_lenh_web` | Luồng điều khiển/ACK |
| `11_nguyen_ly_goc_xyz` | Nguyên lý góc XYZ và CAL |
| `12_hysteresis_dual_tone` | Hai ngưỡng và chu kỳ âm thanh |
| `13_web_paused` | Web khi tạm dừng, thử Wokwi ngày 10/11 |
| `14_web_resumed` | Web sau bắt đầu lại, thử Wokwi ngày 10/11 |
| `15_bang_trang_thai` | Bảng nguyên lý trạng thái |

Hình 01–06: thiết kế dự kiến. Hình 07–12 và 15: sơ đồ/bảng nguyên lý, **không phải kết quả đo**. Hình 13–14: mô phỏng Wokwi thật trong lượt thử, không phải sản phẩm vật lý. Số đầu tên file không phải số hình/bảng bắt buộc của Word; đặc biệt không đồng nhất `15_bang_trang_thai.png` với **Bảng 15** của report.

## Report — cách tiếp tục khi được yêu cầu

- Bản nguồn hiện tại là `24127030.docx`, đã hoàn thiện và người dùng xác nhận nộp. Các tên `24127030_cap_nhat.docx` và `24127030_cap_nhat_minh_chung.docx` thuộc các lượt trước. Đọc bản mới nhất đã lưu trước khi được yêu cầu chỉnh tiếp.
- Report cũ đã có XYZ, hai luồng, LED và ACK; tránh tự kết luận các mục đó hoàn toàn chưa có. Cần đối chiếu bản cập nhật trước khi nêu thiếu sót.
- Những điểm từng cần sửa ở bản cũ: mô tả mua hộp có sẵn thay vì chế tạo/in hộp; gọi lỗ bên hông là lỗ đi dây thay vì cổng USB đã xác nhận; thay hình CAD placeholder bằng bộ hình hiện có; phân biệt kế hoạch thử và kết quả; không khẳng định đã thử Y/chéo nếu thiếu bằng chứng.
- Với Bảng 15, sau khi được tiếp tục phải đọc **đúng bảng trong DOCX cập nhật**, rồi lập đối chiếu từng ca: điều kiện/thao tác → kết quả mong đợi → kết quả thực tế → ảnh/log/file minh chứng → trạng thái đã/chưa thử. Không điền “đạt” chỉ dựa vào code hoặc sơ đồ.
- Nếu file đang khóa, dùng bản sao đã lưu hoặc đề nghị người dùng lưu/đóng đúng file; không tự tắt Word/Fusion hay ghi đè bản mở.
- Chưa chốt bảng giá mua thật, board/USB connector, loại buzzer và hộp. Giá lịch sử trong report/guide không phải báo giá mới hoặc hóa đơn.
- Khi chỉnh DOCX/PDF, dùng skill tài liệu phù hợp và render/kiểm tra trực quan; kiểm tra mục lục, đánh số hình/bảng, chú thích, đơn vị và nguồn.

### Hướng phát triển đúng mục tiêu đồ án

Mục đích lâu dài là hỗ trợ xe chở hàng tự điều chỉnh khay khi chạy trên đường. Chỉ đưa vào phần tương lai: ước lượng tư thế bằng accelerometer + gyro, xử lý bias và ảnh hưởng gia tốc chuyển động, xuất pitch/roll có dấu; thiết kế cơ cấu, tính tải/trọng tâm/mô-men/hành trình, chọn motor/driver/nguồn; điều khiển phản hồi, giới hạn hành trình và xử lý lỗi. Thử một trục trên bàn rồi hai trục, sau đó tải/chuyển động có kiểm soát và số liệu so sánh. Không coi giữ khay ngang là đã bù toàn bộ quán tính lúc phanh/rẽ.

## Commit & Pull Request Guidelines

Chưa có lịch sử Git tại thư mục để xác nhận convention. Dùng commit ngắn, nêu hành động, ví dụ `Document report handoff and current validation status`. PR mô tả thay đổi, lý do, issue liên quan nếu có, kiểm thử đã chạy/giới hạn; thêm ảnh với thay đổi giao diện. Không sửa file không liên quan để làm sạch lịch sử.

## Security & chuyển máy

- `.gitignore` hiện loại `**/node_modules/`, `**/dist/`, `.pio/`, `.tools/`, `firmware/secrets.h`, `.env`, `.env.*` (trừ `.env.example`), log và một số cache VS Code.
- Không đọc/đưa Wi-Fi thật, token, mật khẩu vào AGENTS, ảnh, commit hoặc output công khai. Không push credentials dù repository private.
- Trước khi tự push: lưu Word/Fusion, kiểm tra `git status` và danh sách staged; chỉ thêm file đã lưu mong muốn. Giữ cả source, lockfiles, tài liệu, `.f3d`, `docs/images/`, `docs/report_images/`, Drawing PDF nếu cần chuyển toàn bộ đồ án. Kiểm tra không thêm file khóa Word `~$...` hay archive chứa bí mật/dependency.
- Người dùng tự tạo repo và push. Nên dùng repository private cho đồ án/tài liệu cá nhân. Không chạy git push, force push, xóa backup hoặc tạo remote thay người dùng nếu chưa được giao.
- Trên máy mới clone rồi cài dependency/build lại theo phần lệnh ở trên. File bí mật phần cứng sao lưu/chuyển riêng bằng kênh phù hợp; không cần chúng để build Wokwi.
- Không dựa vào `.tools/` để khôi phục môi trường: cài lại Mosquitto, compiler/Python nếu thực sự cần các công cụ đó. Không cần cài Python/g++ chỉ để chạy web và build firmware qua PlatformIO.
- Fusion archive cục bộ là backup hình học; tài liệu Drawing native liên kết nằm trên tài khoản Fusion. Đăng nhập đúng tài khoản và kiểm tra tài liệu cloud khi cần chỉnh Drawing.

## Bắt đầu phiên làm việc trên máy mới

Đọc file này, sau đó README, hướng dẫn report và phần Context/ToDo liên quan; kiểm tra file thực tế. Không tự hỏi lại những quyết định đã ghi rõ. Nếu thiếu thông tin thật sự cần thiết, gom câu hỏi ngắn và tiếp tục phần độc lập làm được. Cập nhật tài liệu khi hành vi thay đổi, phân biệt sự thật đã kiểm chứng và đề xuất.

**Trạng thái hiện tại ngày 14/11/2026:** xem mục ưu tiên đầu file. Báo cáo/slide đã nộp, ba Markdown học tập đã tạo, cloud/thông báo/Internet còn cần xử lý theo quy định mới được cung cấp. Thư mục đã có Git repository, nhánh `main` liên kết `origin/main` theo ghi nhận trước. Các câu “chưa có Git” thuộc lịch sử. Không tự push hoặc công bố dữ liệu.
