# Minh chứng Wokwi ngày 12/11/2026

Người thực hiện: Lưu Chí Hải, MSSV 24127030, nhóm 24. Ảnh chụp do người dùng gửi; lưu nguyên PNG, đã đối chiếu SHA-256 của bản sao với ảnh đính kèm. Hai ảnh trước CAL đã được xóa theo yêu cầu và không dùng làm minh chứng.

| File | Quan sát trong ảnh | SHA-256 |
| --- | --- | --- |
| `KT01_01_cal_i2c_ngang.png` | Wokwi đặt Acceleration (0,0,1) g; LED xanh sáng. Terminal có `I2C`, `FAULT OFF`, `CAL started` và `CAL done: gravityReference=(0.00000,0.00000,1.00000)`. Mẫu sau CAL có `source=I2C`, `monitoring=on`, `led=1`, `sensorOk=1`, `raw=0.00`, `angle=0.00`, `alarmOn=0`, `buzzer=silent`. | `3A43D48B87A733963EA182C02A465169A4DB15C29B6DB7DB503E465B96EB7A82` |
| `KT01_02_web_sau_cal.png` | Web hiển thị 0,0°, bình thường, cảnh báo tắt, cảm biến OK, LED báo sáng; backend có phản hồi và MQTT đã kết nối. Giờ bản tin trong ảnh: 19:38:19 ngày 12/11/2026. Log bên cạnh đọc qua I²C, góc 0,00°. | `4A62AE2481263323BBF9B642F24762CFAB54E75A5ED146B2419590651F633CD7` |

## KT02 mốc 10° qua Serial ACCEL

Người dùng chọn dùng lệnh ACCEL thay vì chỉnh thanh trượt MPU6050. Từ mốc này, mẫu được bơm qua Serial và bỏ qua I²C; không mô tả thành phép đọc cảm biến qua I²C.

| File | Quan sát trong ảnh | SHA-256 |
| --- | --- | --- |
| `KT02_02_accel_10deg_web.png` | Web hiện 10,0°, Bình thường, cảnh báo tắt, cảm biến OK, LED báo sáng. Backend có phản hồi, MQTT đã kết nối, nguồn `khay-01-WOKWI`; giờ bản tin 19:42:09 ngày 12/11/2026. Bên cạnh có lệnh và log SERIAL_ACCEL. | `21658A5A4272DF6434E0D3F62AF0B72E7A46FB9A72A5935F0F81A10B468C79AA` |

Theo yêu cầu của người dùng, đã xóa ảnh `KT02_01_accel_10deg_log.png` có mạch Wokwi; chỉ giữ ảnh terminal kèm web cho mốc ACCEL. ACCEL không thay đổi XYZ trên giao diện MPU6050 vì mẫu được bơm trực tiếp vào firmware. Các mốc ACCEL tiếp theo dùng ảnh terminal có lệnh, nguồn SERIAL_ACCEL, log sau ổn định và web; ảnh I²C/CAL giữ riêng.

Mốc 10° có trạng thái phần mềm đúng kết quả mong đợi; ảnh tĩnh cho biết `buzzer=silent`. Người dùng chưa xác nhận riêng việc nghe âm thanh ở 0° và 10°. Các mốc tiếp theo được ghi bên dưới.

## KT02 mốc 16° qua Serial ACCEL

Ảnh `KT02_03_accel_16deg_web.png` do người dùng gửi, được sao chép nguyên bản và kiểm tra hash trùng file đính kèm. Terminal có `ACCEL 0.27564 0 0.96126`, nguồn SERIAL_ACCEL (bỏ qua I²C), `raw=16.00`, `angle=15.66`, `sensorOk=1`, `alarmOn=1`, `buzzer=tilt`, `monitoring=on`, `led=1`. Web hiện 15,9°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 19:45:14 ngày 12/11/2026.

Ảnh hỗ trợ kết luận cảnh báo phần mềm đã bật khi góc lọc vượt ngưỡng 15°. Không ghi góc đã ổn định ở 16,00°: giá trị log và web trong ảnh còn đang tiến về mốc đầu vào và không phải cùng một thời điểm lấy mẫu. Người dùng sau đó đã xác nhận nghe còi ở 16° (xem mục xác nhận âm thanh).

## KT02 mốc 14° sau 16° qua Serial ACCEL

