# Hướng dẫn hoàn thiện report đồ án hộp cảnh báo độ nghiêng

Tài liệu bàn giao cho ChatGPT/Codex bên web, đối chiếu ngày 11/11/2026 với report `24127030.docx`, mã nguồn và bộ hình của chính đồ án. Người dùng đã xác nhận **`24127030.docx` là report hiện tại**, được viết trước đó dựa trên `Context.md` và `ToDo.md`.

Nhiệm vụ là tiếp tục hoàn thiện bản này: giữ phần đã đúng, sửa điểm không còn phù hợp, chèn hình có căn cứ và làm rõ mức độ kiểm chứng. Không viết lại toàn bộ từ đầu chỉ vì thấy các tài liệu bàn giao cũ nói report còn thiếu luồng hoạt động.

## 1. Chỉ dẫn có thể gửi trực tiếp cho ChatGPT bên web

> Hãy đọc `24127030.docx` và file hướng dẫn này trước khi chỉnh báo cáo. Đây là report hiện tại của đồ án cá nhân Lưu Chí Hải, MSSV 24127030, lớp 24C11, học phần Vật lý cho Công nghệ thông tin. Report được viết từ Context.md và ToDo.md nên nhiều phần kỹ thuật đã đúng; hãy cập nhật có chọn lọc, giữ cách trình bày và các mã F01–F10, W01–W10, CV01–CV10, KT01–KT10 nhất quán.
>
> Đối chiếu phần mô tả hành vi với mã nguồn được đính kèm; dùng `images/` làm nguồn gốc và `report_images/` làm bộ hình có chú thích. Không suy ra rằng một phép thử đã đạt chỉ vì mã có chức năng đó, test tự động tồn tại, hay hình nguyên lý mô tả kết quả mong đợi. Không biến kế hoạch sản phẩm thật thành kết quả đã lắp và nghiệm thu.
>
> Ưu tiên hoàn thiện phần vỏ hộp mua sẵn, hộp gắn trên khay và nghiêng cùng khay, chương CAD/Drawing, ảnh giao diện và cách diễn giải minh chứng. Người dùng chưa chọn được mẫu hộp thật; kích thước CAD là dự kiến. Phần hiện tại đo/cảnh báo nghiêng tĩnh, có hai chiều trao đổi và điều khiển chế độ đo kèm LED. Tự điều chỉnh khay trên xe đang chạy là hướng phát triển tương lai.
>
> Hãy lập bảng giữ/sửa/bổ sung ngắn theo đúng các mục của report, rồi thực hiện phần đã đủ thông tin. Chỉ hỏi gộp các dữ kiện cần xác nhận; không dừng việc chèn hình và sửa nội dung đã có căn cứ để chờ những số đo thực nghiệm chưa tồn tại. Đánh dấu `[CẦN XÁC NHẬN]` hoặc `[CHƯA CÓ MINH CHỨNG]` đúng chỗ trong bản làm việc, không tự điền.
>
> Xuất một bản Word cập nhật riêng, dự kiến tên `24127030_cap_nhat.docx`, giữ bản gốc. Nếu xuất được, cung cấp thêm PDF và bảng thay đổi/nghiệm thu còn thiếu. Nếu môi trường không chỉnh được DOCX, cung cấp nội dung hoàn chỉnh theo từng mục cùng bảng vị trí chèn hình; không nói đã sửa file Word khi mới soạn văn bản trả lời.

## 2. Cách ưu tiên nguồn và phạm vi bàn giao

| Nguồn | Cách sử dụng |
|---|---|
| Chỉ dẫn và quyết định mới nhất của người dùng | Quyết định phạm vi, cách mua/lắp, bản report hiện tại và những điều đã chốt. |
| `24127030.docx` | Bản cần hoàn thiện; dùng cấu trúc và cách diễn đạt đang có làm nền. |
| Mã nguồn được gửi cùng | Căn cứ mô tả chính xác thuật toán, chân, giao thức, API và giao diện. Nếu khác mô tả trong report, nêu rõ chỗ khác để sửa. |
| `images/`, `report_images/`, manifest và danh mục hình | Căn cứ về hình ảnh và nguồn minh chứng, trong đúng giới hạn ghi ở từng hình. |
| `README.md`, `Context.md`, `ToDo.md` | Bối cảnh và kết quả bàn giao theo thời điểm. Các câu cũ như “chưa tìm thấy report hiện tại” không còn áp dụng sau xác nhận về `24127030.docx`. |
| PDF quy định và thông báo giảng viên do người dùng cung cấp | Căn cứ cho yêu cầu chính thức. Không lấy đề xuất của trợ lý làm quy định chấm điểm. |
| `VLCNTT (nhóm khác).pdf`, nếu được gửi | Chỉ tham khảo đề mục; không chép nội dung, linh kiện, chức năng hoặc kết quả của nhóm khác. |

Không dùng bản Markdown đề cương cũ ở thư mục khác để thay thế `24127030.docx`. Không suy thông tin tác giả từ tên tài khoản/khung tên Fusion: thông tin trên bìa report hiện tại là **Lưu Chí Hải – 24127030**.

Trên ChatGPT web, đường dẫn trong tài liệu chỉ là chỉ dẫn tên file. Muốn đọc được, các file phải được người dùng tải lên hoặc cung cấp qua kết nối có quyền truy cập. Không nói đã mở mã nguồn hoặc ảnh trên máy Windows chỉ vì thấy đường dẫn được nhắc tới.

## 3. Report hiện tại đã có gì và cần cập nhật ở đâu

Đã đọc nội dung Word, các bảng, công thức toán và 5 ảnh nhúng: một logo trên bìa cùng bốn sơ đồ ở chương 4. Những nhận xét dưới đây là đối chiếu nội dung/cấu trúc; chưa phải kiểm định bố cục từng trang Word sau khi xuất bản mới.

