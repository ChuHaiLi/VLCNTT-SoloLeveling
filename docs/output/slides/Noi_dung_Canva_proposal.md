# Hộp cảnh báo độ nghiêng và giám sát qua web

Bài trình bày proposal của Lưu Chí Hải, MSSV 24127030, nhóm 24, lớp 24C11.

Thời lượng thiết kế: khoảng 10-12 phút trình bày trong buổi vấn đáp khoảng 20 phút. Có 12 slide chính và 3 slide phụ lục để mở khi trả lời câu hỏi. Đây là nội dung để dựng trên Canva, chưa phải một thiết kế Canva hoặc tệp PPTX hoàn chỉnh.

## Hình thức trình bày

- Tỷ lệ 16:9. Nền sáng, chữ xanh đậm, dùng xanh lá cho trạng thái bình thường và đỏ cho cảnh báo.
- Một ý chính trên mỗi slide. Tiêu đề khoảng 32-40 pt, nội dung khoảng 24-28 pt. Công thức và số liệu chính lớn hơn phần giải thích.
- Dùng ảnh CAD gốc và ảnh Wokwi đã có. Với sơ đồ hệ thống và công thức, ưu tiên chữ và đối tượng có thể chỉnh sửa trên Canva.
- Giữ ảnh mô phỏng đúng dữ liệu gốc. Ghi rõ “Thiết kế dự kiến” ở hình CAD và “Mô phỏng Wokwi” ở kết quả thử.
- Các đường dẫn trong danh mục ảnh cuối tệp chỉ phục vụ chọn ảnh khi dựng. Phần chữ để đưa lên slide nằm dưới nhãn “Nội dung trên slide”.

## Slide 1 - Hộp cảnh báo độ nghiêng và giám sát qua web

**Nội dung trên slide**

HỘP CẢNH BÁO ĐỘ NGHIÊNG
VÀ GIÁM SÁT QUA WEB

Lưu Chí Hải
MSSV 24127030, nhóm 24
Vật lý cho Công nghệ thông tin, lớp 24C11

**Hình ảnh**

Ảnh CAD tổng thể. Ghi nhỏ bên cạnh hình: “Thiết kế dự kiến”.

**Lời trình bày**

Em trình bày đề tài đo và cảnh báo độ nghiêng của khay bằng ESP32 và MPU6050. Hệ thống hiển thị trạng thái trên web và cho phép bắt đầu hoặc tạm dừng giám sát từ web.

Thời lượng: khoảng 20 giây.

## Slide 2 - Bài toán và phạm vi

**Nội dung trên slide**

- Khay chở hàng có thể nghiêng khi xe đỗ trên nền dốc.
- Thiết bị đo góc của khay và phát còi khi góc vượt ngưỡng.
- Phạm vi hiện tại: khay đứng yên hoặc nghiêng chậm.

**Lời trình bày**

Em bắt đầu với bài toán đo nghiêng tĩnh. Cả hộp điện tử gắn trên khay và nghiêng cùng khay. Khi xe tăng tốc, phanh hoặc rung mạnh, gia tốc chuyển động có thể làm sai góc ước lượng. Việc xử lý xe đang chạy thuộc hướng phát triển sau này.

Thời lượng: khoảng 45 giây.

## Slide 3 - Thiết bị và đấu nối

**Nội dung trên slide**

| Thành phần | Chức năng |
| --- | --- |
| MPU6050 | Đọc gia tốc X, Y, Z qua I²C |
| ESP32 | Tính góc, xử lý cảnh báo và kết nối MQTT |
| Buzzer | Phát cảnh báo nghiêng và bíp lỗi |
| LED xanh, điện trở 330 Ω | Báo chế độ giám sát |

SDA: GPIO21. SCL: GPIO22. Buzzer: GPIO25. LED: GPIO26.

**Hình ảnh**

Sơ đồ đấu nối hoặc phần mạch trong ảnh Wokwi. Dành đủ diện tích để đọc tên chân.