Ảnh `KT02_04_accel_14deg_web.png` được lưu nguyên bản, hash bản sao đã đối chiếu trùng ảnh người dùng gửi. Terminal thấy log mốc trước `raw=16.00`, `angle=15.98`, `alarmOn=1`, tiếp theo lệnh `ACCEL 0.24192 0 0.97030` (nhập hai lần cùng giá trị). Góc lọc giảm qua 14,47° và 14,03°, ổn định ở 14,00°; `source=SERIAL_ACCEL`, `monitoring=on`, `led=1`, `sensorOk=1`, `alarmOn=1`, `buzzer=tilt`. Web hiện 14,0°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 19:50:00 ngày 12/11/2026.

Đã có minh chứng phần mềm giữ cảnh báo ở 14° sau mốc 16°, phù hợp hysteresis 15°/12°. Người dùng sau đó đã xác nhận vẫn nghe còi ở 14°.

## KT02 mốc 11° sau 14° qua Serial ACCEL

Ảnh `KT02_05_accel_11deg_web.png` lưu nguyên bản và đã kiểm tra hash khớp ảnh gửi: `7565C0EDFD57347F37847DDB5ECB82D6EF11F243E720383F5C4AB333845D9CAF`.

Terminal có lệnh `ACCEL 0.19081 0 0.98163` và nguồn SERIAL_ACCEL (bỏ qua I²C). Khi góc lọc còn 13,25° cảnh báo vẫn bật; các mẫu sau có góc 11,13° và 11,01°, `alarmOn=0`, `buzzer=silent`, `monitoring=on`, `led=1`, `sensorOk=1`, `raw=11.00`. Web hiện 11,0°, Bình thường, cảnh báo tắt, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 20:27:39 ngày 12/11/2026. Ảnh hỗ trợ kết luận cảnh báo tắt sau khi góc lọc giảm xuống dưới ngưỡng tắt, không xác định chính xác thời điểm chuyển ngưỡng từ các dòng log thưa này.

## Xác nhận âm thanh từ người thực hiện

Sau khi gửi ảnh 11°, người dùng xác nhận trực tiếp trong cuộc trò chuyện: “ở 16° và 14° có nghe còi, rồi xuống 11° còi có tắt”. Ghi nhận này là quan sát nghe của người thực hiện trong Wokwi, bổ sung cho ảnh/log; không phải bản ghi âm hoặc phép đo hai tần số, âm lượng hay thời gian đáp ứng.

## Trở về mẫu ngang sau chuỗi KT02

Ảnh `KT01_03_accel_ve_ngang_web.png` lưu nguyên bản, đã đối chiếu hash trùng ảnh gửi. Terminal có `ACCEL 0 0 1`, nguồn SERIAL_ACCEL (bỏ qua I²C), góc lọc giảm qua 1,10°, 0,06° đến 0,00°; `raw=0.00`, `sensorOk=1`, `alarmOn=0`, `buzzer=silent`, `monitoring=on`, `led=1`. Web hiện 0,0°, Bình thường, cảnh báo tắt, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 20:45:24 ngày 12/11/2026.

Ảnh bổ sung việc thuật toán trở về 0° với mẫu ngang sau chuỗi nghiêng mà không CAL lại trong các thao tác được hướng dẫn. Đây là bơm mẫu Serial, không chứng minh cảm biến I²C đã được nghiêng rồi đưa về ngang hoặc độ lặp lại của cảm biến thật.

## KT03 mẫu +Y 16° qua Serial ACCEL

Ảnh `KT03_01_accel_plus_y_16deg_web.png` lưu nguyên bản, hash trùng ảnh gửi: `DB02C7FF5F3BC9C6F2F5C4CC44D9EB467054FC19E489BDDD3DDD35AD243BFF01`. Terminal có `ACCEL 0 0.27564 0.96126`, nguồn SERIAL_ACCEL (bỏ qua I²C). Góc lọc tăng từ 12,20° (alarmOn=0) qua 15,79° (alarmOn=1), ổn định ở 16,00°; `sensorOk=1`, `monitoring=on`, `led=1`, `buzzer=tilt`. Web hiện 16,0°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 20:48:21 ngày 12/11/2026.

Mẫu này minh chứng thuật toán sử dụng thành phần Y dù X bằng 0, chưa phải phép nghiêng vật lý hoặc phép đo I²C. Người dùng đã xác nhận nghe còi ở lượt +Y trong xác nhận bổ sung KT03 bên dưới. Các mẫu dấu âm và chéo đã bổ sung ở các mục tiếp theo; chưa đủ kết luận thử mọi hướng hoặc so với thước tham chiếu.