| Vị trí trong report hiện tại | Giữ và hoàn thiện |
|---|---|
| Bìa và mục lục | Đang ghi “BÁO CÁO ĐỀ CƯƠNG ĐỒ ÁN CUỐI KỲ”. Giữ loại bản nộp này nếu chưa có chỉ dẫn đổi sang báo cáo tổng kết. Rà khoảng trắng/xuống dòng của tên đề tài; cập nhật mục lục tự động sau khi chèn hình. Mã nhóm đang để trống, cần xác nhận. |
| 1. Giới thiệu đề tài | Đã có tình huống xe chở hàng, mục tiêu hiện tại và giới hạn đo tĩnh. Bổ sung rõ cả hộp sẽ gắn trên khay và nghiêng cùng khay; nghiêng bằng tay là cách thử nguyên mẫu trên bàn. Không mô tả xe đang chạy đã được xử lý chính xác. |
| 2. Bảng tóm tắt chức năng | Đã có F01–F10 và W01–W10, gồm bật/tạm dừng và LED. Giữ mã hiện có; sửa mô tả nếu cần, không tạo bộ mã mới song song. |
| 3. Cơ sở vật lý và cách tính góc | Đã dùng vector CAL và XYZ, không còn thuật toán một trục cũ. Giữ công thức Word dạng Equation, bổ sung diễn giải hệ trục gắn cảm biến, vai trò Y và ví dụ tư thế tĩnh nếu cần. |
| 4. Kiến trúc và luồng hoạt động | **Đã có** sơ đồ khối, đấu nối, lưu đồ firmware, các bước của hai luồng, sơ đồ tuần tự, topic/API và bảng trạng thái. Không đánh dấu chúng là “chưa có”. Chỉ sửa sai biệt với mã hoặc thay hình khi hình mới rõ hơn. |
| 4.4 và 4.5 | Các tiêu đề con “Luồng từ cảm biến lên web”, “Luồng điều khiển…”, “Kiểm tra trước và sau…” đang cùng cấp Heading 2 với mục cha. Đề xuất dùng Heading 3 hoặc nhãn đoạn phù hợp để mục lục không bị lệch cấp. |
| 5. Mô tả chi tiết chức năng | Đã có mục đích, đầu vào, xử lý, đầu ra/lỗi và mã kiểm thử. Giữ cấu trúc; làm rõ còi lỗi khác `alarmOn`, LED là chế độ, xác nhận là metadata telemetry. |
| 6. Mô phỏng hệ thống | Đã có môi trường, thứ tự chạy, I²C/ACCEL/FAULT, bảng chuỗi góc và Bảng 9 kết quả ghi nhận. Bổ sung ảnh web có nguồn; đối chiếu riêng các khẳng định “đã đạt” trong Bảng 9. |
| 7.1. Vỏ hộp và vật tư cần chốt | **Phải sửa** câu “Vỏ sẽ được làm riêng theo bản Fusion 360”: người dùng định **mua hộp có sẵn**, chưa chọn mẫu, không có máy in 3D. CAD mô tả bố trí dự kiến và sẽ chỉnh theo hộp mua được. |
| 7. Bảng thiết bị và chi phí | Đã có LED và 330 Ω nhưng đang chờ giá; chưa có giá hộp/khay/vật tư gá. Giữ giá lịch sử như dữ liệu dự toán, không nói đã mua đúng biến thể ESP32 Type-C hay đã xác nhận giá mới. |
| 8. Bản vẽ phác thảo sản phẩm | Hai vị trí ảnh CAD còn là placeholder. Thay bằng ảnh thật từ bộ hình; bổ sung khay–hộp, thông số CAD, LED/điện trở, Drawing và giới hạn thiết kế. Có thể đổi tên mục thành “Thiết kế cơ khí và bố trí sản phẩm”, giữ số chương 8. |
| 8.1 | **Phải sửa** cách gọi “khe USB”: lỗ bên hông được người dùng xác nhận là **lỗ đưa dây ra ngoài hộp khi cần**. Dây USB minh họa trong CAD không biến nó thành cổng USB đã chọn kích thước. |
| 8.2 | Có thể yêu cầu hình chỉ rõ trục cảm biến nhưng ảnh CAD hiện tại chưa xác nhận hướng trục trên module thật. Không tự gắn Ox/Oy với hướng xe chạy; đánh dấu cần bổ sung sau khi chốt cách lắp. |
| 9. Phân công và kế hoạch | Đã thể hiện một người thực hiện. Giữ tên/mã CV; cập nhật trạng thái việc đã làm và việc còn chờ. Không đổi tất cả thành “hoàn thành” vì phần mềm/CAD đã có. Mốc 14/11 và lịch demo cần đối chiếu thông báo hiện hành. |
| 10. Kiểm thử và hướng phát triển | Đã có KT01–KT10 và cách đánh giá. Giữ các tiêu chí dự kiến, bổ sung bảng ghi nhận/bằng chứng riêng. Mở rộng hướng phát triển tự điều chỉnh khay theo mục 9 của hướng dẫn này. |
| Tài liệu tham khảo và bảng đối chiếu mã | Giữ liên kết có thật trong Word, rà trích dẫn và tên file; frontend thực tế là `frontend/src/main.jsx`, không phải `App.jsx`. Mã nguồn là căn cứ triển khai; Context/ToDo là hồ sơ nội bộ, không thay cho datasheet và chuẩn giao thức. |

### Những khẳng định cần rà kỹ trong Bảng 9

