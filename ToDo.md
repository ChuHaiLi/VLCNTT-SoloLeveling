# ToDo — Báo cáo và Autodesk Fusion 360

Ngày cập nhật: **11/11/2026**. Dùng cùng **Context.md**. Đây là kế hoạch công việc, không phải báo cáo kết quả đã hoàn thành. Mục 5 đã bổ sung việc đối chiếu đề cương và cấu trúc PDF tham khảo.

## 1. Cách dùng với ChatGPT/Codex bên web

Tải lên hai file này cùng quy định PDF, README và bản report mới nhất. Nếu gửi thêm `VLCNTT (nhóm khác).pdf`, chỉ dùng nó để tham khảo cấu trúc; không sao chép nội dung, linh kiện hay chức năng. Có thể dùng lời nhắn mở đầu:

> Hãy đọc Context.md và ToDo.md. Giúp tôi hoàn thiện báo cáo và bản thiết kế Autodesk Fusion 360 theo đúng phạm vi đo/cảnh báo nghiêng tĩnh và điều khiển giám sát qua web đã có. Tôi làm một mình, dự định demo bằng sản phẩm thật. Trước tiên hãy đối chiếu yêu cầu nộp, xác định thông tin thiếu và lập thứ tự làm việc. Không bịa số đo, kích thước hoặc kết quả; không biến khay tự cân bằng tương lai thành tính năng hiện tại. Nếu chưa có công cụ thao tác Fusion, hướng dẫn tôi từng bước theo giao diện/ảnh thực tế.

Chỉ đánh dấu hoàn tất một mục khi có đầu ra tương ứng. Việc đã kiểm thử bằng Wokwi không đồng nghĩa đã nghiệm thu linh kiện thật.

## 2. Phần nền đã có — không làm lại từ đầu

- [x] Firmware tính góc tĩnh từ X/Y/Z, hiệu chuẩn vector, lọc và hysteresis 15°/12°.
- [x] Còi Dual-Tone passive và bíp lỗi riêng; cấu hình active/passive cho phần cứng thật.
- [x] Luồng MPU6050 → ESP32 → MQTT → Express → React.
- [x] Luồng web → ESP32 → LED GPIO26, kết hợp bắt đầu/tạm dừng giám sát, có xác nhận lệnh.
- [x] Phân biệt safe/alarm/paused/sensor-error/stale; ẩn góc khi không nên hiển thị.
- [x] Build Wokwi/hardware mẫu, 16 test backend và các test C++; đã thử luồng điều khiển với Wokwi.
- [x] README có hướng dẫn chạy và hướng phát triển khay tự điều chỉnh trên xe.
- [ ] Nạp và kiểm chứng với board/cảm biến/còi/LED thật; ghi lại kết quả mới.

Các ô đã đánh dấu là hiện trạng ghi nhận từ phiên triển khai trước, không phải phép thử vừa được chạy lại khi tạo hai file bàn giao.

## 3. P0 — Chốt đầu vào trước khi làm bản nộp hoặc bản chế tạo

- [ ] Xác nhận đang cần **đề cương/proposal**, **báo cáo cuối kỳ** hay cả hai. Không dùng phần kết quả của báo cáo cuối kỳ như dữ liệu có sẵn trong đề cương.
- [ ] Tải lên thông báo/biểu mẫu mới nhất của giảng viên: nội dung, định dạng, số trang, hạn nộp, slide, thời lượng trình bày và quy tắc tên file.
- [ ] Xác nhận tên đề tài, họ tên/MSSV, giảng viên và cách ghi nhóm cá nhân. Đối chiếu thông tin từ kế hoạch cũ trước khi điền bìa.
- [ ] Đối chiếu việc được làm cá nhân và cách tính điểm tích hợp/luồng LED; không tự khẳng định điểm được nhận.
- [ ] Tải lên đề cương `.docx` và file Fusion hiện có nếu muốn chỉnh tiếp, thay vì tạo bản mới không liên quan.
- [ ] **[CẦN XÁC NHẬN]** Chọn bản report làm gốc: đã đọc `../../BO_HO_SO_DE_CUONG_KHAY_NGHIENG/DE_CUONG_HOAN_CHINH_NOI_DUNG.md`; Word cùng thư mục tên `DE_CUONG_HOAN_CHINH_KHAY_NGHIENG.docx` đang bị khóa nên chưa đọc/so đồng bộ được. Nếu đang dùng bản khác, cung cấp tên file và đường dẫn hoặc đính kèm bản mới nhất. Chưa tìm thấy báo cáo cuối kỳ riêng trong phạm vi thư mục đã rà.
- [ ] Xác nhận linh kiện đã mua/đã nhận, ngân sách còn lại, cách chế tạo vỏ và thời gian có thể dành cho đồ án.