## KT03 mẫu −Y 16° qua Serial ACCEL

Ảnh `KT03_02_accel_minus_y_16deg_web.png` được lưu nguyên bản, hash đã đối chiếu trùng ảnh gửi. Terminal có lệnh `ACCEL 0 -0.27564 0.96126`, nguồn SERIAL_ACCEL (bỏ qua I²C), ay âm; góc thô và góc lọc đều 16,00°, `sensorOk=1`, `monitoring=on`, `led=1`, `alarmOn=1`, `buzzer=tilt`. Web hiện 16,0°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 20:57:30 ngày 12/11/2026.

Phần log nhìn thấy chuyển trực tiếp từ +Y 16° sang −Y 16°, không có mẫu ngang xen giữa. Ảnh hỗ trợ kết luận góc tổng không đổi khi đổi dấu Y trong hai mẫu này và cảnh báo tiếp tục bật; không dùng làm minh chứng bật cảnh báo mới từ trạng thái tắt ở −Y. Người dùng đã xác nhận nghe còi ở các lượt ±Y trong xác nhận bổ sung KT03 bên dưới. Các mẫu −X và chéo đã bổ sung bên dưới; +X có trong KT02. Chưa có phép đo đối chiếu thước hoặc thử góc qua I²C.

## KT03 mẫu −X 16° qua Serial ACCEL

Ảnh `KT03_03_accel_minus_x_16deg_web.png` được lưu nguyên bản và kiểm tra hash khớp ảnh gửi. Terminal có các mẫu ngang `angle=0.00`, `alarmOn=0`, rồi lệnh `ACCEL -0.27564 0 0.96126`, nguồn SERIAL_ACCEL (bỏ qua I²C). Góc lọc tăng từ 13,15° (alarmOn=0) qua 15,84° (alarmOn=1), ổn định ở 16,00°; `sensorOk=1`, `monitoring=on`, `led=1`, `buzzer=tilt`. Web hiện 16,0°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK, nguồn `khay-01-WOKWI`; giờ bản tin 20:59:49 ngày 12/11/2026.

Ảnh hỗ trợ kết luận góc tổng của mẫu −X bằng 16° và cảnh báo chuyển từ tắt sang bật khi góc lọc vượt ngưỡng. Người dùng đã xác nhận nghe còi ở lượt −X trong xác nhận bổ sung KT03 bên dưới. KT03 đã có các mẫu ±X, ±Y (mẫu +X từ KT02) và hướng chéo ở mục tiếp theo; đây là thử thuật toán bằng Serial, chưa phải phép đo cảm biến qua I²C hoặc đối chiếu thước thật.

## KT03 mẫu chéo +X/+Y 16° qua Serial ACCEL

Ảnh `KT03_04_accel_cheo_xy_16deg_web.png` lưu nguyên bản, hash đã đối chiếu: `FA743AB39FC984B8EF6BFB9861B06C71C25A3F2EEB7DD344FF9C12695FF5CF11`. Terminal có mẫu ngang với góc 0,00°, cảnh báo tắt, rồi lệnh `ACCEL 0.194905 0.194905 0.961262`. Nguồn SERIAL_ACCEL (bỏ qua I²C); góc thô 16,00°, góc lọc tăng từ 12,20° (alarmOn=0) qua 15,79° (alarmOn=1), ổn định ở 16,00°. Mẫu có `sensorOk=1`, `monitoring=on`, `led=1`, `buzzer=tilt`. Web hiện 16,0°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK. Đồng hồ hệ điều hành trong ảnh là 21:01 ngày 12/11/2026; vùng giờ bản tin web không nằm trong ảnh.

Đã có mẫu chéo X/Y cho kết quả đúng góc đầu vào dự kiến và cảnh báo bật. Người dùng đã xác nhận nghe còi ở lượt chéo; chưa phải phép đo góc vật lý hoặc kiểm tra độ chính xác của cảm biến.

## KT04 web và firmware xác nhận tạm dừng