- Dòng “người thực hiện đã xác nhận chuỗi góc, hướng Y/chéo và mất dữ liệu đều đạt” cần log/ảnh/video hoặc xác nhận cụ thể. Không tự coi toàn bộ dòng này đã được kiểm chứng chỉ vì nó đã xuất hiện trong report.
- Có ghi nhận trước đó về 16 test backend, test C++, build frontend/firmware và thử điều khiển React tới Wokwi. Dẫn nguồn và ngày của lượt thử; không nói đã chạy lại trong lần sửa report nếu chưa chạy.
- Thử với peer ESP32 giả lập bằng chương trình, thử `npm run simulate`, thử Wokwi và thử ESP32 thật là bốn loại minh chứng khác nhau.
- Hai ảnh web 13–14 hỗ trợ mô tả pause/resume của lượt Wokwi đã ghi nhận. Chúng không chứng minh mọi góc, âm thanh, độ chính xác hay sản phẩm thật đều đạt.

## 4. Các dữ kiện kỹ thuật phải đúng với mã nguồn

### 4.1. Đo góc và hiệu chuẩn

Đối chiếu `firmware/static_tilt.h` và `firmware/tilt_tray.cpp`:

- MPU6050 được đọc qua I²C ở địa chỉ `0x68`; SDA GPIO21, SCL GPIO22. Các byte cao/thấp của mỗi trục được đọc tuần tự rõ ràng.
- Thang gia tốc ±2 g; chia số đọc signed 16 bit cho 16384 để đổi sang g. Kỳ lấy mẫu cấu hình 100 ms.
- `a = (ax, ay, az)` là vector gia tốc theo trục **gắn với cảm biến**, không phải vị trí hoặc vận tốc xe trong không gian.
- `r` là vector đơn vị của tư thế ngang lấy khi CAL. Công thức hiện tại:

```text
θ = atan2(‖r × a‖, r · a) × 180 / π
```

- Nếu `r = (0, 0, 1)`, công thức tương đương `atan2(sqrt(ax² + ay²), az) × 180/π`. Kết quả là góc tổng không dấu 0–180°, chưa xuất pitch/roll hoặc hướng xe chuyển động. Không quay lại mô tả `atan2(ax, az)` của phiên bản cũ.
- Công thức trong Word hiện là Equation có phân số 180/π. Khi trích xuất XML, tử và mẫu có thể nối thành “180π”; không vì vậy kết luận công thức gốc đang thiếu dấu chia.
- CAL thu 30 mẫu trong khoảng 3 giây, cần ít nhất 25 mẫu hợp lệ, chuẩn hóa vector trung bình rồi lưu Preferences khóa `ref-v1`. Đây là đặt mốc hướng ngang, không phải hiệu chuẩn bias/scale đầy đủ ba trục.
- CAL chỉ được nhận khi đang giám sát; trên Wokwi cần nguồn I²C, không bơm lỗi. Pause có thể hủy CAL. Mốc được giữ qua reboot; chế độ pause không được giữ qua reboot.
- Lọc góc `0,75 × góc đã lọc trước + 0,25 × góc mới`. Lần đầu, sau bật lại hoặc phục hồi mẫu hợp lệ, bộ lọc lấy mẫu mới làm điểm khởi tạo.
- Kiểm tra mẫu hữu hạn và `0,65 ≤ ‖a‖ ≤ 1,35 g` là heuristic của phần mềm, chưa xác lập từ thử thật. Không gọi đó là giới hạn ±2 g của cảm biến, tiêu chuẩn nhà sản xuất, hay bằng chứng xe đứng yên. Vượt khoảng này nghĩa là mẫu không phù hợp phép đo hiện tại, không đủ để kết luận module đã hỏng.

Khi diễn giải vật lý, có thể dùng mô hình đơn giản gia tốc kế đo gia tốc riêng theo hệ trục cảm biến. Ở trạng thái tĩnh, hướng vector đo liên hệ với phương trọng trường; dấu phụ thuộc quy ước trục. Gia tốc do chuyển động cũng ảnh hưởng kết quả, nên chỉ ba số ax/ay/az không cho phép tách duy nhất trọng lực và gia tốc xe.

### 4.2. Cảnh báo và còi

| Nội dung | Hành vi hiện tại |
|---|---|
| Bật cảnh báo | Góc **đã lọc ≥15°**. Không viết thành chỉ bật khi >15°. |
| Tắt cảnh báo | Góc đã lọc ≤12°. |
| Khoảng giữa | 12° < góc <15°: giữ trạng thái trước. |
| Passive buzzer | 1200 Hz/150 ms → 1800 Hz/150 ms → im 100 ms, lặp lại. |
| Dừng cảnh báo | Tắt âm ở lần cập nhật điều khiển khi trạng thái cảnh báo tắt; không chờ hết chu kỳ âm. Không đồng nghĩa dừng ngay lúc góc vật lý vừa vượt qua ngưỡng vì còn lấy mẫu/lọc. |
| Lỗi cảm biến khi đang giám sát | `sensorOk=false`, `angleDeg=null`, `alarmOn=false`; bíp lỗi riêng 2000 Hz/170 ms mỗi giây với buzzer passive. |
| Buzzer thật active | Có bộ dao động riêng; nhánh mã mặc định điều khiển bật/tắt, không bảo đảm Dual-Tone. Cần kiểm tra linh kiện và cấu hình build. |

Đối chiếu `firmware/buzzer_alert.h`, `config.h`, `platformio.ini` và hàm `setBuzzer`. Wokwi bật `BUZZER_PASSIVE=1`, chân còi GPIO25, PWM LEDC. Hardware mặc định không tự bật passive; đổi theo linh kiện.

**Không viết “firmware hoàn toàn không dùng delay()”.** Mã hiện có `delay(1)` cuối loop và nhường task mạng; chuỗi âm thanh được xếp lịch không chặn bằng `millis()`, không dùng delay 150/150/100 ms để phát còi. Cũng không khẳng định mọi tác vụ I²C/mạng có độ trễ bằng 0.