**Lời trình bày**

MPU6050 cung cấp ba thành phần gia tốc. ESP32 đọc dữ liệu, tính góc và điều khiển còi tại thiết bị. LED xanh cho biết giám sát đang bật hay tạm dừng. LED sáng không thể hiện riêng cảnh báo nghiêng hoặc kết nối mạng.

Thời lượng: khoảng 50 giây.

## Slide 4 - Hai luồng xử lý dữ liệu

**Nội dung trên slide**

Luồng đo: MPU6050, ESP32, Mosquitto, Express, React.

Luồng điều khiển: React, Express, Mosquitto, ESP32, chế độ giám sát và LED.

ESP32 gửi trạng thái sau khi áp dụng lệnh để web cập nhật kết quả.

**Bố cục**

Sơ đồ gồm các khối theo hai chiều truyền. Ghi I²C, MQTT và HTTP tại các kết nối tương ứng. Sơ đồ hệ thống hiện có là nguồn tham khảo về cấu trúc.

**Lời trình bày**

Ở chiều đo, ESP32 gửi số đo qua MQTT đến backend và web lấy trạng thái từ API. Ở chiều điều khiển, thao tác trên web đi qua backend và broker đến ESP32. Sau khi đổi chế độ và LED, ESP32 gửi trạng thái trở lại. Backend đối chiếu phản hồi với yêu cầu đang chờ.

Thời lượng: khoảng 1 phút.

## Slide 5 - Tính góc nghiêng từ gia tốc XYZ

**Nội dung trên slide**

a = (ax, ay, az): vector gia tốc hiện tại.

r: vector mốc ngang sau CAL.

θ = atan2(‖r × a‖, r · a) × 180 / π

CAL thu khoảng 30 mẫu trong 3 giây khi khay nằm ngang và đứng yên.

Góc tổng từ 0 đến 180°, không biểu diễn riêng hướng nghiêng.

**Bố cục**

Công thức lớn bên trái. Hình hai vector và góc θ bên phải. Có thể tham khảo hình nguyên lý XYZ hiện có để dựng lại phần hình học bằng các đối tượng chỉnh sửa được.

**Lời trình bày**

Khi khay đứng yên, hướng vector gia tốc cho biết tư thế của cảm biến. CAL lấy hướng ngang làm mốc. Chương trình tính góc giữa vector hiện tại và vector mốc bằng tích có hướng, tích vô hướng và hàm atan2f. Công thức sử dụng cả ba trục, nên phát hiện được nghiêng theo X, Y và hướng chéo. Kết quả là một góc tổng, chưa tách thành pitch và roll có dấu.

Thời lượng: khoảng 1 phút 20 giây.

## Slide 6 - Lọc góc và hai ngưỡng cảnh báo

**Nội dung trên slide**

Góc lọc = 0,75 × góc lọc trước + 0,25 × góc mới.

| Góc đã lọc | Cảnh báo |
| --- | --- |
| Từ 15° trở lên | Bật |
| Từ 12° trở xuống | Tắt |
| Lớn hơn 12° và nhỏ hơn 15° | Giữ trạng thái trước |

**Lời trình bày**

Bộ lọc EMA giảm những thay đổi nhỏ giữa các mẫu. Hai ngưỡng giúp còi tránh bật tắt liên tục quanh một mốc. Ví dụ, sau khi góc tăng đến 16° và cảnh báo bật, giảm xuống 14° vẫn giữ cảnh báo. Góc phải giảm đến 12° hoặc thấp hơn mới tắt.

Thời lượng: khoảng 1 phút.

## Slide 7 - Điều khiển giám sát từ web

**Nội dung trên slide**

| Chế độ | Đo góc | LED | Âm thanh |
| --- | --- | --- | --- |
| Giám sát | Lấy mẫu mới | Sáng | Theo góc hoặc lỗi cảm biến |
| Tạm dừng | Dừng lấy mẫu, ẩn góc | Tắt | Tắt |