Ảnh `KT04_01_web_paused.png` do người dùng gửi thay ảnh cũ, lưu nguyên bản và kiểm tra hash trùng file gửi. Đã xóa `KT04_01_web_paused_log_cu.png` theo yêu cầu. Web hiện Đã tạm dừng, LED báo Tắt, góc ẩn và dòng “ESP32 đã xác nhận tạm dừng giám sát và tắt LED”; cảm biến hiện “Chưa đo (tạm dừng)”. Terminal có trạng thái cảnh báo trước pause, sau đó `CONTROL requestId=527133085 monitoring=paused led=0`, tiếp theo nhiều mẫu `monitoring=paused`, `led=0`, `raw=nan`, `angle=nan`, `alarmOn=0`, `buzzer=silent`. Trạng thái sensorOk=1 khi pause không phải phép đọc mới. Đồng hồ hệ điều hành trong ảnh là 21:14 ngày 12/11/2026.

Ảnh hỗ trợ đối chiếu xác nhận web với chế độ/GPIO và trạng thái âm thanh do firmware báo. Chưa đủ xác định thời gian heartbeat kéo dài hơn 5 giây từ ảnh tĩnh này; không có vùng kết nối/thời điểm bản tin, không thấy LED trong mạch. Người dùng đã xác nhận nghe còi tắt khi pause sau khi gửi ảnh resume. Log dùng nan cho góc, không có nghĩa telemetry gửi chuỗi nan: trạng thái góc rỗng trên web được thể hiện bằng dấu gạch. Ảnh resume với mẫu mới được bổ sung bên dưới; ghi nhận heartbeat đã bổ sung tại mục KT04 heartbeat bên dưới.

## KT04 đổi mẫu Serial khi đang tạm dừng

Ảnh `KT04_02_doi_accel_khi_paused.png` lưu nguyên bản và kiểm tra hash trùng file đính kèm. Terminal có `ACCEL 0.17365 0 0.98481` và nguồn SERIAL_ACCEL, sau đó nhiều mẫu vẫn `monitoring=paused`, `led=0`, `raw=nan`, `angle=nan`, `alarmOn=0`, `buzzer=silent`. Web vẫn Đã tạm dừng, góc ẩn, cảnh báo tắt, cảm biến Chưa đo (tạm dừng), LED báo tắt. Đồng hồ hệ điều hành trong ảnh là 21:18 ngày 12/11/2026.

Ảnh chứng minh thay đổi mẫu bơm Serial không làm web hiện góc khi đang pause. Không có trường thời điểm bản tin hoặc kết nối trong vùng chụp; các dòng SAMPLE chỉ là log cục bộ, chưa chứng minh heartbeat MQTT qua hơn 5 giây. Ảnh resume và xác nhận nghe còi tắt khi pause đã được bổ sung ở mục tiếp theo. Không xóa ảnh pause trước vì hai ảnh ghi các bước khác nhau.

## KT04 bắt đầu lại với mẫu mới 10°

Ảnh `KT04_03_web_resumed_10deg.png` lưu nguyên bản, đã đối chiếu hash trùng ảnh gửi. Terminal có các mẫu paused trước đó, tiếp theo `CONTROL requestId=3361883960 monitoring=on led=1` và các mẫu SERIAL_ACCEL `raw=10.00`, `angle=10.00`, `sensorOk=1`, `alarmOn=0`, `buzzer=silent`. Web thông báo ESP32 đã xác nhận bắt đầu giám sát và bật LED; hiển thị 10,0°, Bình thường, LED báo Sáng. LED trong mạch không nằm trong vùng chụp; không suy từ ảnh này rằng đã quan sát trực tiếp LED mô phỏng. Đồng hồ hệ điều hành là 21:35 ngày 12/11/2026.

Chuỗi ba ảnh KT04 hỗ trợ pause khi đang cảnh báo, đổi mẫu khi pause mà web vẫn ẩn góc, rồi resume đọc mẫu mới 10° thay cho góc 16° trước pause. Sau khi gửi ảnh resume, người dùng xác nhận: “lúc tạm dừng còi đã im”. Đây là quan sát nghe, bổ sung cho log buzzer=silent. Ghi nhận người dùng và hai ảnh heartbeat sau đó đã bổ sung ở mục tiếp theo.

## KT04 heartbeat khi tạm dừng

Hai ảnh bổ sung lưu nguyên bản, hash đã đối chiếu trùng ảnh gửi:

- `KT04_04_heartbeat_moc_1.png`: web có phản hồi backend, MQTT đã kết nối, nguồn khay-01-WOKWI, bản tin cuối 21:38:14 ngày 12/11/2026, độ cũ 0,2 giây. Terminal trong vùng chụp còn xen CONTROL monitoring=on và mẫu 10° của lần resume trước; không dùng riêng ảnh này chứng minh trạng thái paused tại mốc đầu.
- `KT04_05_heartbeat_paused_moc_2.png`: web có phản hồi backend, MQTT đã kết nối, cùng nguồn, bản tin cuối 21:38:45 ngày 12/11/2026, độ cũ 0,1 giây. Terminal có nhiều mẫu monitoring=paused, led=0, góc nan, alarmOn=0, buzzer=silent.

Sau khi gửi hai ảnh, người dùng xác nhận: “tạm dừng 10 giây nhưng bản tin cuối vẫn nhận nha”. Hai giờ bản tin trong ảnh cách nhau 31 giây, nhưng không suy ra thiết bị paused liên tục suốt 31 giây từ ảnh đầu có log lẫn trạng thái on. Kết luận có căn cứ: theo quan sát người thực hiện, pause ít nhất 10 giây vẫn nhận bản tin; ảnh thứ hai hỗ trợ trạng thái paused cùng bản tin mới và MQTT kết nối. Không biến các ảnh này thành đo chu kỳ telemetry hoặc độ trễ chính xác.

KT04 trong mô phỏng đã có chuỗi pause khi cảnh báo, xác nhận còi im, đổi mẫu khi pause, resume đọc 10° mới và ghi nhận heartbeat khi pause. Không phải nghiệm thu hộp thật.

## KT05 dừng Wokwi và dữ liệu cũ trên web

Ảnh `KT05_01_wokwi_stop_stale_web.png` lưu nguyên bản, đã kiểm tra hash trùng file đính kèm. Wokwi hiện nút Play, mô phỏng đã dừng. Web báo DỮ LIỆU CŨ / MẤT LIÊN LẠC, ẩn góc, cảnh báo Không rõ (mất dữ liệu), cảm biến Không rõ, nguồn dữ liệu dấu gạch. Backend Có phản hồi, MQTT broker Đã kết nối; bản tin cuối 21:41:14 ngày 12/11/2026, độ cũ 89,1 giây. Có dòng hướng dẫn cần dữ liệu mới từ ESP32 và kết nối MQTT để gửi lệnh. Các nút điều khiển nằm ngoài vùng chụp, chưa xác minh trực tiếp trạng thái disabled từ ảnh này.

Ảnh hỗ trợ trạng thái stale sau khi dừng nguồn telemetry trong khi backend/broker còn hoạt động. Không chứng minh thời điểm chuyển stale chính xác tại mốc 5 giây, không phải thử mất broker hoặc firmware tiếp tục cảnh báo khi mất mạng (mô phỏng đã dừng hoàn toàn). Dòng xác nhận bắt đầu giám sát phía trên là thông báo của thao tác trước, không ghi đè trạng thái mất dữ liệu hiện tại. Xác nhận khóa nút và ảnh phục hồi đã bổ sung ở mục tiếp theo.

## KT05 phục hồi sau khi khởi động lại Wokwi

Ảnh `KT05_02_wokwi_restart_recovered.png` lưu nguyên bản, đã kiểm tra hash trùng file gửi. Web phục hồi hiển thị 0,0°, Bình thường, cảnh báo tắt, cảm biến OK. Terminal có BOOT device=khay-01-WOKWI bootId=1898073985, SOURCE=I2C, monitoring=on, led=1; Wi-Fi và MQTT connected, các mẫu hợp lệ có raw/angle=0,00°, alarmOn=0, buzzer=silent. Người dùng xác nhận hai nút điều khiển đã bị khóa khi mất dữ liệu ở lượt KT05 trước đó. Đây là xác nhận thao tác của người dùng vì nút không nằm trong ảnh stale.

Log khởi động có `ref-v1 NOT_FOUND` và `CAL reference missing: using +Z; send CAL on a horizontal surface`. Lượt này chưa khôi phục được vector CAL lưu từ phiên trước, đang dùng mốc mặc định +Z. Không suy ra nguyên nhân NVS bị mất chỉ từ ảnh và không dùng ảnh này chứng minh lưu CAL qua reboot (KT09). Đọc I²C vẫn hợp lệ, nên phân biệt thiếu mốc CAL với lỗi đọc cảm biến. Cần CAL lại trên mặt ngang trước các lượt thử tiếp theo.