### 4.3. LED và điều khiển từ web

- GPIO26 → 330 Ω → anode LED, cathode → GND chung. LED sáng là giám sát đang bật; LED tắt là tạm dừng. Không biến LED này thành LED chỉ báo vượt ngưỡng hoặc một nút bật LED độc lập chưa có trong web.
- `modeLedOn` lấy theo mức GPIO firmware đọc lại, không phải cảm biến quang chứng minh LED vật lý đang phát sáng.
- Pause ngừng đọc mẫu, tắt còi/LED, góc null và cảnh báo nghiêng false; vẫn gửi heartbeat định kỳ để nhận lệnh bật lại. `sensorOk` lúc pause có thể là kết quả lần đọc trước; UI ghi “Chưa đo (tạm dừng)”.
- Resume đọc mẫu mới và khởi tạo lại lọc. Sau reboot, giám sát mặc định bật và mốc CAL được nạp lại nếu hợp lệ.
- ACK chỉ gửi sau khi loop áp dụng chế độ và GPIO. Backend đối chiếu thiết bị, bootId, lastCommandId và trạng thái yêu cầu. Web chờ phản hồi thay vì giả định vừa bấm nút là đã thực hiện.
- Các ID và chính sách MQTT giúp kiểm soát đúng phiên/lệnh gần nhất; không mô tả thành hệ thống xác thực bảo mật hoặc chống phát lại tuyệt đối.

### 4.4. Mạng và giao thức

| Thành phần | Giá trị/cơ chế |
|---|---|
| Firmware | ESP32 Arduino, PubSubClient, Preferences; chung nguồn cho build `wokwi` và `hardware`. |
| MQTT/Wi-Fi | Task FreeRTOS riêng, trao đổi queue với loop đo/điều khiển; queue telemetry giữ snapshot mới nhất. |
| Telemetry | Topic `tilt-tray/telemetry`, chu kỳ chuẩn bị định kỳ 500 ms; có thể có bản tin khi áp dụng lệnh. |
| Lệnh | Topic `tilt-tray/command/<deviceId>`, payload `SET_MONITORING <bootId> <requestId> <0|1>`. |
| ACK | Nằm trong telemetry; không có topic ACK riêng. |
| Chính sách lệnh | QoS 0, không retain, clean session; backend không giữ hàng đợi lệnh offline để phát lại. |
| Backend | Express/MQTT.js, giữ một bản tin mới nhất trong bộ nhớ; chưa có cơ sở dữ liệu hoặc biểu đồ lịch sử trong triển khai này. |
| API | `GET /api/status`, `GET /api/health`, `POST /api/monitoring`. Body POST chỉ có `{"enabled":true}` hoặc false. |
| Chờ lệnh | Backend khoảng 4 giây; frontend có timeout HTTP riêng 6,5 giây. Không đánh đồng hai timeout hoặc xem đó là độ trễ đã đo. |
| Web | React/Vite, poll trạng thái khoảng 1 giây; frontend thực tế nằm trong `frontend/src/main.jsx`. |
| Dữ liệu cũ | Backend dùng thời gian nhận **bản tin hợp lệ mới nhất**, stale sau >5000 ms; `reading=null`, web ẩn góc. |
| Mất broker | Cờ broker có thể đổi trước khi dữ liệu quá 5 giây; không nhất thiết chuyển stale ngay tại thời điểm broker ngắt. Lỗi gọi API ở frontend cũng làm web hiện mất dữ liệu. |
| Broker demo | Mosquitto cục bộ; Wokwi dùng `host.wokwi.internal:1883`, backend dùng `mqtt://127.0.0.1:1883`. |
| Phần cứng thật | Firmware dùng Wi-Fi thật và IP LAN của máy broker, cấu hình listener/mạng phù hợp; không dùng `127.0.0.1` trong ESP32 để chỉ máy Windows. |

Telemetry hiện có **11 trường**: `deviceId`, `bootId`, `seq`, `sensorOk`, `alarmOn`, `angleDeg`, `thresholdOn`, `thresholdOff`, `monitoringEnabled`, `modeLedOn`, `lastCommandId`. Góc rỗng là JSON `null`, không phải chuỗi `"null"`. `alarmOn` chỉ là cảnh báo nghiêng, không phải mọi âm thanh của còi.

Giữ đủ hai luồng:

1. MPU6050 → I²C → ESP32 tính góc/lọc/cảnh báo → MQTT/Mosquitto → Express → HTTP → React.
2. React → POST Express → MQTT command → ESP32 áp dụng chế độ/LED → telemetry xác nhận → Express trả HTTP → React cập nhật.

Khi mất mạng, thiết bị tiếp tục xử lý cảnh báo cục bộ theo chế độ đã áp dụng, nếu cảm biến/task cục bộ hoạt động. Pause từ web cần đường truyền và xác nhận; không khẳng định lệnh offline đã đến thiết bị.

### 4.5. Các nguồn demo khác nhau

| Cách thử | Được phép kết luận |
|---|---|
| Wokwi `I2C`, chỉnh Acceleration XYZ | Firmware đọc qua I²C từ MPU6050 mô phỏng, sau đó xử lý/gửi dữ liệu. |
| Wokwi `ACCEL x y z` | Bơm mẫu qua Serial, bỏ qua I²C; dùng chung phép tính, lọc, cảnh báo và MQTT. Mẫu được giữ cho các lần đọc tiếp theo đến khi đổi nguồn/giá trị/reboot, không tự hết hạn sau vài giây. |
| Wokwi `FAULT ON/OFF` | Bơm/bỏ lỗi phần mềm trong mô phỏng; không chứng minh cơ chế hỏng của cảm biến thật. Không tự đổi nguồn I²C/ACCEL. |
| `npm run simulate` hoặc `demo-gia-lap.html` | Công cụ phụ kiểm tra một số tầng với dữ liệu mẫu; không thay thế nghiệm thu MPU6050/ESP32. |
| ESP32 và module thật | Chỉ ghi đã đạt khi có nạp/chạy/quan sát/số đo thực tế tương ứng. |