**Đầu ra:** bảng “đã chốt / chờ xác nhận”, phạm vi bản nộp, danh sách nguồn và thứ tự ưu tiên. Có thể viết các phần đã đủ thông tin trong lúc chờ những mục còn thiếu.

## 4. P1 — Thu kích thước và chuẩn bị thiết kế Fusion

### 4.1. Dữ liệu cần người dùng cung cấp

- [ ] Ảnh rõ mặt trên/dưới của ESP32, MPU6050, buzzer, LED và bảng mạch lắp thử thực tế.
- [ ] Kích thước dài × rộng × cao từng module; chiều cao chân cắm, đầu nối và dây.
- [ ] Đường kính/vị trí lỗ bắt vít, khoảng cách tâm lỗ; vị trí và hướng cổng USB.
- [ ] Kích thước khay/đế dự kiến, khoảng trống cho hộp, cách cố định hộp và vị trí đặt cảm biến.
- [ ] Xác nhận lắp bằng breadboard, board hàn lỗ hay PCB; không dựng vỏ khít theo một phương án chưa chọn.
- [ ] Xác nhận vật liệu và cách làm: in 3D, gia công thủ công, hộp có sẵn hoặc phương án khác.
- [ ] Xác nhận có cần đế chỉnh góc bằng tay để lặp lại phép thử hay chỉ cần nghiêng khay bằng tay.

Nếu chỉ có ảnh mà chưa có thước/kích thước tham chiếu, không suy ra kích thước chế tạo chính xác. Dùng hình khối đại diện và ghi **TBD/chờ đo**.

### 4.2. Tạo mô hình theo tham số

- [ ] Chốt đơn vị mm, gốc tọa độ và các trục khay. Nêu rõ +Z khi khay nằm ngang.
- [ ] Lập bảng tham số, tối thiểu: kích thước khay, kích thước hộp, độ dày thành/nắp, khe hở lắp ráp, gá board, lỗ USB, lỗ LED, lỗ âm buzzer và vị trí lỗ bắt vít.
- [ ] Mỗi tham số ghi nguồn: đo thực tế, datasheet đúng model hay giả định thiết kế. Không điền số giả định như số đo linh kiện.
- [ ] Bố trí linh kiện trước khi dựng chi tiết vỏ; kiểm tra USB cắm/rút được và nắp mở được.
- [ ] Tạo component riêng cho khay/đế, thân hộp, nắp và các gá/linh kiện đại diện; đặt tên rõ ràng.
- [ ] Gắn MPU6050 cứng lên phần chuyển động cùng khay; thể hiện vị trí và trục cảm biến trong hình.
- [ ] Thiết kế thân/nắp, vị trí LED, lỗ âm còi, lối dây và cách cố định board; thêm bo mép/gân/gá theo phương pháp chế tạo đã chọn.
- [ ] Nếu có cơ cấu chỉnh góc bằng tay, thể hiện giới hạn và khoảng hở; không mô tả nó là cơ cấu tự cân bằng.
- [ ] Kiểm tra lắp ráp, va chạm, tiếp cận vít, dây bị kẹp, khả năng đặt cảm biến đúng tư thế và độ ổn định khi demo.