KT05 đã có ghi nhận mất dữ liệu sau dừng nguồn, ẩn góc, khóa điều khiển theo xác nhận người dùng, backend/broker vẫn chạy và web tự nhận số đo khi Wokwi kết nối lại. Chưa đo chính xác thời gian chuyển stale hoặc thời gian phục hồi.

## KT06 bơm lỗi cảm biến khi đang giám sát

Ảnh `KT06_01_fault_on_web.png` được lưu nguyên bản, hash bản sao đã đối chiếu trùng file gửi. Terminal có `CMD> fault on`, `FAULT=ON (Wokwi injected fault)`, các mẫu `source=I2C`, `monitoring=on`, `led=1`, `sensorOk=0`, `raw=nan`, `angle=nan`, `alarmOn=0`, `buzzer=fault-beep`. Web hiển thị LỖI CẢM BIẾN, góc ẩn, cảnh báo nghiêng Tắt, cảm biến Lỗi; LED xanh trên mạch đang sáng. Đồng hồ hệ điều hành trong ảnh là 21:47 ngày 12/11/2026.

Ảnh minh chứng nhánh lỗi bơm phần mềm, không phải hỏng MPU6050 hoặc mất dây I²C thật. `alarmOn=0` chỉ tắt cảnh báo nghiêng, không tắt bíp lỗi. Người dùng đã xác nhận nghe bíp lỗi trước pause khi gửi ảnh bước tiếp theo. Log CAL sau restart không nằm trong ảnh; không suy ra đã CAL lại chỉ vì đã hướng dẫn. Bước pause tắt bíp lỗi đã được ghi nhận bên dưới; resume khi lỗi vẫn còn đã bổ sung bên dưới; kết quả phục hồi đã bổ sung bên dưới.

## KT06 tạm dừng khi đang bơm lỗi

Ảnh `KT06_02_fault_paused_web.png` được lưu nguyên bản, đã kiểm tra hash trùng ảnh gửi. Terminal có các mẫu I²C lỗi trước pause với buzzer=fault-beep, tiếp theo `CONTROL requestId=3717638114 monitoring=paused led=0` và các mẫu paused có `sensorOk=0`, góc nan, `alarmOn=0`, `buzzer=silent`. sensorOk khi pause là trạng thái lần đo trước, không phải phép đọc mới. Web xác nhận tạm dừng và tắt LED, góc ẩn, trạng thái ĐÃ TẠM DỪNG GIÁM SÁT, cảm biến Chưa đo (tạm dừng). LED xanh trên mạch không phát sáng. Đồng hồ hệ điều hành trong ảnh là 21:48 ngày 12/11/2026.

Người dùng xác nhận trực tiếp: “trước pause có tiếng bíp lỗi và sau pause thì tiếng bíp tắt hoàn toàn”. Đây là quan sát nghe của người thực hiện, hỗ trợ việc pause tắt cả bíp lỗi; chưa phải đo âm thanh. FAULT chưa được tắt trong chuỗi hướng dẫn này. Resume khi lỗi vẫn còn đã bổ sung bên dưới; kết quả phục hồi đã bổ sung bên dưới.

## KT06 bật lại khi lỗi vẫn còn

Ảnh `KT06_03_fault_resumed_web.png` lưu nguyên bản, đã kiểm tra hash khớp file gửi. Terminal có mẫu paused trước đó, tiếp theo `CONTROL requestId=3691023558 monitoring=on led=1`; mẫu I²C sau resume có `sensorOk=0`, góc nan, `alarmOn=0`, `buzzer=fault-beep`. Web xác nhận bắt đầu giám sát, báo LỖI CẢM BIẾN, góc ẩn, cảnh báo nghiêng tắt, cảm biến Lỗi; LED xanh trong mạch sáng. Đồng hồ hệ điều hành là 21:50 ngày 12/11/2026.

Người dùng xác nhận “tiếng bíp lỗi có trở lại nha”. Ghi nhận hỗ trợ resume khi FAULT còn ON quay về báo lỗi và phát bíp, không giả thành trạng thái bình thường. Kết quả phục hồi dữ liệu hợp lệ và tắt bíp lỗi đã bổ sung bên dưới.

## KT06 phục hồi bằng FAULT OFF