Lệnh I2C/CAL/ACCEL/FAULT nhập trong Wokwi Terminal, không nhập như lệnh PowerShell. Rotation trong Wokwi là dữ liệu vận tốc góc gyroscope; firmware hiện tại chưa đọc gyro. Chỉ một nguồn telemetry chạy trong mỗi lượt demo.

## 5. Chèn và lựa chọn hình cho report

Hai thư mục đang có 15 PNG cùng tên. `images/` giữ bản gốc, `report_images/` là bản có tiêu đề/nhãn/mũi tên/giải thích bằng script. Không ghi đè ảnh gốc. Xem thêm `report_images/README.md`, `manifest.json`, `index.html`.

| File trong `report_images/` | Vị trí phù hợp và cách dùng |
|---|---|
| `01_cad_tong_the.png` | Chương 8: toàn cảnh hộp trên khay. Bắt buộc nói khay 400 × 300 mm mới là tham chiếu minh họa chưa được người dùng xác nhận kích thước. |
| `02_cad_ben_ngoai.png` | Thay placeholder tại 8.1/Hình 5: nắp, thân, thoát âm, lỗ đưa dây, LED. |
| `03_cad_ben_trong.png` | Thay placeholder tại 8.2/Hình 6: bố trí ESP32, breadboard, MPU6050, buzzer, LED/điện trở và dây tượng trưng. |
| `04_cad_mat_tren.png` | Bổ sung 8.2 nếu mặt bằng giúp nhìn rõ bố trí; tránh lặp lại diễn giải của hình 03. |
| `05_cad_led_dien_tro.png` | Mục LED/chương 8: chi tiết LED rời, gờ/chân minh họa và 330 Ω. Không coi kích thước chân/gờ là datasheet của LED đã mua. |
| `06_drawing_hop.png` | Chương 8 hoặc phụ lục: Drawing A3 và kích thước dự kiến. Ưu tiên PDF gốc `output/pdf/TiltTray_Drawing_Concept.pdf` khi cần đọc/in rõ. |
| `07_so_do_he_thong.png` | 4.1, có thể thay Hình 1 hiện tại nếu rõ hơn. Không chèn hai sơ đồ cùng ý liên tiếp. |
| `08_so_do_dau_noi.png` | 4.2, có thể thay Hình 2 và giữ Bảng 4. Đây là sơ đồ vẽ lại từ cấu hình, không phải ảnh Wokwi Simulator. |
| `09_luong_firmware.png` | 4.3. So với lưu đồ hiện có trước khi chọn; giữ hình có nhánh/vòng lặp dễ đọc, không thay hình cũ một cách máy móc. |
| `10_luong_lenh_web.png` | 4.5, có thể thay Hình 4 hiện tại, giải thích ACK và timeout trong đoạn dẫn. |
| `11_nguyen_ly_goc_xyz.png` | Chương 3, bổ trợ Equation và giải thích vector, không thay công thức bằng một ảnh khó chỉnh sửa. |
| `12_hysteresis_dual_tone.png` | 5.2–5.3 hoặc chương 6: nguyên lý và kết quả mong đợi, không phải kết quả đo. |
| `13_web_paused.png` | 6.3: ảnh web của lượt thử Wokwi ngày 10/11/2026, góc ẩn/chế độ pause. |
| `14_web_resumed.png` | 6.3, đi cùng hình 13: resume và góc mới gần 0°. Không chứng minh độ chính xác bằng một ảnh hiển thị 0,0°. |
| `15_bang_trang_thai.png` | Tham khảo để hoàn thiện Bảng 6 ở 4.6. Ưu tiên bảng Word chỉnh sửa được; không cần vừa chèn ảnh bảng vừa lặp lại bảng cùng nội dung. |

Nguyên tắc trình bày:

- Không bắt buộc chèn cả 15 hình: chọn hình làm rõ lập luận, giữ bộ còn lại làm tư liệu/phụ lục. Đây là đề xuất biên tập, không phải yêu cầu của giảng viên.
- Mỗi hình cần câu dẫn trước hình, caption phía dưới, nguồn/điều kiện và đoạn giải thích sau hình khi cần. Phải đọc được chữ khi đặt trên trang Word.
- Giữ Hình 1–4 nếu không thay; sau khi thêm CAD/web, đánh số và cập nhật tham chiếu trong toàn văn. Số đầu tên PNG là số sắp xếp file, không phải số hình cuối cùng trong báo cáo.
- Ảnh có chú thích đã có tiêu đề bên trong; caption Word chỉ cần ngắn, không chép nguyên toàn bộ chữ trong ảnh. Nếu cần bản gốc cho bố cục gọn hơn, dùng đúng file tương ứng từ `images/` và giữ thông tin giới hạn trong caption/đoạn văn.
- Drawing có tỷ lệ ghi cho bản A3; ảnh bị thu nhỏ khi chèn A4 không còn là bản in đúng tỷ lệ. Không đổi con số kích thước để làm vừa trang. Bản này là hình chiếu tham khảo độc lập, chưa đủ dung sai/vị trí lỗ để giao gia công; không tự tuyên bố đã đáp ứng đầy đủ quy ước bản vẽ chế tạo.
- Chưa có ảnh thực tế thì để mục cần bổ sung, không dùng ảnh CAD đổi caption thành “sản phẩm đã hoàn thành”. Không dùng AI để làm ảnh nghiệm thu giả.