**Điều kiện chốt kích thước:** có số đo linh kiện đủ dùng, phương pháp chế tạo xác định và bố trí đã được người dùng đối chiếu. Khi chưa đủ, chỉ bàn giao mô hình khái niệm/bản nháp tham số.

### 4.3. Đầu ra CAD phục vụ báo cáo và chế tạo

- [ ] File thiết kế gốc Fusion có component, tham số và lịch sử dựng phù hợp; định dạng native theo cấu trúc thiết kế thực tế.
- [ ] Hình tổng thể khay và hộp, mặt trên/bên, bên trong hộp và hình phân rã có chú thích.
- [ ] Bản vẽ kích thước đủ để làm vỏ/gá; thống nhất đơn vị và các kích thước dùng trong báo cáo.
- [ ] Nếu cần in/gia công: xuất định dạng mà nơi chế tạo yêu cầu, kiểm tra đơn vị, tỉ lệ và đối chiếu lại file xuất.
- [ ] Chèn vào báo cáo hình tự dựng, phân biệt “mô hình CAD”, “thiết kế đề xuất” và “ảnh sản phẩm thực tế”.
- [ ] Sau khi lắp thật, đo lại và sửa CAD cho khớp hiện vật; ghi rõ nếu hiện vật còn khác thiết kế.

### 4.4. Cập nhật CAD ngày 11/11 — đã có bản minh họa, còn chờ linh kiện thật

- [x] Người dùng xác nhận mua hộp có sẵn, chưa chọn hộp cụ thể; cả hộp gắn trên khay và nghiêng cùng khay.
- [x] Xác nhận chức năng hai lỗ cũ: thoát âm buzzer trên nắp và đưa dây qua thành hộp.
- [x] Đối chiếu ảnh đo và đọc hình học trong Fusion: thân 240 × 155 × 30 mm/Shell 3 mm; nắp 250 × 165 × 3 mm; lỗ buzzer Ø8, LED Ø5,2, lỗ dây 16 × 10 mm. Tất cả là kích thước CAD dự kiến.
- [x] Lưu `TiltTray_before_report_completion.f3d` trước khi bổ sung; giữ nguyên file `.f3d` người dùng gửi.
- [x] Xuất `TiltTray_Report_Concept.f3d`: 22 component/66 body, thêm phần LED xuyên nắp và chân, điện trở 330 Ω, tuyến dây tượng trưng, đệm cố định và khay tham chiếu. Phần mới là hình học minh họa/Base Features, chưa ràng buộc tham số hoàn chỉnh.
- [x] Kiểm tra nhóm cơ khí chính trong Fusion: 0 chồng lấn thể tích; mở lại file xuất và kiểm tra lại đạt; CRC archive hợp lệ. Không coi đây là kiểm tra toàn bộ dây/dung sai/vật thật.
- [ ] **[CẦN XÁC NHẬN]** Khay 400 × 300 mm là đề xuất tạm của trợ lý, chưa phải kích thước người dùng chốt. Bản minh họa có đáy 3 mm, thành cao 20 mm từ mặt trong đáy (cao ngoài 23 mm); cập nhật khi chọn khay thật.
- [ ] Chọn hộp và khay mua thật, lấy kích thước lòng hộp/chiều cao sử dụng/cách giữ nắp; sửa CAD thay vì đặt mua với giả định sẽ đúng bản vẽ.
- [ ] Chốt LED, cách gá, buzzer, chân/cổng, vật tư cố định và khoảng trống mở nắp. Các đệm, chân LED, điện trở và cổng USB trong CAD hiện chỉ minh họa.
- [x] Tạo `images/` giữ ảnh gốc và `report_images/` chứa bản có chú thích bằng script theo lựa chọn của người dùng; đã có 15 cặp PNG cùng tên, manifest SHA-256, danh mục Markdown và gallery HTML.
- [x] Xuất 5 góc nhìn Fusion: tổng thể khay–hộp, hộp đóng nắp, bên trong, mặt trên và chi tiết LED/330 Ω. Bản chú thích ghi rõ CAD dự kiến, tuyến dây minh họa.
- [x] Dựng Drawing Fusion: 4 base view, 10 kích thước liên kết cạnh, xuất PDF A3 `output/pdf/TiltTray_Drawing_Concept.pdf` và ảnh gốc 300 dpi `images/06_drawing_hop.png`; đã kiểm tra trực quan và sửa ghi chú tiếng Việt. Là bản tham khảo cho report, chưa đủ để gia công.
- [ ] Hoàn tất/xác nhận Save As bản `TiltTray_Drawing_Report_Final` tại `Default Project → TiltTray_Report`: đang chờ người dùng bấm hộp thoại mà công cụ không kích hoạt được. Đã chuyển bản Layout_Draft của trợ lý sang Read-Only để giải phóng 1 chỗ editable; không dùng các bản Drawing thử làm bản nộp.
- [x] Tạo hình kiến trúc hai luồng, đấu nối, xử lý firmware, tuần tự lệnh/ACK, nguyên lý góc XYZ, hysteresis/Dual-Tone và bảng trạng thái; dùng lại hai ảnh web Wokwi đã kiểm thử. Xem `report_images/README.md` cho nguồn, chú thích và cách dùng.
- [ ] Chụp bổ sung Wokwi Simulator + Serial I²C, chuỗi góc và các lỗi/phục hồi; chụp sản phẩm thật, dụng cụ đo và thu số liệu sau khi mua/lắp. Không coi sơ đồ nguyên lý là ảnh nghiệm thu.
- [ ] Chèn hình vào bản report mới nhất, đánh số theo chương; xác nhận tên tác giả/MSSV/tên đề tài và khung tên Drawing trước khi nộp.