Khi tạm dừng, thiết bị vẫn gửi bản tin định kỳ.

Web cập nhật chế độ sau khi nhận phản hồi từ ESP32.

**Hình ảnh**

Ảnh web sau khi resume ở 10°. Phóng đủ lớn phần điều khiển và số đo. Có thể dùng ảnh pause trong phụ lục hoặc khi demo trực tiếp.

**Lời trình bày**

Tạm dừng giám sát là lệnh của chương trình, khác với dừng toàn bộ Wokwi. Khi tạm dừng, ESP32 ngừng đo và tắt âm thanh nhưng vẫn kết nối để nhận lệnh tiếp theo. Khi bắt đầu lại, chương trình lấy mẫu mới và khởi tạo lại bộ lọc. Backend chờ trạng thái phản hồi đúng thiết bị, lần khởi động và mã yêu cầu trước khi báo thành công.

Thời lượng: khoảng 1 phút.

## Slide 8 - Âm thanh cảnh báo và lỗi cảm biến

**Nội dung trên slide**

| Trạng thái | Âm thanh trong Wokwi |
| --- | --- |
| Vượt ngưỡng | 1200 Hz trong 150 ms, 1800 Hz trong 150 ms, nghỉ 100 ms |
| Lỗi cảm biến | Bíp 2000 Hz trong 170 ms mỗi giây |
| Tạm dừng | Tắt mọi âm thanh |

Còi thụ động trong Wokwi dùng PWM. Còi thật sẽ được chọn theo thông số linh kiện.

**Lời trình bày**

Hai kiểu âm thanh phân biệt cảnh báo nghiêng với lỗi cảm biến. Khi cảm biến lỗi, chương trình gửi góc rỗng và alarmOn=false, nhưng vẫn có bíp lỗi riêng. Bộ điều khiển âm thanh dùng mốc thời gian millis(), không chờ hết chu kỳ mới xử lý thao tác tạm dừng.

Thời lượng: khoảng 50 giây.

## Slide 9 - Thiết kế hộp và dự toán

**Nội dung trên slide**

- Hộp gắn trên mặt đỡ, cảm biến cố định cùng hộp.
- Mua hộp có sẵn và điều chỉnh CAD theo kích thước thực tế.
- Tận dụng khay hoặc cuốn tập có sẵn để thử trên bàn.

Dự toán gồm vận chuyển: 447.250 đến 475.250 đồng.

Giá tham khảo khảo sát ngày 09/11 và 12/11/2026.

**Hình ảnh**

Ảnh CAD bố trí bên trong. Ghi “Thiết kế dự kiến” cạnh hình. Không đặt số kích thước CAD như kích thước hộp đã mua.

**Lời trình bày**

CAD hiện phục vụ dự kiến vị trí linh kiện, LED, lỗ thoát âm và đường đi dây. Hộp khảo sát trên Shopee có kích thước khác mô hình, nên em sẽ đo lại sau khi chọn hộp. Dự toán gồm cả gói LED và điện trở dù mạch chỉ dùng một con mỗi loại. Khay tận dụng vật có sẵn, băng keo hai mặt đã được tính trong dự toán lắp thử.

Thời lượng: khoảng 1 phút.

## Slide 10 - Kết quả mô phỏng góc nghiêng

**Nội dung trên slide**

| Mốc đầu vào | Trạng thái cảnh báo |
| --- | --- |
| 0° | Tắt |
| 10° | Tắt |
| 16° | Bật |
| 14° sau 16° | Giữ bật |
| 11° | Tắt |

Các mẫu ±X, ±Y và một hướng chéo cho góc gần 16° và phát cảnh báo.

CAL dùng I²C ở tư thế ngang. Các mốc nghiêng dùng mẫu gia tốc cấp qua ACCEL.

**Hình ảnh**