## 6. Nội dung chương cơ khí cần thay và bổ sung

### 6.1. Đoạn nền có thể biên tập đưa vào 7.1 và 8

> Em dự định mua hộp có sẵn để lắp nguyên mẫu. Hiện em chưa chọn được mẫu hộp cụ thể nên mô hình Fusion 360 dùng kích thước dự kiến để minh họa cách bố trí linh kiện, vị trí LED, lỗ thoát âm và lỗ đưa dây. Sau khi mua hộp và linh kiện, em sẽ đo lại khoảng trống bên trong, đầu nối và cách gá rồi điều chỉnh thiết kế cho phù hợp.
>
> Cả hộp thiết bị sẽ được gắn cố định trên khay chở hàng và nghiêng cùng khay. MPU6050 cần được giữ chắc theo phần khay cần đo, tránh dịch chuyển tương đối trong lúc thử. Đặt mốc CAL khi khay nằm ngang. Trong phạm vi hiện tại, em thay đổi độ nghiêng bằng tay và giữ yên tại từng mốc để kiểm tra chức năng; hệ thống chưa có cơ cấu tự điều chỉnh khay.

### 6.2. Bảng thông số CAD để đưa vào report

| Hạng mục | Thông số của mô hình | Giới hạn phải ghi |
|---|---|---|
| Thân hộp | 240 × 155 × 30 mm; Shell vào trong 3 mm | Chưa phải thông số hộp đã mua. |
| Nắp | 250 × 165 × 3 mm | Chỉnh theo kết cấu nắp của hộp thật. |
| Lỗ thoát âm | Ø8 mm, trên nắp phía trên buzzer | Mục đích thoát âm, chưa kiểm chứng âm lượng/đặc tính bảo vệ. |
| Lỗ LED | Ø5,2 mm; đầu LED minh họa Ø5 mm nhô 2 mm | LED/đế giữ thực tế chưa mua/chốt. |
| Lỗ bên hông | 16 × 10 mm | Lỗ đưa dây, không khẳng định là cổng USB chuẩn đã lắp vừa. |
| Điện trở LED | 330 Ω | Giá trị mạch; kích thước thân trong CAD là minh họa. |
| Khay tham chiếu | 400 × 300 mm; đáy 3 mm; thành cao 20 mm từ mặt trong đáy, tổng cao ngoài 23 mm | Trợ lý dựng tham chiếu, **chưa được người dùng chốt kích thước khay**. |
| Dây, đệm, khối board | Bố trí đại diện cho các nhánh điện và chỗ gá | Không phải mô hình chân/đầu nối chính xác hoặc tuyến dây đã nghiệm thu. |

Phần CAD bổ sung dùng hình học minh họa/Base Features; không mô tả toàn bộ là thiết kế tham số hoàn chỉnh. Màu/Appearance trong Fusion phục vụ phân biệt chi tiết, không chứng minh vật liệu thật đã chọn. Không ghi “in 3D vỏ”, “hộp chống nước”, “đã tối ưu chịu rung/chịu tải” hoặc “mạch đã lắp kín” nếu chưa có căn cứ mới.

Chú thích dùng được cho các hình CAD:

> Mô hình CAD minh họa bố trí dự kiến. Kích thước, tuyến dây và cách gá sẽ điều chỉnh theo hộp, khay và linh kiện thực tế; chưa phải bản vẽ chế tạo hoặc ảnh sản phẩm đã lắp.

File Drawing PDF cục bộ đã có và có thể dùng cho report. Hồ sơ bàn giao còn ghi bước lưu cloud bản `TiltTray_Drawing_Report_Final` cần xác nhận do giới hạn editable/hộp thoại Save As; không cần dừng viết report để chờ bước này và không khẳng định cloud đã lưu xong khi chưa được xác nhận. Không dùng các bản Drawing thử bố trí làm bản nộp.

## 7. Cách viết phần kiểm thử có căn cứ

Giữ KT01–KT10 của Bảng 13, thêm cột hoặc một bảng liên kết gồm:

```text
Mã KT | Môi trường | Ngày / cấu hình | Nguồn dữ liệu | Thao tác
Kết quả mong đợi | Kết quả quan sát | File ảnh/log/video | Đã/chưa thử
```

Nếu chưa có quan sát, ghi “Chưa thử trên phần cứng thật” hoặc “Chờ bổ sung minh chứng”. Không tự điền 0,0°, sai số ±1°, độ trễ <1 giây, âm lượng hoặc số lần lặp để làm bảng đầy đủ.

| Nhóm minh chứng | Cách diễn đạt phù hợp với tài liệu hiện có |
|---|---|
| Mã nguồn/test tồn tại | “Đã triển khai/có test cho…”; kết quả đạt cần log hoặc hồ sơ lượt chạy. |
| Kết quả bàn giao 10/11 | “Theo ghi nhận kiểm thử ngày 10/11/2026…”; phân biệt test C++, backend, UI dùng API giả và Wokwi thực. |
| Hai ảnh web Wokwi | Dẫn hình 13–14 cho pause/resume. Mốc heartbeat 20 giây là ghi nhận của lượt thử được bàn giao, không suy ra chỉ từ hai ảnh tĩnh. |
| Chuỗi góc và hướng Y/chéo | Bảng giá trị hiện là đầu vào/kết quả mong đợi. Chỉ ghi “đạt” khi có ghi nhận tương ứng; có thể giữ lời xác nhận của người thực hiện nếu được xác nhận rõ nguồn. |
| Hardware build mẫu | Chứng minh khả năng biên dịch với cấu hình mẫu, không chứng minh nạp/chạy/âm thanh trên board mua thật. |
| Sản phẩm thật/sai số/độ trễ | Chờ phép đo và ảnh thực tế; chưa có thì không viết thành kết quả. |