## 5. P1 — Soạn báo cáo theo đúng hiện trạng

Khung dưới đây là đề xuất nội dung, phải đối chiếu mẫu chính thức. Khi viết đề cương, dùng mục “kiểm thử dự kiến”; khi viết báo cáo cuối kỳ, chỉ điền kết quả đã thu được.

### 5.1. Khung nội dung tổng quát

- [ ] **Mở đầu:** tình huống chở hàng, mục tiêu dài hạn tự điều chỉnh khay, lý do chọn bước đầu đo/cảnh báo nghiêng tĩnh trong phạm vi một người.
- [ ] **Mục tiêu và giới hạn:** đo khay đứng yên/nghiêng chậm; chưa đo tin cậy khi xe tăng tốc/phanh/rẽ; chưa có motor tự cân bằng; chưa kết luận hàng chắc chắn trượt hoặc xe sắp lật.
- [ ] **Cơ sở vật lý:** vector trọng lực, hệ trục gắn đất/gắn cảm biến, gia tốc khác vị trí/vận tốc; lý do dùng cả X/Y/Z và giới hạn khi có gia tốc chuyển động.
- [ ] **Thuật toán:** góc giữa vector đo và mốc CAL, trường hợp mốc +Z, góc tổng 0–180°, lấy mẫu 100 ms, bộ lọc 0,75/0,25, kiểm tra 0,65–1,35 g và hysteresis 15°/12°.
- [ ] **Phân tích trạng thái:** đang đo, vượt ngưỡng, tạm dừng, lỗi cảm biến và mất dữ liệu; giải thích vì sao tạm dừng vẫn gửi heartbeat và `alarmOn` không đại diện bíp lỗi.
- [ ] **Thiết kế điện/phần mềm:** bảng linh kiện, sơ đồ đấu nối, GPIO21/22/25/26, vai trò firmware/task mạng/backend/frontend/broker và hai chiều MQTT.
- [ ] **Luồng điều khiển:** web gửi lệnh, backend chờ ESP32 xác nhận, GPIO/LED đổi trước khi báo thành công; phân biệt gửi được lệnh với thực hiện được lệnh.
- [ ] **Thiết kế cơ khí:** mục tiêu đóng gói, bố trí, vị trí cảm biến, hướng trục, thông số đã chốt, hình CAD ngoài/trong và phương án lắp ráp.
- [ ] **Bảng chức năng:** cập nhật chức năng đo XYZ, CAL, cảnh báo, MQTT/web, mất dữ liệu, lỗi cảm biến và bật/tắt giám sát kèm LED; bỏ mô tả web chỉ hiển thị hoặc thay đổi ngưỡng nếu chưa triển khai.
- [ ] **Bảng kinh phí:** dùng linh kiện thực tế/giá tra cứu có ngày và nguồn; phân biệt dự toán, đã mua và phí chế tạo/vận chuyển.
- [ ] **Phân công và tiến độ:** ghi đúng thực hiện cá nhân; tách các đầu việc cụ thể và cập nhật mốc theo thông báo mới, không giữ nguyên lịch cũ như lịch chính thức.
- [ ] **Kiểm thử/kết quả:** tách unit test, peer giả lập, Wokwi và thiết bị thật; ảnh và bảng số liệu phải có nguồn/ngày/điều kiện thử.
- [ ] **Hạn chế và hướng phát triển:** nêu tách gia tốc, gyroscope/hợp nhất cảm biến, pitch/roll có dấu, cơ cấu hai trục, driver/nguồn, điều khiển phản hồi và kiểm chứng tải là các bước chưa thực hiện.
- [ ] **Tài liệu tham khảo và phụ lục:** dẫn đúng tài liệu cảm biến, Wokwi, mã nguồn, công thức; ghi nhận nguồn/hỗ trợ AI theo yêu cầu học phần và khả năng giải thích của người thực hiện.