Ảnh `KT06_05_fault_off_command_web.png` được lưu nguyên bản, hash bản sao đã kiểm tra trùng file gửi. Terminal thấy rõ mẫu lỗi trước đó, `CMD> FAULT OFF`, phản hồi `FAULT=OFF (Wokwi injected fault)` và các mẫu sau có `source=I2C`, `monitoring=on`, `led=1`, `sensorOk=1`, `raw=0.00`, `angle=0.00`, `alarmOn=0`, `buzzer=silent`. Web hiện 0,0°, Bình thường, cảm biến OK, cảnh báo tắt; LED xanh sáng. Đồng hồ hệ điều hành là 21:54 ngày 12/11/2026.

Theo yêu cầu người dùng, ảnh này thay thế ảnh KT06_04_fault_recovered_web.png không thấy lệnh; ảnh trước đã được xóa, chỉ giữ ảnh mới cho bước phục hồi. Người dùng đã xác nhận tiếng bíp tắt sau khi bỏ lỗi. Chuỗi KT06 có ảnh lỗi, pause, resume còn lỗi và FAULT OFF phục hồi; đây là lỗi bơm phần mềm, không phải thử hỏng module thật. Đây chưa phải ảnh KT08 mất broker.

## KT08 dừng broker, cảnh báo cục bộ vẫn hoạt động

Ảnh `KT08_01_broker_stopped_local_alarm.png` lưu nguyên bản, đã kiểm tra hash trùng file gửi. Services đang chọn Mosquitto Broker, cột Status trống; người dùng xác nhận đã dừng broker. Wokwi tiếp tục chạy, LED xanh sáng. Terminal có lỗi kết nối socket, `NET mqtt=retry state=-2` và mẫu sau đó vẫn `source=SERIAL_ACCEL`, `monitoring=on`, `led=1`, `sensorOk=1`, `raw=16.00`, `angle=16.00`, `alarmOn=1`, `buzzer=tilt`. Web báo DỮ LIỆU CŨ / MẤT LIÊN LẠC, góc ẩn, cảm biến/cảnh báo Không rõ, hai nút điều khiển bị khóa. Vùng kết nối/thời điểm bản tin không nằm trong ảnh. Đồng hồ hệ điều hành là 22:00 ngày 12/11/2026.

Người dùng xác nhận: “đã dừng mosquito broker, web đã mất dữ liệu nhưng còi cảnh báo vẫn kêu như thường”. Ghi nhận hỗ trợ cảnh báo cục bộ tiếp tục khi mất broker trong lượt thử dùng mẫu Serial; không suy ra phép đo độ trễ bằng 0 hoặc xác nhận I²C ở tư thế nghiêng. Còn kiểm tra tự kết nối lại và trạng thái khi khôi phục broker; chưa kiểm tra riêng không phát lại lệnh cũ trong lượt này.

## KT08 broker kết nối lại và web phục hồi

Ảnh `KT08_02_broker_reconnected_web.png` lưu nguyên bản, hash đã kiểm tra trùng file gửi. Terminal có mqtt=retry trước đó, sau đó `NET mqtt=connected state=0 attemptMs=159`; mẫu SERIAL_ACCEL trước/sau vẫn raw/angle=16,00°, monitoring=on, led=1, sensorOk=1, alarmOn=1, buzzer=tilt. Web phục hồi hiển thị 16,0°, VƯỢT NGƯỠNG, cảnh báo bật, cảm biến OK; LED xanh trong mạch sáng. Đồng hồ hệ điều hành trong ảnh là 22:03 ngày 12/11/2026.

Ảnh hỗ trợ firmware kết nối lại và web nhận dữ liệu sau khi bật lại broker theo hướng dẫn, không cần gửi lại ACCEL. Không có lệnh CONTROL mới trong vùng log được chụp; điều này chưa đủ chứng minh riêng chính sách không phát lại lệnh cũ vì chưa thiết kế chuỗi lệnh chờ để kiểm tra. Lượt KT08 Wokwi đã có mất broker, cảnh báo cục bộ tiếp tục (người dùng xác nhận nghe) và phục hồi dữ liệu; chưa đo thời gian phục hồi chính xác. Kiểm tra không phát lại lệnh cần minh chứng kiểm thử riêng.

## KT07 timeout bằng kiểm thử tích hợp với peer giả lập