Bộ minh chứng cần thu tiếp: mạch Wokwi và Serial `source=I2C`; chuỗi 0° → 10° → 16° → 14° → 11° trong cùng phiên; pause/resume; lỗi cảm biến; ngắt/khôi phục broker; ảnh mạch thật và hộp trên khay; dụng cụ góc tham chiếu; âm thanh/video nếu cần chứng minh còi.

Khi thử qua Acceleration để tạo một góc trong mặt XZ, dùng `ax=sin(θ)`, `ay=0`, `az=cos(θ)` theo g. Giữ đủ lâu để lọc và web cập nhật. Nếu dùng ACCEL thì ghi “bơm qua Serial”, không đổi tên thành phép đo I²C. Còi ở 14° còn kêu hay không phụ thuộc trạng thái trước đó; cần chạy đúng thứ tự để thể hiện hysteresis.

Chương 6 có thể ghi kết quả mô phỏng đã có và phần còn thiếu. Chương 10 vẫn là kế hoạch kiểm thử sản phẩm thật nếu chưa có dữ liệu. Nếu người dùng muốn chuyển thành báo cáo tổng kết cuối kỳ, bổ sung riêng “Kết quả và thảo luận”, “Hạn chế”, “Kết luận” dựa trên bằng chứng mới; không biến kế hoạch thành kết quả bằng cách đổi thì của câu.

## 8. Chi phí, thông tin học phần và tài liệu tham khảo

- Các giá Shopee trong Bảng 10 được ghi khảo sát ngày 09/11/2026. Tổng các mục có giá là **312.232 đồng**, cộng dự phòng vận chuyển **45.000 đồng** thành **357.232 đồng**. Đây chưa bao gồm đầy đủ các mục đang chờ giá; không viết là tổng chi phí sản phẩm hoàn chỉnh đã mua.
- Bổ sung dòng hộp mua sẵn, khay nếu mua riêng, LED, 330 Ω và vật tư gá/cách điện cần thiết; để chờ giá nếu chưa có. Không bịa shop, link, mã hàng, hóa đơn hay số tiền. Nếu cần cập nhật giá, phải khảo sát lại và ghi ngày/biến thể.
- ESP32 30 chân Type-C và cáp Type-C trong bảng đang là phương án khảo sát; không lấy hình khối CAD làm bằng chứng đã chọn đúng board/đầu nối. Còi passive/active cần chốt theo hàng nhận được.
- Giữ tên sinh viên và MSSV theo report; hỏi mã nhóm, tên đề tài chính thức, loại bản nộp, mốc đề cương/demo và thông báo định dạng nếu còn thiếu. Không tự chốt lịch chỉ từ kế hoạch cũ.
- Chỉ gắn nhãn `[YÊU CẦU CHÍNH THỨC]` khi có PDF/thông báo giảng viên hỗ trợ. Sơ đồ, Drawing, bảng kiểm thử và cấu trúc bổ sung trong hướng dẫn này là `[ĐỀ XUẤT BIÊN TẬP]`, không phải một thang điểm mới; không hứa điểm số.
- Giữ trích dẫn datasheet MPU6050, tài liệu Wokwi/PlatformIO và chuẩn MQTT từ nguồn gốc có thật. Kiểm tra URL/trích dẫn đánh số sau chỉnh sửa. Nếu không truy cập được nguồn, nêu rõ; không tự tạo trang, số trang hoặc trích dẫn đã đọc.
- Context/ToDo/README có thể được dẫn như hồ sơ kỹ thuật của chính đồ án, không dùng làm nguồn độc lập cho các thông số nhà sản xuất hoặc cho kết luận vật lý.

## 9. Hướng phát triển tự điều chỉnh khay khi xe chạy

Giữ mục đích dài hạn đã chốt: hỗ trợ xe chở hàng điều chỉnh tư thế khay trên đường. Trình bày lộ trình vừa sức, không bổ sung motor vào danh sách phần cứng hiện tại như thể đã lắp:

1. Kiểm chứng nguyên mẫu đo/cảnh báo tĩnh bằng board thật, mốc CAL, thước tham chiếu và các hướng nghiêng.
2. Nghiên cứu hợp nhất accelerometer/gyroscope để ước lượng tư thế và giảm nhầm lẫn giữa trọng lực với gia tốc chuyển động; đánh giá cả rung và tăng tốc kéo dài. Đọc thêm cảm biến không tự bảo đảm tách hoàn toàn gia tốc.
3. Xác định pitch/roll có dấu, hệ trục khay/xe và các chuyển động cần điều chỉnh. Chỉ ax/ay/az hiện tại chưa xác định được hướng di chuyển của xe.
4. Tính tải, trọng tâm, mô-men/lực nâng, hành trình, tốc độ và nguồn; chọn cơ cấu/động cơ/driver theo yêu cầu thật, không chọn tùy ý chỉ để đủ linh kiện.
5. Thử điều chỉnh một trục trên bàn với tải nhỏ và phản hồi góc; bổ sung giới hạn hành trình, dừng lỗi và trạng thái an toàn. Khi ổn định mới mở rộng hai trục.
6. Thử chuyển động có kiểm soát, so sánh bật/tắt điều chỉnh; đo sai số, dao động, độ trễ, ảnh hưởng tăng tốc/phanh/rẽ và khả năng giữ hàng.

Giữ khay ngang theo trọng lực không tự bù được quán tính lúc phanh/rẽ. Cảnh báo nghiêng tĩnh chỉ là bước đầu của hướng phát triển này; chưa chứng minh an toàn vận tải hoặc khả năng chống đổ hàng trên xe đang chạy. Phần hạn chế nên nêu phù hợp nguồn lực một người, không mô tả thành lý do đã hoàn tất các phần chưa làm.