Ảnh web 14° vẫn cảnh báo. Đặt bảng ngắn bên trái, ảnh bên phải. Giữ đủ phần terminal để nhận biết nguồn SERIAL_ACCEL khi cần đối chiếu.

**Lời trình bày**

Chuỗi góc cho kết quả phù hợp hai ngưỡng. Ở 16° và 14°, em nghe còi, xuống 11° thì còi tắt. Các mẫu theo trục Y, X âm và hướng chéo cũng kích hoạt cảnh báo. Những mốc nghiêng được cấp qua Serial để kiểm tra thuật toán và hoạt động của hệ thống. Sai lệch góc trên cảm biến thật sẽ được đánh giá sau khi lắp.

Thời lượng: khoảng 1 phút.

## Slide 11 - Phản ứng khi lỗi và mất kết nối

**Nội dung trên slide**

| Tình huống | Kết quả quan sát |
| --- | --- |
| FAULT ON | Web ẩn góc, báo lỗi cảm biến, có bíp lỗi |
| Tạm dừng khi có lỗi | LED và bíp tắt |
| Dừng nguồn dữ liệu | Web ẩn góc cũ và khóa điều khiển |
| Dừng broker khi đang cảnh báo | Còi tại thiết bị tiếp tục kêu |
| Bật lại broker | MQTT kết nối lại, web nhận dữ liệu mới |

**Hình ảnh**

Ảnh dừng broker khi góc 16°. Ảnh bổ sung lúc kết nối lại để ở phụ lục nếu cần.

**Lời trình bày**

Khi ngừng nhận bản tin hợp lệ quá 5 giây, web không tiếp tục hiện góc cũ như dữ liệu mới. Phần cảnh báo tại ESP32 hoạt động riêng với task mạng, nên khi broker dừng, còi vẫn theo góc hiện có. Sau khi broker chạy lại, thiết bị tự kết nối và web cập nhật dữ liệu. Phép thử hiện tại chưa đo độ trễ đầu cuối.

Thời lượng: khoảng 1 phút.

## Slide 12 - Kế hoạch thực hiện

**Nội dung trên slide**

Đã thực hiện

- Firmware, backend và web.
- Mô phỏng các trạng thái chính trên Wokwi.
- Thiết kế CAD dự kiến và khảo sát linh kiện.

Sau buổi thuyết trình

- Chọn linh kiện, mua hộp và lắp mạch.
- CAL, đối chiếu góc bằng thước và kiểm tra còi, LED.
- Thử kết nối trên ESP32 thật, hoàn thiện gá lắp và báo cáo kết quả.

**Lời trình bày**

Sau proposal, em chuyển sang lắp và thử phần cứng thật. Em sẽ kiểm tra từng phần trước, sau đó thử khi đã đóng hộp và cố định cảm biến. Phần cần đánh giá thêm gồm sai lệch góc, độ trễ và khả năng nghe còi. Hướng dài hạn là nghiên cứu khay tự điều chỉnh, sau khi đã xử lý được ảnh hưởng của chuyển động và tính toán cơ cấu.

Thời lượng: khoảng 45 giây.

## Phụ lục A - CAL và điều kiện dữ liệu

**Nội dung trên slide**

- Đặt hộp nằm ngang, đứng yên, bật giám sát và dùng nguồn I²C.
- CAL thu khoảng 30 mẫu trong 3 giây, cần ít nhất 25 mẫu hợp lệ.
- Chấp nhận vector hữu hạn có độ lớn từ 0,65 đến 1,35 g.
- Chuẩn hóa vector trung bình và lưu làm mốc.

Mẫu có độ lớn gần 1 g vẫn có thể chứa gia tốc chuyển động.

**Gợi ý trả lời câu hỏi**

Vì sao dùng ba trục: góc giữa hai vector sử dụng đầy đủ X, Y, Z nên nhận biết được nghiêng theo các hướng khác nhau.