### 5.2. Đối chiếu đã làm và các nội dung cũ cần cập nhật

**[ĐỀ XUẤT BỔ SUNG]** Các mục 5.2–5.5 phục vụ hoàn thiện report, không phải danh sách tiêu chí mới của giảng viên. Căn cứ chính thức và các điểm cần hỏi thầy ở Context mục 9; bảng đối chiếu chi tiết ở Context mục 11. PDF tham khảo là bản phác thảo, theo người dùng còn thiếu/sơ sài, không dùng làm chuẩn đầy đủ hay bảo đảm điểm.

- [x] Đọc 12 trang PDF tham khảo; đối chiếu mục lục, sơ đồ/luồng kèm diễn giải từng bước và mục mô phỏng.
- [x] Đọc bản nội dung đề cương Markdown và xem sơ đồ hệ thống đi kèm; xác định đã có sơ đồ tổng thể và trình tự hoạt động, không ghi nhầm là thiếu hoàn toàn.
- [x] Ghi khoảng trống và đề xuất vào Context/ToDo. Đã tạo bộ 15 hình tại `report_images/`; chưa sửa/chèn hình vào report Word/Markdown gốc, vẫn cần ảnh và số đo thực nghiệm còn thiếu.
- [ ] Đối chiếu lại Word sau khi truy cập được và người dùng xác nhận đó là bản mới nhất; nếu nội dung khác Markdown, cập nhật bảng khoảng trống trước khi viết tiếp.
- [ ] Sửa phần một trục/`atan2(ax, az)`/góc có dấu tại mục 3–6 của đề cương thành góc tổng XYZ theo vector CAL, đúng Context mục 5.
- [ ] Giữ ngưỡng chỉ đọc; sửa diễn đạt “web chưa có luồng điều khiển ngược” thành đã có Bắt đầu/Tạm dừng, LED chế độ và xác nhận thực hiện. Rà cả bảng F/W và tài liệu/slide liên quan nếu được giao chỉnh sau.
- [ ] Bổ sung chức năng điều khiển chế độ vào bảng tổng hợp và mô tả chi tiết, giữ mã F/W cũ nhất quán; cập nhật ca thử tương ứng. Không coi nhánh buzzer tự động là lệnh điều khiển từ web.
- [ ] Cập nhật kiểu còi: passive hỗ trợ Dual-Tone; active chỉ bật/tắt. BOM cũ chưa có LED/điện trở cần bổ sung theo phương án thật đã xác nhận.
- [ ] Cập nhật tiến độ/đầu việc CV để phản ánh phần mềm đã thử ngày 10/11 và phần cứng chưa nghiệm thu; thay nhãn “dự kiến” bằng kết quả chỉ ở nơi đã có bằng chứng.