## 10. Quy trình chỉnh Word và đầu ra cần bàn giao

1. Đọc report hiện tại trước; kiểm kê mục, bảng, hình, placeholder và liên kết. Đừng bắt người dùng giải thích lại những dữ kiện đã có trong file.
2. Lập bảng giữ/sửa/bổ sung theo mục 3; ưu tiên sửa 7.1, 8.1, hoàn thiện chương 8 và đối chiếu Bảng 9. Giữ phần XYZ/hai luồng/LED đã đúng.
3. Viết nội dung bằng tiếng Việt rõ ràng, mức sinh viên CNTT trình bày đồ án Vật lý, giữ xưng “em” và giọng văn hiện tại. Giải thích từng bước, liên hệ công thức với hành vi và hình; không chỉ nối các từ khóa kỹ thuật thành danh sách. Không dùng ngôn ngữ quảng cáo hoặc nhận xét “hiện đại, tối ưu, an toàn tuyệt đối” không có số liệu.
4. Chèn hình được chọn, caption/câu dẫn, công thức Equation và bảng Word chỉnh sửa được. Dùng bảng trạng thái và chức năng hiện có thay vì lặp nguyên nhiều ảnh cùng nội dung.
5. Rà đồng bộ F/W/CV/KT, số hình/bảng và viện dẫn. Dùng Heading 1/2/3 đúng cấp; cập nhật TOC và các field tham chiếu bằng Word. Không giữ số trang mục lục cũ sau khi nội dung đổi.
6. Đọc bản xuất cuối ở từng trang: bảng/hình có vừa trang, chữ có đọc được, tiếng Việt có lỗi font, công thức có đủ phân số, caption có bị tách khỏi hình và trang ngang có đúng hướng. Không nói “đã kiểm tra bố cục toàn bộ” nếu chỉ đọc nội dung XML.
7. Bàn giao bản cập nhật riêng, bảng những mục đã sửa và danh sách dữ kiện/minh chứng còn chờ. Giữ bản gốc, mã nguồn và `images/` không bị ghi đè.

Nếu cần nêu lệnh kiểm tra trong báo cáo, lấy từ README/package.json hiện có: `npm.cmd test` ở backend, `npm.cmd run build` ở frontend, `pio run -e wokwi` từ root. Chỉ ghi đã chạy và đạt khi thực sự chạy trong môi trường đó; việc viết hướng dẫn này không phải một lượt build/test/nghiệm thu mới.

### Checklist trước khi trả bản cập nhật

- [ ] Report gốc vẫn còn và bản cập nhật dùng đúng `24127030.docx` làm nền.
- [ ] Không còn câu vỏ bắt buộc làm riêng/in 3D; lỗ dây không bị gọi nhầm thành khe USB đã chọn.
- [ ] Có hộp gắn trên khay, cùng nghiêng; CAD/kích thước/material đều được trình bày đúng mức dự kiến.
- [ ] Giữ đúng XYZ/vector CAL, 15°/12°, Dual-Tone passive, lỗi cảm biến, pause/resume và LED.
- [ ] Không nói gyroscope, tự cân bằng, web chỉnh ngưỡng, cơ sở dữ liệu hoặc phần cứng thật đã hoạt động khi chưa có trong nguồn/minh chứng.
- [ ] Sơ đồ và diễn giải có cả hai chiều cùng metadata xác nhận sau áp dụng GPIO.
- [ ] Ảnh mô phỏng, ảnh CAD, sơ đồ nguyên lý và kết quả thật được phân biệt rõ.
- [ ] Bảng 9 không biến một ghi nhận tổng hợp thành kết luận đã thử tất cả; KT dự kiến tách khỏi quan sát thực tế.
- [ ] Giá lịch sử/tổng dự toán ghi đúng phần đã bao gồm và phần chưa có giá.
- [ ] Hình có nguồn/caption, số thứ tự nhất quán, bảng và chữ đủ đọc; mục lục/cross-reference đã cập nhật.
- [ ] Các chỗ cần người dùng xác nhận được liệt kê rõ, không tự điền dữ liệu còn thiếu.

## 11. Những file nên gửi kèm trên web

**Bộ tối thiểu:** `24127030.docx`, file hướng dẫn này, `Context.md`, `ToDo.md`, `README.md`, các PNG sẽ dùng từ `report_images/` và danh mục của thư mục đó. Gửi `images/` tương ứng nếu cần đối chiếu gốc. Có thể nén hai thư mục để giữ cặp tên file; ChatGPT phải kiểm tra khả năng giải nén/đọc ảnh thực tế.

**Mã nguồn ưu tiên để đối chiếu:**

- `firmware/tilt_tray.cpp`, `static_tilt.h`, `buzzer_alert.h`, `monitoring_control.h`, `config.h`.
- `diagram.json`, `platformio.ini`, `wokwi.toml`.
- `backend/index.mjs`, `state.mjs`, `app.mjs`, `control.mjs` và các test khi cần đối chiếu ca thử.
- `frontend/src/main.jsx`, `frontend/vite.config.js` cùng package.json nếu cần tái lập demo.
- Drawing PDF cục bộ; F3D chỉ cần khi tiếp tục kiểm tra/sửa CAD, không phải điều kiện để chèn các ảnh đã xuất.
- PDF quy định và thông báo giảng viên mới nhất nếu muốn chốt loại bản nộp/định dạng chính thức.

Không gửi `firmware/secrets.h`, Wi-Fi thật, mật khẩu, `.env`, `node_modules`, `.pio` hoặc cả thư mục công cụ `.tools`. Nếu thiếu nguồn quan trọng, ChatGPT cần báo đúng tên file chưa nhận và phần không thể xác nhận, đồng thời tiếp tục sửa những phần đã đủ dữ kiện.