Người dùng chạy `npm.cmd --prefix backend run test:integration` với MOSQUITTO_BIN trỏ tới Mosquitto cài tại Program Files và lưu output vào `KT07_integration_log.txt`. Đã đọc lại file log trong workspace: có dòng PASS cho real Mosquitto + API control, exact ACK, pause heartbeat >5s, resume, fault, timeout, broker stop/restart, no replay. Dòng tiếp theo nêu rõ ESP32 peer được giả lập, không phải firmware Wokwi hoặc LED thật.

Đối chiếu script hiện có `backend/check-control.mjs`: dùng broker/API riêng 19883/13000; khi respond=false, peer vẫn phát telemetry nhưng không xác nhận lệnh. Assertions kiểm tra POST điều khiển trả HTTP 504 và monitoringEnabled vẫn true, không báo chế độ đã đổi khi thiếu ACK. Script còn kiểm tra sau broker reconnect số lệnh peer nhận không tăng vì lệnh cũ; kết thúc kiểm tra lệnh mới pause/resume được xác nhận. Output PASS là log tổng hợp, không in riêng payload HTTP hoặc thời gian chờ đo được.

Kết luận KT07: bài kiểm thử tích hợp tự động với peer giả lập đạt trong lượt người dùng vừa chạy. Đây cũng là minh chứng kiểm thử tự động bổ sung chính sách không phát lại lệnh cũ của KT08, tách khỏi lượt Wokwi KT08 mất/phục hồi broker. Không ghi đã quan sát timeout hoặc không phát lại lệnh trên firmware Wokwi chỉ từ bài kiểm thử này. Không sửa source để thực hiện kiểm thử.

## Phạm vi kết luận

- Đã có minh chứng nhận lệnh CAL và hoàn tất đặt vector mốc ở tư thế ngang trong mô phỏng Wokwi; mẫu sau CAL và web hiển thị góc 0°.
- KT01 đã có CAL qua I²C ở tư thế ngang và việc thuật toán trở về 0° khi bơm mẫu ngang qua Serial sau chuỗi nghiêng. Chưa kiểm tra nghiêng/đưa về ngang bằng cảm biến I²C hoặc hộp thật; không đánh dấu toàn bộ KT01 trên hộp thật là đạt.
- KT02 đã có mốc 0° qua I²C sau CAL và các mốc 10°, 16°, 14°, 11° qua SERIAL_ACCEL: trạng thái phần mềm tắt → tắt → bật → giữ bật → tắt phù hợp mong đợi. Người dùng xác nhận nghe còi ở 16° và 14°, tắt khi xuống 11°. Đây là chuỗi đổi nguồn từ I²C sang bơm Serial, chưa phải toàn bộ chuỗi góc qua I²C. KT03 đã có các mẫu ±X, ±Y và một mẫu chéo +X/+Y ở 16° qua Serial. Góc tổng và trạng thái cảnh báo trong các ảnh phù hợp mong đợi; người dùng đã xác nhận nghe còi ở các lượt KT03. Chưa có đo đối chiếu thước hoặc thử hướng nghiêng qua I²C.
- `buzzer=silent` là trạng thái phần mềm, không phải phép đo âm thanh. Các giá trị maxGapMs/maxWorkUs không phải độ trễ đầu-cuối đã đo.
- Đây là mô phỏng, chưa chứng minh sai số hay hoạt động của phần cứng thật. Không sửa DOCX trong lượt lưu ảnh.

## Xác nhận bổ sung âm thanh KT03

Sau câu hỏi cụ thể về các lượt +Y, −Y, −X và chéo, người dùng trả lời: “có, tất cả trường hợp test nãy giờ đều nghe còi”. Ghi nhận này xác nhận nghe còi ở bốn lượt KT03 được hỏi, bổ sung cho ảnh/log `buzzer=tilt`. Không diễn giải thành nghe còi ở các mốc 0°, 10° hoặc 11°: đây không phải các mốc cảnh báo được hỏi. Trước đó người dùng đã xác nhận 16° và 14° kêu, xuống 11° tắt trong KT02.

Phần thử thuật toán KT03 bằng Serial đã có ảnh các mẫu ±X, ±Y và một mẫu chéo 16° cùng xác nhận nghe còi. Đây chưa phải hoàn thành tiêu chí KT03 trên hộp thật có thước tham chiếu. Không đo tần số, âm lượng hay thời gian đáp ứng từ lời xác nhận nghe.