### 5.3. Hoàn thiện mục riêng “Kiến trúc và luồng hoạt động”

- [ ] **Sơ đồ khối:** vẽ đủ MPU6050 → ESP32 → Mosquitto → Express → React, chiều lệnh quay lại ESP32 và nhánh buzzer/LED. Ghi rõ I²C, MQTT, HTTP; xác định phần trên khay và phần trên máy tính. Sơ đồ cũ chỉ có chiều đo và buzzer cần cập nhật.
- [ ] **Sơ đồ điện:** dùng chân đã chốt, nguồn/GND, điện trở LED và buzzer đúng kiểu; thêm bảng chân để người đọc có thể đấu nối. Xác nhận mạch thật trước khi gắn nhãn “đã lắp”.
- [ ] **Lưu đồ firmware:** khởi tạo/nạp CAL → kiểm tra chế độ → đọc/kiểm tra dữ liệu → tính góc → lọc → hysteresis → cập nhật còi; vẽ nhánh lỗi, tạm dừng và heartbeat. Task mạng/reconnect chạy riêng, không vẽ thành bước chặn đọc cảm biến.
- [ ] **Sơ đồ tuần tự bật/tắt:** React/POST → Express → broker → ESP32/queue → chế độ và GPIO26 → telemetry xác nhận → Express → React. Thể hiện bootId/requestId, thời gian chờ khoảng 4 giây và nhánh thất bại; ACK nằm trong telemetry.
- [ ] **Bảng trạng thái:** safe/alarm/paused/sensor-error/stale; điều kiện chuyển, góc hiển thị/ẩn, còi và LED. Nêu rõ stale do độ mới bản tin, paused vẫn có heartbeat, LED không chứng minh cảm biến tốt.
- [ ] **Thuyết minh từng bước luồng đo:** đầu vào XYZ → kiểm tra mẫu → tính góc theo CAL → lọc → ngưỡng/còi → MQTT → backend xác thực → API → web; ghi chu kỳ cấu hình 100 ms/500 ms/1 giây và lỗi ở từng chặng.
- [ ] **Thuyết minh từng bước luồng điều khiển:** kiểm tra nguồn dữ liệu mới → phát lệnh theo thiết bị/phiên → áp dụng → xác nhận → kết quả web; giải thích mất mạng/timeout không được coi là thành công.
- [ ] Bổ sung mô tả CAL, cách dừng/bắt đầu lại và tiếng bíp lỗi; nêu điều kiện không nhận CAL và việc tạm dừng có thể hủy CAL đang chạy.
- [ ] Đánh số hình/bảng, có chú thích, giải thích ký hiệu và đoạn dẫn chiếu. Tách hình cơ khí bên trong khỏi lưu đồ phần mềm; dùng cùng thuật ngữ với giao diện/mã nguồn.

**Đầu ra cần có:** sơ đồ tổng thể hai chiều, sơ đồ điện/bảng chân, lưu đồ firmware, sơ đồ tuần tự lệnh, bảng trạng thái và phần mô tả từng bước. Đây là đề xuất nội dung; có thể gộp hình để phù hợp số trang chính thức, nhưng không bỏ các nhánh lỗi quan trọng.

### 5.4. Bổ sung mục “Mô phỏng hệ thống và cách tái lập”