Vì sao dùng atan2f: hàm nhận độ lớn tích có hướng và tích vô hướng để tính góc giữa hai vector. Mã dùng hàm toán học từ math.h, trả về radian rồi đổi sang độ.

CAL lưu qua khởi động lại: chương trình có cơ chế lưu Preferences. Lượt khởi động lại Wokwi được ghi trong báo cáo xuất hiện ref-v1 NOT_FOUND và dùng mốc +Z, nên phần giữ mốc qua khởi động lại còn cần kiểm tra.

## Phụ lục B - MQTT và phản hồi điều khiển

**Nội dung trên slide**

Telemetry: tilt-tray/telemetry, khoảng 500 ms một lần.

Lệnh: tilt-tray/command/<deviceId>.

Payload: SET_MONITORING <bootId> <requestId> <0|1>.

Backend đối chiếu phiên, mã yêu cầu, chế độ đo và LED trong telemetry trả về.

Thời gian chờ backend: khoảng 4 giây.

**Gợi ý trả lời câu hỏi**

HTTP thành công phụ thuộc phản hồi trạng thái từ ESP32 sau khi áp dụng lệnh. Việc publish MQTT đơn thuần chưa đủ để kết luận thiết bị đã đổi chế độ.

Kiểm thử tích hợp đã dùng Mosquitto/API thật và thiết bị ESP32 giả lập. Kết quả gồm HTTP 504 khi thiếu phản hồi và không phát lại lệnh cũ sau khi khôi phục kết nối. Hai hành vi này chưa được thử riêng đầy đủ trên firmware Wokwi.

## Phụ lục C - Hướng phát triển khay tự điều chỉnh

**Nội dung trên slide**

- Kết hợp accelerometer và gyro để ước lượng tư thế khi chuyển động.
- Xác định tải, trọng tâm, mô-men và hành trình trước khi chọn cơ cấu.
- Thử điều khiển một trục trên bàn rồi mở rộng khi có số liệu đánh giá.

**Lời trình bày**

Phần hiện tại cung cấp khả năng đo và cảnh báo nghiêng tĩnh. Việc tự cân bằng cần thêm ước lượng tư thế, cơ cấu truyền động và điều khiển phản hồi. Giữ khay ngang cũng chưa giải quyết hết ảnh hưởng quán tính khi xe phanh hoặc rẽ.

## Danh mục hình để dựng Canva

Các đường dẫn dưới đây tính từ thư mục gốc dự án.

| Slide | Hình hoặc tài liệu nguồn |
| --- | --- |
| 1 | images/01_cad_tong_the.png |
| 3 | report_images/08_so_do_dau_noi.png |
| 4 | Tham khảo cấu trúc từ images/07_so_do_he_thong.png |
| 5 | Tham khảo phần vector từ report_images/11_nguyen_ly_goc_xyz.png |
| 7 | images/wokwi_2026-11-12/KT04_03_web_resumed_10deg.png |
| 9 | images/03_cad_ben_trong.png |
| 10 | images/wokwi_2026-11-12/KT02_04_accel_14deg_web.png |
| 11 | images/wokwi_2026-11-12/KT08_01_broker_stopped_local_alarm.png |
| Phụ lục về kết nối | images/wokwi_2026-11-12/KT08_02_broker_reconnected_web.png |

## Tài liệu chuyên môn

- TDK InvenSense, MPU-6000/MPU-6050 Register Map and Descriptions.
- Wokwi, MPU6050 6-Axis Accel & Gyro Sensor.
- Wokwi, Piezoelectric buzzer.
- OASIS, MQTT Version 3.1.1.

Công thức và hành vi chương trình được đối chiếu với firmware hiện tại. Giá dự toán và tình trạng thử nghiệm theo báo cáo xuất ngày 13/11/2026. Khi dựng bài trình chiếu, giữ các nguồn chuyên môn liên quan trong phần ghi chú hoặc trang tài liệu tham khảo.