- [ ] Mô tả PlatformIO môi trường `wokwi`, `diagram.json`, `wokwi.toml`, Wokwi for VS Code và gateway; ghi điều kiện extension/kích hoạt theo README, không bịa đường dẫn dự án Wokwi web.
- [ ] Mô tả thứ tự broker → backend → frontend → Wokwi; địa chỉ broker phía firmware mô phỏng khác địa chỉ phía backend, topic telemetry/command và các API; dẫn README cho lệnh chi tiết.
- [ ] Chèn ảnh mạch của chính đồ án và ảnh web/Serial tương ứng, có nguồn/ngày/điều kiện thử. Tách thử MPU6050 qua I²C/thanh trượt khỏi `ACCEL` bơm Serial và `FAULT` bơm lỗi.
- [ ] Nêu rõ `npm run simulate` là dữ liệu mẫu, dừng trước nghiệm thu Wokwi; chỉ chạy một nguồn telemetry mỗi lượt. Tách kết quả mô phỏng khỏi kết quả sản phẩm thật.
- [ ] Liên kết kịch bản 0° → 10° → 16° → 14° → 11°, pause/resume, lỗi cảm biến và ngắt/khôi phục broker với bảng kiểm thử mục 6. Ghi cả kết quả mong đợi và quan sát thật, không chỉ đưa ảnh/link mô phỏng.

### 5.5. Làm rõ từng chức năng và kiểm chứng độ đầy đủ

- [ ] Với mỗi chức năng, viết đủ **mục đích → đầu vào/điều kiện trước → từng bước xử lý → đầu ra → trường hợp lỗi → tiêu chí thử**; không dừng ở một câu “ESP32 xử lý rồi gửi web”.
- [ ] Lập bảng mã chức năng → khối/sơ đồ/mã nguồn liên quan → ca thử → minh chứng → đã/chưa thử. Dùng riêng trạng thái mô phỏng và phần cứng thật.
- [ ] Bổ sung bảng giao thức ngắn: topic/payload/trường dữ liệu/đơn vị, API và metadata xác nhận; lấy từ Context mục 6 và mã hiện hành, không tự tạo topic ACK hay đổi định dạng.
- [ ] Kiểm tra sự thống nhất giữa chức năng, luồng, BOM, hình điện, CAD, tiến độ và kiểm thử. Thiếu dữ liệu thì ghi **[CẦN XÁC NHẬN]** thay vì chép từ nhóm khác.
- [ ] Với báo cáo cuối kỳ, tách kết quả, phân tích so với mục tiêu, hạn chế và kết luận; chỉ viết sau khi có bằng chứng tương ứng. Không bỏ cơ sở vật lý/tài liệu tham khảo vì PDF mẫu không tách chương đó.

## 6. P1 — Thu minh chứng thật trước khi viết phần kết quả cuối cùng

### 6.1. Bảng đo góc và cảnh báo

- [ ] Chọn dụng cụ đo góc tham chiếu và cách đặt khay cố định; mô tả giới hạn của dụng cụ.
- [ ] CAL trên mặt phẳng ngang; ghi board/cảm biến, nguồn cấp, cấu hình buzzer và ngày thử.
- [ ] Chạy 0° → 10° → 16° → 14° → 11°; giữ mỗi mốc đủ lâu cho bộ lọc/web cập nhật.
- [ ] Thử trước/sau/trái/phải và một số hướng chéo; lặp lại để đánh giá độ ổn định.
- [ ] Ghi góc tham chiếu, số đo thiết bị ổn định, trạng thái còi/LED/web và nhận xét; chỉ tính sai số khi có số đo thực.
- [ ] Đánh giá ngưỡng 15°/12° và khoảng kiểm tra gia tốc sau thử; nếu đổi tham số, cập nhật mã, bảng và mô tả đồng thời.

### 6.2. Hai chiều MQTT và các tình huống lỗi

- [ ] Quay/ghi lại khay thật thay đổi góc, telemetry và web thay đổi tương ứng.
- [ ] Từ web tạm dừng khi đang cảnh báo: LED tắt, còi im, góc ẩn; chờ hơn 5 giây vẫn hiện tạm dừng.
- [ ] Bắt đầu lại: LED sáng, lấy góc mới và cảnh báo theo tư thế hiện tại.
- [ ] Ngắt broker/mạng trong điều kiện thử kiểm soát: cảnh báo tại chỗ theo chế độ hiện có, web chuyển stale sau >5 giây; khôi phục và kiểm tra không phát lại lệnh cũ.
- [ ] Thử lỗi cảm biến bằng phương án phù hợp; phân biệt lỗi bơm qua `FAULT ON` trong Wokwi với lỗi trên mạch thật.
- [ ] Kiểm tra reboot: giám sát mặc định bật, mốc CAL đã lưu được nạp lại; ghi điều kiện thực tế thay vì suy từ mô phỏng.
- [ ] Chụp sản phẩm đã đóng hộp, bên trong, các cổng và vị trí cảm biến; đối chiếu với CAD.

Giữ bảng “mong đợi” và “quan sát được” riêng. Mốc 100 ms/500 ms/1 giây trong mã là chu kỳ thiết kế, không tự biến thành độ trễ đầu-cuối đã đo. `ACCEL` bỏ qua I²C và không phải phép đo cảm biến thật. Không đổi ảnh dùng API giả lập thành ảnh nghiệm thu mạch thật.

## 7. P2 — Kết nối kết quả CAD và báo cáo, chuẩn bị nộp/demo

- [ ] Soát tên linh kiện, chân, ngưỡng, công thức và các trạng thái giữa firmware, README, báo cáo, sơ đồ điện và bản vẽ.
- [ ] Soát số thứ tự hình/bảng, chú thích, nguồn, đơn vị, tài liệu tham khảo và các liên kết nội bộ.
- [ ] Đánh dấu hoặc xử lý hết các chỗ chờ xác nhận; không âm thầm điền dữ liệu chưa có để làm đẹp bản nộp.
- [ ] Xuất DOCX/PDF và slide nếu đúng yêu cầu hiện hành; mở thử từng file và kiểm tra trực quan hình, bảng, font, mục lục, số trang.
- [ ] Chuẩn bị kịch bản demo hai luồng, ảnh/video dự phòng và checklist chạy broker/backend/web/firmware theo README.
- [ ] Ôn vấn đáp: giải thích atan2/vector CAL, Y có vai trò gì, hysteresis, lọc, Dual-Tone, GPIO LED, MQTT, xác nhận lệnh, trạng thái tạm dừng và giới hạn đo tĩnh.
- [ ] Kiểm tra tên file, nơi nộp, hạn nộp và lưu bằng chứng nộp theo thông báo được xác nhận.

## 8. P3 — Tương lai, không đưa vào mục đã hoàn thành

- [ ] Tách ảnh hưởng gia tốc chuyển động bằng ước lượng tư thế/hợp nhất accelerometer–gyroscope và đánh giá giới hạn khi tăng tốc kéo dài.
- [ ] Xuất pitch/roll có dấu, bổ sung dữ liệu chuyển động khác nếu có căn cứ cần thiết.
- [ ] Thiết kế và thử cơ cấu điều chỉnh một trục trên bàn trước khi mở rộng hai trục.
- [ ] Tính tải/trọng tâm, chọn động cơ/driver/nguồn theo số đo và yêu cầu, xây điều khiển phản hồi, giới hạn hành trình và xử lý lỗi.
- [ ] Thử với tải và chuyển động có kiểm soát; so sánh bật/tắt điều chỉnh, đánh giá trượt hàng và giới hạn vận hành.

Không mặc định giữ khay nằm ngang là đã bù được quán tính lúc phanh/rẽ. Phần cơ cấu tự điều chỉnh chỉ là định hướng sau khi bản đo/cảnh báo hiện tại được kiểm chứng.

## 9. Bước bắt đầu được đề nghị cho trợ lý mới

1. Tóm tắt lại phạm vi hiện tại và tương lai bằng một đoạn để xác nhận cùng hiểu đúng.
2. Xác định bản nộp cần làm và xin những tài liệu/thông số còn thiếu quan trọng nhất; gộp câu hỏi, không hỏi rời rạc quá nhiều.
3. Lập khung báo cáo có thể điền dần và sơ đồ bố trí CAD bằng các tham số đã biết/chờ đo.
4. Triển khai phần đã đủ thông tin trước; theo dõi các mục chờ xác nhận trong bảng công việc.
5. Chỉ chốt bản chế tạo và phần kết quả thực nghiệm sau khi có dữ liệu tương ứng từ người dùng.
