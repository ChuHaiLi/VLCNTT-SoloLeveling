# Kịch bản thuyết trình hộp cảnh báo độ nghiêng

Kịch bản theo đúng 16 slide của [24127030.pptx](24127030.pptx), đối chiếu với bản PDF của slide đã dùng khi soạn. Lời nói dùng ngôi “em”, phù hợp với đồ án cá nhân của Lưu Chí Hải, MSSV 24127030, nhóm 24.

## 1. Phân bố thời gian

Buổi vấn đáp khoảng 20 phút, chưa có yêu cầu riêng về thời lượng nói. Phương án luyện tập là trình bày khoảng 11 phút, dành khoảng 9 phút để thầy hỏi. Đây là cách chia thời gian đề xuất, không phải quy định của giảng viên.

Trình bày slide 1-12, sau đó chuyển slide 16 để kết thúc. Slide 13-15 dành để mở khi cần giải thích thêm. Nếu thầy hỏi ngay giữa bài, trả lời câu đó rồi tiếp tục phần đang trình bày, không cần đợi đến cuối.

| Slide | Nội dung | Thời lượng dự kiến | Mốc cộng dồn |
| --- | --- | --- | --- |
| 1 | Giới thiệu | 25 giây | 0:25 |
| 2 | Bài toán và phạm vi | 45 giây | 1:10 |
| 3 | Thiết bị và đấu nối | 50 giây | 2:00 |
| 4 | Hai luồng xử lý | 65 giây | 3:05 |
| 5 | Góc XYZ và CAL | 90 giây | 4:35 |
| 6 | Bộ lọc và hai ngưỡng | 60 giây | 5:35 |
| 7 | Điều khiển từ web | 60 giây | 6:35 |
| 8 | Âm thanh và lỗi | 45 giây | 7:20 |
| 9 | Thiết kế và dự toán | 40 giây | 8:00 |
| 10 | Kết quả thử góc | 60 giây | 9:00 |
| 11 | Lỗi và mất kết nối | 65 giây | 10:05 |
| 12 | Kế hoạch tiếp theo | 35 giây | 10:40 |
| 16 | Kết thúc | 10 giây | 10:50 |

Các mốc dùng để luyện nói, có thể chậm hơn khi chỉ vào hình hoặc giải thích công thức.

## 2. Lời trình bày chính

### Slide 1. Hộp cảnh báo độ nghiêng và giám sát qua web

> Em chào thầy. Em là Lưu Chí Hải, MSSV 24127030, nhóm 24. Đề tài của em là hộp cảnh báo độ nghiêng và giám sát qua web.
>
> Hộp dùng ESP32 và MPU6050 để đo nghiêng, phát còi tại chỗ và gửi trạng thái lên website. Trong buổi này, em trình bày nguyên lý, phần mềm và kết quả mô phỏng đã thực hiện. Hình bên phải là thiết kế cơ khí dự kiến, phần cứng thật sẽ được lắp sau buổi thuyết trình.

Chỉ vào hình hộp khi nói “thiết kế dự kiến”.

### Slide 2. Bài toán và phạm vi

> Bài toán em chọn xuất phát từ trường hợp khay chở hàng bị nghiêng khi xe đỗ trên nền dốc. Em muốn biết khay đang lệch so với mốc ngang bao nhiêu và phát cảnh báo khi góc vượt ngưỡng thử.
>
> Toàn bộ hộp điện tử sẽ được gắn cố định trên mặt đỡ. Khi khay nghiêng thì cảm biến trong hộp cũng nghiêng cùng khay. Phạm vi hiện tại là khi khay đứng yên hoặc thay đổi tư thế chậm.
>
> Khi xe tăng tốc, phanh hoặc rẽ, gia tốc chuyển động có thể ảnh hưởng đến kết quả. Vì vậy, em chưa sử dụng bản này để khẳng định góc nghiêng chính xác khi xe đang chạy. Phần xử lý chuyển động sẽ được nghiên cứu sau.

Các ảnh trên slide minh họa bối cảnh chở hàng và nền nghiêng, không phải ảnh sản phẩm đã lắp trên xe.

### Slide 3. Thiết bị và đấu nối

> MPU6050 cung cấp ba thành phần gia tốc X, Y, Z qua I²C. ESP32 đọc các giá trị này, tính góc, cập nhật cảnh báo và gửi bản tin MQTT.
>
> Trong sơ đồ mô phỏng, SDA nối GPIO21, SCL nối GPIO22. Cảm biến dùng địa chỉ 0x68, cấp 3,3 V và nối GND chung. Buzzer ở GPIO25. LED xanh nối GPIO26 qua điện trở 330 ôm.
>
> LED này báo chế độ giám sát. Khi đang đo thì LED sáng, tạm dừng thì LED tắt. Cảnh báo nghiêng và lỗi cảm biến được phân biệt bằng âm thanh và trạng thái trên web.
>
> MPU6050 có cả con quay hồi chuyển, nhưng firmware hiện chỉ dùng dữ liệu gia tốc. Còi trong Wokwi là loại thụ động, loại còi thật sẽ được chọn và cấu hình theo linh kiện mua được.

Chỉ lần lượt vào bảng thành phần rồi đến sơ đồ. Không đọc hết các nhãn chân nhỏ.

### Slide 4. Hai luồng xử lý dữ liệu

> Luồng phía trên là đo và hiển thị. MPU6050 gửi gia tốc cho ESP32. ESP32 tự tính góc, quyết định cảnh báo và điều khiển còi. Sau đó dữ liệu đi qua Mosquitto đến backend Express. Website React lấy trạng thái từ backend bằng HTTP khoảng mỗi giây.
>
> Luồng phía dưới là điều khiển theo chiều ngược lại. Người dùng chọn bắt đầu hoặc tạm dừng trên web. Express gửi lệnh qua MQTT đến ESP32. ESP32 áp dụng chế độ, cập nhật LED rồi gửi trạng thái trở lại trong telemetry.
>
> Backend đối chiếu phản hồi với yêu cầu đang chờ trước khi báo thành công. Như vậy, thao tác gửi lệnh và việc thiết bị đã thực hiện lệnh được phân biệt rõ.
>
> Việc xử lý còi nằm tại ESP32. Website dùng để theo dõi và điều khiển chế độ, không tham gia vào từng lần quyết định phát còi.

Đọc sơ đồ trên từ trái sang phải, sơ đồ dưới từ phải sang trái. Nếu thầy hỏi sâu về phản hồi lệnh, mở slide 14.

### Slide 5. Tính góc nghiêng từ gia tốc XYZ

> Khi cảm biến đứng yên, hướng vector gia tốc đo được có thể dùng để xác định độ lệch tư thế. Em gọi vector hiện tại là a, gồm ax, ay, az. Vector r là hướng mốc được lưu khi khay đặt ngang và thực hiện CAL.
>
> Góc theta là góc giữa hai vector này. Tích có hướng r nhân a cho biết độ lệch giữa chúng, còn tích vô hướng cho biết mức cùng hướng. Chương trình lấy độ lớn tích có hướng và tích vô hướng làm hai đối số của atan2, sau đó đổi radian sang độ.
>
> Khi mốc là hướng Z dương, công thức tương đương atan2 của căn ax bình phương cộng ay bình phương, với az. Vì có cả ax và ay, nghiêng theo X, theo Y hoặc theo hướng chéo đều góp vào góc tổng.
>
> Kết quả nằm trong khoảng 0 đến 180 độ. Đây là độ nghiêng tổng so với mốc, không biểu diễn riêng hướng trái, phải hoặc từng góc pitch, roll.
>
> CAL thu khoảng 30 mẫu trong 3 giây khi khay nằm ngang và đứng yên. Chương trình lấy trung bình các mẫu hợp lệ, chuẩn hóa vector rồi lưu làm mốc. Bước này đặt hướng tham chiếu, chưa phải hiệu chuẩn đầy đủ sai số của từng trục cảm biến.

Khi giải thích, chỉ r trước, a sau, rồi cung theta. Không cần đọc từng ký hiệu của công thức thành tiếng nếu thầy đã theo dõi hình.

### Slide 6. Lọc góc và hai ngưỡng cảnh báo

> Sau khi tính góc, chương trình dùng bộ lọc lấy 0,75 lần góc lọc trước cộng 0,25 lần góc mới. Nhờ đó số hiển thị bớt thay đổi nhanh giữa các mẫu, nhưng cũng có độ trễ khi tư thế thay đổi.
>
> Cảnh báo dùng hai ngưỡng. Nếu đang tắt thì góc từ 15 độ trở lên sẽ bật. Nếu đang bật thì phải giảm còn 12 độ hoặc thấp hơn mới tắt. Trong khoảng giữa hai ngưỡng, chương trình giữ trạng thái trước.
>
> Ví dụ, từ 10 độ tăng lên 16 độ thì còi bật. Giảm còn 14 độ, còi vẫn kêu. Giảm tiếp còn 11 độ thì còi tắt. Cách này tránh việc còi bật tắt liên tục khi góc dao động quanh một ngưỡng duy nhất.
>
> Các hệ số lọc và ngưỡng này là tham số thử của bản hiện tại. Em sẽ đánh giá lại khi có thiết bị thật và số đo tham chiếu.

Chỉ vào ba hàng trong bảng theo thứ tự bật, tắt, giữ trạng thái.

### Slide 7. Điều khiển giám sát từ web

> Khi đang giám sát, ESP32 lấy mẫu mới, LED sáng và âm thanh phụ thuộc vào góc hoặc lỗi cảm biến. Khi tạm dừng, firmware ngừng lấy mẫu, góc trên web bị ẩn, LED và mọi âm thanh đều tắt.
>
> Tuy nhiên, thiết bị vẫn giữ kết nối và gửi bản tin định kỳ. Nhờ vậy, web phân biệt được thiết bị đang tạm dừng với thiết bị đã mất liên lạc.
>
> Trong lượt thử, em tạm dừng khi góc khoảng 16 độ đang cảnh báo. Sau đó đổi mẫu sang 10 độ trong lúc pause. Web vẫn không hiển thị góc cho đến khi em bắt đầu lại. Khi bắt đầu, ESP32 lấy mẫu mới và web hiện 10 độ như ảnh trên slide.
>
> Web chờ phản hồi từ ESP32 trước khi báo thao tác thành công. Bộ lọc cũng được khởi tạo lại khi bắt đầu đo để không tiếp tục dùng góc trước lúc tạm dừng.

### Slide 8. Âm thanh cảnh báo và lỗi cảm biến

> Có hai tín hiệu âm thanh khi giám sát. Cảnh báo nghiêng được lập trình phát 1.200 Hz trong 150 mili giây, tiếp theo 1.800 Hz trong 150 mili giây, rồi nghỉ 100 mili giây và lặp lại.
>
> Khi cảm biến lỗi, chương trình phát bíp riêng 2.000 Hz trong 170 mili giây mỗi giây. Khi tạm dừng thì cả hai loại âm thanh đều tắt.
>
> Bộ điều khiển chọn tần số theo thời gian millis, không chờ phát xong một đoạn âm mới xử lý tiếp. Trong các lượt mô phỏng, em đã nghe còi cảnh báo và bíp lỗi theo trạng thái. Em chưa đo tần số hoặc âm lượng bằng dụng cụ.
>
> Khi lắp thật, em sẽ kiểm tra loại còi, điện áp và dòng yêu cầu để chọn cấu hình cùng cách điều khiển phù hợp.

### Slide 9. Thiết kế hộp và dự toán

> Hình CAD thể hiện cách bố trí dự kiến. Hộp và cảm biến được cố định trên mặt đỡ để thay đổi tư thế cùng nhau.
>
> Em dự định mua hộp có sẵn. Sau khi chọn hộp và nhận linh kiện, em sẽ đo kích thước thật rồi điều chỉnh CAD, vị trí gá và lỗ đi dây. Khi thử trên bàn, em có thể tận dụng khay hoặc cuốn tập sẵn có làm mặt đỡ.
>
> Tổng dự toán hiện khoảng 447.250 đến 475.250 đồng, đã gồm 45.000 đồng dự phòng vận chuyển. Khoảng chênh lệch phụ thuộc lựa chọn hộp. Đây là chi phí tham khảo, chưa phải tổng tiền đã mua.

Không cần đọc toàn bộ danh sách linh kiện trên báo cáo trong phần này.

### Slide 10. Kết quả mô phỏng góc nghiêng

> Với chuỗi đầu vào 0, 10, 16, 14 rồi 11 độ, trạng thái quan sát được lần lượt là tắt, tắt, bật, giữ bật rồi tắt. Ảnh trên slide là mốc 14 độ sau khi đã cảnh báo ở 16 độ. Web vẫn báo vượt ngưỡng, phù hợp với hai ngưỡng bật và tắt.
>
> Em cũng thử các mẫu theo X dương, X âm, Y dương, Y âm và một hướng chéo. Các mẫu này cho góc gần 16 độ và có cảnh báo.
>
> Em phân biệt hai phần của phép thử. Mốc ngang và CAL dùng dữ liệu MPU6050 qua I²C trong Wokwi. Các mẫu nghiêng được cấp bằng lệnh ACCEL qua Serial, sau đó đi vào chung phần tính góc, lọc, còi và truyền dữ liệu.
>
> Vì ACCEL bỏ qua đọc I²C, kết quả này kiểm tra được xử lý phần mềm và đường truyền. Nó chưa xác định sai số của cảm biến thật khi nghiêng theo thước.

### Slide 11. Phản ứng khi lỗi và mất kết nối

> Khi dùng FAULT ON để mô phỏng lỗi, web ẩn góc, báo lỗi cảm biến và thiết bị phát bíp. Tạm dừng trong lúc lỗi làm LED và bíp tắt. Nếu bắt đầu lại khi lỗi còn tồn tại thì bíp xuất hiện lại. Sau FAULT OFF, dữ liệu hợp lệ phục hồi.
>
> Với mất dữ liệu, backend được cấu hình chuyển sang stale sau hơn 5 giây không nhận telemetry hợp lệ. Web sẽ ẩn góc cũ và khóa nút điều khiển. Lượt thử đã quan sát được trạng thái này, chưa đo chính xác thời điểm chuyển trạng thái.
>
> Ảnh bên phải là lúc em dừng broker trong khi góc đang ở 16 độ. Web mất dữ liệu nhưng firmware vẫn xử lý và còi vẫn kêu. Khi bật lại broker, MQTT kết nối lại và web nhận góc mới.
>
> Phần mạng chạy trong task riêng với phần lấy mẫu và điều khiển còi. Em chưa đo độ trễ đầu cuối, nên kết quả hiện tại thể hiện hành vi của hệ thống trong mô phỏng.

Chỉ vào hai hàng cuối khi nói về broker, để phân biệt với việc dừng hẳn simulator.

### Slide 12. Kế hoạch thực hiện

> Đến hiện tại, em đã triển khai firmware, backend và website, thử các trạng thái chính trên Wokwi, đồng thời xây dựng CAD dự kiến và khảo sát linh kiện.
>
> Sau buổi thuyết trình, em sẽ chọn linh kiện, mua hộp và lắp nguyên mẫu. Tiếp theo là CAL trên mặt ngang, đối chiếu góc bằng thước, kiểm tra còi và LED rồi thử kết nối với ESP32 thật.
>
> Kết quả thử thật sẽ là cơ sở để đánh giá sai lệch, đáp ứng và điều chỉnh cách gá. Hướng tự điều chỉnh khay bằng cơ cấu chấp hành sẽ được xem xét sau khi phần đo đã được kiểm chứng.

Chuyển sang slide 16. Khi trình chiếu bằng PowerPoint có thể gõ `16` rồi Enter. Giữ slide 13-15 để mở khi thầy hỏi thêm.

### Slide 16. Kết thúc

> Phần trình bày đề cương của em đến đây là hết. Em cảm ơn thầy đã lắng nghe. Em xin nhận câu hỏi và góp ý của thầy.

## 3. Lời giải thích cho ba slide dự phòng

### Slide 13. CAL và điều kiện dữ liệu

Mở khi được hỏi cách hiệu chuẩn, tại sao cần 25 mẫu hoặc vì sao gia tốc gần 1 g vẫn có thể sai góc.

> Khi CAL, khay cần nằm ngang, đứng yên, đang giám sát và dùng nguồn I²C. Chương trình thu 30 lượt mẫu, cần ít nhất 25 mẫu hợp lệ. Mẫu hợp lệ phải có giá trị hữu hạn và độ lớn vector từ 0,65 đến 1,35 g.
>
> Từ các mẫu đó, chương trình tính vector trung bình, chuẩn hóa rồi lưu bằng Preferences. Nếu số mẫu hợp lệ không đủ, vector trung bình không hợp lệ hoặc ghi thất bại thì CAL báo lỗi.
>
> Điều kiện độ lớn chỉ loại được một số mẫu không phù hợp. Gia tốc do chuyển động vẫn có thể tạo vector nằm trong khoảng này. Vì vậy, bộ kiểm tra không tự xác nhận thiết bị đang đứng yên, và chưa giải quyết được trường hợp xe tăng tốc, phanh hay rẽ.

Code để mở khi cần: [serviceCalibration:225-270](../web/firmware/tilt_tray.cpp#L225-L270), [validAcceleration:17-20](../web/firmware/static_tilt.h#L17-L20).

### Slide 14. MQTT và phản hồi điều khiển

Mở khi được hỏi vì sao cần backend, ACK được gửi ở đâu hoặc web biết ESP32 đã thực hiện lệnh bằng cách nào.

> ESP32 gửi telemetry đến topic tilt-tray/telemetry khoảng 500 mili giây một lần. Lệnh điều khiển đi đến topic riêng theo mã thiết bị, có kèm bootId, requestId và trạng thái cần đặt.
>
> bootId phân biệt lần khởi động. requestId phân biệt yêu cầu đang chờ. ESP32 áp dụng chế độ và GPIO rồi gửi lại lastCommandId cùng chế độ và LED trong telemetry.
>
> Backend đối chiếu các trường đó. Chỉ khi đúng thiết bị, phiên, yêu cầu và trạng thái thì mới trả thành công. Nếu chờ khoảng 4 giây chưa có phản hồi khớp, API báo hết thời gian chờ. Publish thành công mới chỉ cho biết thao tác gửi, chưa đủ xác nhận trạng thái thiết bị.
>
> Các ID này phục vụ đối chiếu lệnh, chưa phải cơ chế bảo mật xác thực người dùng.

Code để mở khi cần: [control.mjs:39-108](../web/backend/control.mjs#L39-L108), [applyPendingControl:284-324](../web/firmware/tilt_tray.cpp#L284-L324).

### Slide 15. Hướng phát triển khay tự điều chỉnh

Mở khi được hỏi đề tài có thể phát triển thành khay tự cân bằng hay không.

> Hướng tiếp theo là kết hợp accelerometer và gyro để ước lượng tư thế khi chuyển động, có xét sai lệch cảm biến và ảnh hưởng của gia tốc do xe chạy.
>
> Về cơ khí, em cần xác định tải, trọng tâm, mô-men và hành trình rồi mới chọn cơ cấu, motor, driver và nguồn. Em dự định bắt đầu với một trục trên bàn, có giới hạn hành trình và xử lý lỗi, sau đó mới mở rộng khi có số liệu.
>
> Bản hiện tại mới đo và cảnh báo, chưa có cơ cấu tự điều chỉnh. Việc giữ khay ngang về sau cũng chưa đủ để khẳng định đã bù toàn bộ tác động quán tính khi xe phanh hoặc rẽ.

## 4. Câu hỏi vấn đáp và cách trả lời

### 1. Tại sao không chỉ dùng atan2 của ax và az?

> Vì cách đó không tính đầy đủ ảnh hưởng của trục Y. Em dùng góc giữa vector đo XYZ và vector mốc CAL. Khi mốc là Z dương, tử của atan2 là căn ax bình phương cộng ay bình phương, nên có cả ảnh hưởng X và Y.

[Code tính góc: static_tilt.h:39-52](../web/firmware/static_tilt.h#L39-L52).

### 2. atan2 là hàm em tự viết hay của thư viện?

> Code gọi atan2f của thư viện toán qua math.h. Chữ f là phiên bản dùng float. Em tự viết phần tích có hướng, tích vô hướng và cách lấy mốc, rồi dùng atan2f để nhận góc theo radian và đổi sang độ.

[Header và phép gọi](../web/firmware/static_tilt.h#L3-L51).

### 3. Vì sao dùng atan2 mà không dùng arccos?

> Với hai vector, có thể xây dựng công thức góc bằng arccos của tích vô hướng đã chuẩn hóa. Bản này dùng atan2 vì đã tính được cả độ lớn tích có hướng và tích vô hướng, đồng thời xử lý được miền 0 đến 180 độ. Em chưa thực hiện phép đo so sánh sai số giữa hai cách trên cảm biến thật.

### 4. X, Y và Z ở đây là gì?

> Là các trục gắn với cảm biến và quay theo cảm biến. Chúng không phải ba hướng cố định của mặt đất. Hộp và cảm biến cần được cố định theo khay để góc đo phản ánh tư thế khay.

### 5. Vì sao không có góc âm hoặc phân biệt trái/phải?

> Đầu vào thứ nhất của atan2 là độ lớn tích có hướng, luôn không âm. Kết quả thể hiện độ lệch tổng giữa hai vector. Muốn có pitch, roll hoặc hướng nghiêng có dấu cần định nghĩa hệ trục và cách tính riêng.

### 6. CAL có tự biết khay đang nằm ngang không?

> Chưa. Người thử phải đặt khay nằm ngang và giữ yên. Chương trình kiểm tra nguồn dữ liệu, chế độ, số mẫu và độ lớn vector. Các kiểm tra đó không thay thế mặt phẳng hoặc thước tham chiếu.

### 7. Đã kiểm tra mốc CAL còn sau reboot chưa?

> Code đã có phần lưu và đọc lại Preferences. Tuy nhiên, lượt Wokwi được ghi nhận sau khi chạy lại báo không tìm thấy ref-v1 và dùng mốc Z dương. Em chưa dùng lượt đó để kết luận việc lưu mốc qua reboot đã đạt. Phần này còn cần kiểm tra trên nguyên mẫu.

[Lưu mốc](../web/firmware/tilt_tray.cpp#L260-L269), [đọc mốc](../web/firmware/tilt_tray.cpp#L562-L577).

### 8. Vì sao chọn 15 độ và 12 độ?

> Đây là hai ngưỡng thử cố định để kiểm tra hành vi cảnh báo và vùng đệm. Em chưa xác định chúng là ngưỡng an toàn chung cho mọi loại hàng. Khi có nguyên mẫu và điều kiện sử dụng cụ thể, em sẽ đánh giá lại.

### 9. Tại sao xuống 14 độ mà còi vẫn kêu?

> Vì trạng thái trước đang bật. Hệ thống chỉ tắt khi góc giảm còn 12 độ hoặc thấp hơn. Nếu trước đó đang tắt và mới tăng lên 14 độ thì vẫn tắt. Đây là hysteresis, tức giữ trạng thái trong vùng giữa hai ngưỡng.

### 10. Lọc 0,75/0,25 có làm chậm cảnh báo không?

> Có. Bộ lọc giảm dao động nhưng làm góc thay đổi từ từ. Hiện em giữ hệ số này để thử hệ thống, chưa đo đáp ứng đầu cuối hoặc tối ưu hệ số bằng số liệu thật. Khi bắt đầu đo lại hoặc phục hồi mẫu hợp lệ, bộ lọc được khởi tạo từ mẫu mới.

### 11. Tại sao lỗi cảm biến mà alarmOn vẫn bằng false?

> alarmOn chỉ biểu thị cảnh báo nghiêng. Lỗi cảm biến dùng sensorOk=false và góc null. Bộ điều khiển còi kiểm tra lỗi riêng nên vẫn có bíp lỗi. Khi pause thì cả cảnh báo nghiêng và bíp lỗi đều tắt.

### 12. Tại sao pause hơn 5 giây mà web không báo mất liên lạc?

> Pause chỉ ngừng lấy mẫu và phát âm. Telemetry định kỳ vẫn tiếp tục gửi, nên backend vẫn có bản tin hợp lệ mới. Mốc 5 giây là thời gian từ lần nhận bản tin hợp lệ cuối, không phải thời gian kể từ khi bấm pause.

### 13. Vì sao ACCEL không làm thanh XYZ của MPU6050 thay đổi?

> ACCEL lưu ba số vào nguồn đầu vào Serial của firmware và bỏ qua đọc I²C. Nó không điều khiển thanh trượt của part MPU6050. Muốn dùng cảm biến mô phỏng trở lại thì gửi I2C, bỏ FAULT nếu đang bật và chỉnh Acceleration trên part.

[Chọn nguồn đọc](../web/firmware/tilt_tray.cpp#L125-L163), [nhận ACCEL](../web/firmware/tilt_tray.cpp#L478-L496).

### 14. Nếu mất MQTT thì còi còn hoạt động không?

> Khi ESP32 vẫn chạy và giám sát đang bật thì phần đọc, tính góc và còi vẫn xử lý cục bộ. Task mạng thử kết nối lại riêng. Trong lượt thử dừng broker ở 16 độ, em đã nghe còi tiếp tục kêu. Nếu trước đó đang pause thì mất mạng không tự bật giám sát.

### 15. Dừng Wokwi khác dừng broker thế nào?

> Dừng Wokwi là dừng cả thiết bị mô phỏng, nên không còn vòng xử lý cục bộ. Dừng broker chỉ cắt đường trao đổi MQTT, thiết bị mô phỏng vẫn lấy mẫu và phát còi theo chế độ hiện có. Cả hai có thể làm web mất dữ liệu, nhưng trạng thái thiết bị khác nhau.

### 16. Web có tính góc và bật còi không?

> Không. ESP32 tính góc, lọc, so ngưỡng và phát còi. Web lấy kết quả từ backend để hiển thị và gửi yêu cầu đổi chế độ. Vì vậy còi không cần đợi lần polling HTTP của web.

### 17. Backend báo timeout thì ESP32 chắc chắn chưa đổi chế độ phải không?

> Chưa thể kết luận như vậy. Timeout cho biết backend chưa nhận phản hồi khớp trong thời gian chờ. Lệnh hoặc phản hồi có thể bị mất. Backend không báo thành công khi chưa có xác nhận, và cần xem trạng thái thiết bị ở bản tin tiếp theo.

### 18. Vì sao cần bootId và requestId?

> bootId giúp nhận biết một lần khởi động, tránh áp dụng lệnh nhắm đến phiên cũ. requestId giúp đối chiếu phản hồi với yêu cầu đang chờ. Firmware cũng bỏ ID trùng lệnh vừa áp dụng. Các giá trị này chưa bảo vệ hệ thống trước mọi yêu cầu giả mạo.

### 19. Dùng MQTT QoS 0 có bị mất bản tin không?

> Có khả năng mất bản tin vì QoS 0 không bảo đảm giao đến nơi. Telemetry gửi định kỳ nên hệ thống có thể nhận trạng thái ở bản tin sau. Điều khiển có phản hồi và timeout ở mức ứng dụng, nhưng vẫn chưa phải bảo đảm thực hiện mọi lệnh. Khi mất kết nối, hệ thống không giữ lệnh cũ để tự phát lại sau đó.

### 20. Kiểm thử tích hợp đã chạy trên ESP32 chưa?

> Bài test integration dùng Mosquitto và API thật, nhưng peer ESP32 được giả lập bằng Node. Nó kiểm tra hợp đồng điều khiển, heartbeat, timeout và phục hồi broker. Phần firmware, LED và âm thanh được thử riêng trong Wokwi. Thiết bị vật lý chưa thử.

### 21. Sai số và độ trễ của sản phẩm là bao nhiêu?

> Em chưa có số đo sai số và độ trễ đầu cuối trên phần cứng thật. Hiện có các chu kỳ cấu hình như lấy mẫu khoảng 100 mili giây, telemetry khoảng 500 mili giây và web lấy trạng thái mỗi giây. Các chu kỳ này không phải kết quả đo độ trễ. Sau khi lắp, em sẽ đối chiếu bằng thước và ghi lại đáp ứng thực tế.

### 22. Có thể dùng trên xe đang chạy chưa?

> Phạm vi hiện tại chưa đủ để khẳng định điều đó. Gia tốc do xe chạy có thể làm thay đổi vector đo dù độ lớn vẫn gần 1 g. Muốn ước lượng tư thế khi chuyển động cần nghiên cứu thêm dữ liệu gyro, bias và ảnh hưởng gia tốc chuyển động, sau đó thử có kiểm soát.

### 23. Đã có khay tự cân bằng chưa?

> Chưa. Hiện mới có đo và cảnh báo. Hướng tự điều chỉnh cần thêm cơ cấu chấp hành, tính tải và mô-men, nguồn, driver và bộ điều khiển phản hồi. Em sẽ thử từng bước, bắt đầu với một trục trên bàn.

### 24. Vì sao cần Express thay vì nối trình duyệt trực tiếp với MQTT?

> Trong kiến trúc này, Express kiểm tra dữ liệu, tính độ cũ và giữ yêu cầu điều khiển đang chờ xác nhận. React làm việc với HTTP API thống nhất. Đây là cách tổ chức em đang dùng, không phải kết luận rằng trình duyệt không thể dùng MQTT.

### 25. LED phản hồi có chứng minh LED thật đã sáng không?

> Firmware đọc lại mức GPIO26 để đưa vào telemetry. Điều này cho biết mức điều khiển của chân, chưa kiểm tra được ánh sáng hoặc LED có bị hỏng hay không. Khi lắp thật, em vẫn cần quan sát và kiểm tra mạch LED.

## 5. Khi cần minh họa trực tiếp

Phần chính đã có ảnh trên slide, nên không bắt buộc chạy demo trong 11 phút trình bày. Nếu thầy yêu cầu và môi trường đã sẵn sàng, có thể dùng lượt ngắn sau:

1. Trở về `I2C`, `FAULT OFF`, giữ gia tốc `(0, 0, 1)` và gửi `CAL`. Chờ `CAL done`.
2. Nói rõ: “Sau CAL, em cấp mẫu nghiêng qua ACCEL để minh họa phần xử lý.”
3. Gửi lần lượt các lệnh dưới đây, giữ mỗi mốc ít nhất 4 giây để lọc và web cập nhật.

| Mốc | Lệnh | Quan sát mong đợi |
| --- | --- | --- |
| 0° | `ACCEL 0 0 1` | Góc về gần 0°, còi im |
| 10° | `ACCEL 0.17365 0 0.98481` | Còi vẫn im |
| 16° | `ACCEL 0.27564 0 0.96126` | Cảnh báo bật, còi kêu |
| 14° | `ACCEL 0.24192 0 0.97030` | Cảnh báo vẫn bật |
| 11° | `ACCEL 0.19081 0 0.98163` | Cảnh báo tắt sau khi góc lọc giảm qua ngưỡng tắt |

Nếu chỉ còn khoảng một phút, có thể minh họa 16° rồi bấm Tạm dừng, đổi ACCEL sang 10° và bấm Bắt đầu. Giải thích rằng pause vẫn giữ liên lạc nhưng ngừng đo và tắt âm thanh.

Nếu môi trường không sẵn sàng, dùng ảnh trên slide 7, 10 và 11 để giải thích lượt thử đã ghi nhận. Không dành phần vấn đáp để cài lại công cụ.

## 6. Năm ý để nhớ trước khi vào phòng

1. ESP32 tính góc và phát còi, web chỉ hiển thị và yêu cầu đổi chế độ.
2. Đo góc tổng XYZ so với vector CAL, không phải pitch/roll có dấu.
3. Cảnh báo bật từ 15°, tắt khi còn 12° hoặc thấp hơn. 14° phụ thuộc trạng thái trước.
4. CAL dùng I²C, chuỗi nghiêng đã trình bày dùng ACCEL. Phần cứng thật chưa thử.
5. Khi chưa có số đo sai số hoặc độ trễ, trả lời đúng phạm vi đã làm, không lấy chu kỳ cấu hình làm kết quả đo.

Tra code chi tiết tại [Luồng và chức năng](../web/docs/Luong_va_Chuc_nang.md), tra thư viện và cấu hình tại [Tech Stack](../web/docs/Tech_Stack.md).

## 7. Câu hỏi về tổng quan đồ án và tiêu chí chấm điểm

Phần tiêu chí chấm điểm dựa trên PDF quy định chi tiết. Đối chiếu thêm [yêu cầu tối thiểu được cung cấp sau đó](README.md#yêu-cầu-tối-thiểu-mới-được-cung-cấp).

### 1. Em là ai, thuộc nhóm nào và phụ trách phần gì?

> Em là Lưu Chí Hải, MSSV 24127030, lớp 24C11, nhóm 24. Em thực hiện đồ án cá nhân nên phụ trách toàn bộ phần firmware ESP32, backend, frontend, mô phỏng, thiết kế CAD và báo cáo. Vì vậy, em cần giải thích được cả luồng đưa số đo lên web và luồng điều khiển từ web xuống thiết bị.

### 2. Sản phẩm của em là gì, giải quyết vấn đề nào?

> Sản phẩm là hộp cảnh báo độ nghiêng và giám sát qua web. Hộp được gắn cố định trên khay chở hàng để cảm biến nghiêng cùng khay.
>
> ESP32 đọc gia tốc từ MPU6050, tính góc nghiêng so với mốc ngang và phát còi khi vượt ngưỡng thử. Website hiển thị góc, trạng thái cảm biến, cảnh báo và kết nối. Người dùng có thể bắt đầu hoặc tạm dừng giám sát từ web.
>
> Phạm vi hiện tại là khay đứng yên hoặc nghiêng chậm. Phần ước lượng tư thế khi xe đang chạy và cơ cấu tự điều chỉnh khay thuộc hướng phát triển.

### 3. Sản phẩm có bao nhiêu chức năng cụ thể?

> Trong báo cáo, em chia thành 10 nhóm chức năng F01-F10 như sau.

| Mã | Chức năng | Hành vi cụ thể |
|---|---|---|
| F01 | Đo góc nghiêng | Tính góc tổng từ gia tốc XYZ so với vector mốc |
| F02 | Hiệu chuẩn CAL | Thu mẫu khi nằm ngang, tạo và lưu vector mốc |
| F03 | Kiểm tra ngưỡng | Bật cảnh báo từ 15°, tắt khi còn 12° hoặc thấp hơn |
| F04 | Phát âm tại hộp | Còi cảnh báo nghiêng và bíp lỗi riêng |
| F05 | Trao đổi MQTT | Gửi telemetry và nhận lệnh điều khiển |
| F06 | Giám sát trên web | Hiển thị góc và trạng thái thiết bị |
| F07 | Phát hiện dữ liệu cũ | Ẩn góc, khóa điều khiển khi mất liên lạc |
| F08 | Nhận biết lỗi cảm biến | Báo lỗi và gửi góc null |
| F09 | Bắt đầu/tạm dừng | Nhận lệnh từ web, áp dụng rồi phản hồi |
| F10 | LED báo chế độ | Sáng khi giám sát, tắt khi tạm dừng |

Cần nhớ: 10 nhóm chức năng trong báo cáo không đồng nghĩa 10 yêu cầu được tính điểm riêng. Điểm được đối chiếu theo các tiêu chí của học phần.

### 4. Luồng căn bản từ thiết bị input lên web hoạt động như thế nào?

Bạn có thể trình bày luồng đo là luồng căn bản chính:

MPU6050 → I²C → ESP32 → MQTT → Mosquitto
        → MQTT → Express → HTTP → React

> Input là cảm biến MPU6050. Khi đang giám sát, ESP32 đọc gia tốc X, Y, Z qua I²C khoảng mỗi 100 mili giây.
>
> Firmware kiểm tra mẫu hợp lệ, tính góc so với vector CAL, lọc góc rồi áp dụng hai ngưỡng cảnh báo. Còi cũng được cập nhật tại ESP32.
>
> Khoảng mỗi 500 mili giây, ESP32 chuẩn bị telemetry gồm góc, trạng thái cảm biến, cảnh báo, chế độ và LED. Task mạng gửi bản tin qua MQTT đến Mosquitto.
>
> Backend Express đã đăng ký topic telemetry nên nhận được bản tin. Backend kiểm tra cấu trúc, số thứ tự và lưu bản tin hợp lệ mới nhất cùng thời điểm nhận.
>
> React gọi API trạng thái khoảng mỗi giây. Backend trả góc, trạng thái và tuổi dữ liệu để web hiển thị. Nếu quá hơn 5 giây chưa có bản tin hợp lệ, API không trả góc cũ như số đo hiện tại.

Nếu thầy hỏi “ai xử lý từng phần?”:

> MPU6050 cung cấp mẫu gia tốc. ESP32 tính góc và điều khiển còi. Mosquitto chuyển bản tin. Backend kiểm tra dữ liệu và cung cấp API. React hiển thị cho người dùng.

### 5. Luồng từ web xuống thiết bị output hoạt động như thế nào?

React → HTTP → Express → MQTT → Mosquitto
      → MQTT → ESP32 → GPIO26 → LED

> Người dùng bấm Bắt đầu hoặc Tạm dừng trên web. React gửi HTTP POST đến backend, với trạng thái cần đặt là true hoặc false.
>
> Backend kiểm tra kết nối và dữ liệu hiện tại, tạo mã yêu cầu rồi gửi lệnh MQTT đến topic riêng của ESP32. Lệnh có mã phiên khởi động, mã yêu cầu và trạng thái cần đặt.
>
> Task mạng ESP32 nhận và kiểm tra lệnh, sau đó đưa vào queue. Vòng xử lý chính lấy lệnh để đổi chế độ và cập nhật GPIO26.
>
> Khi tạm dừng, firmware ngừng lấy mẫu, tắt LED và mọi âm thanh. Khi bắt đầu lại, firmware lấy mẫu mới và khởi tạo lại bộ lọc.
>
> Sau khi áp dụng, ESP32 gửi telemetry có mã lệnh vừa thực hiện, chế độ và trạng thái LED. Backend đối chiếu phản hồi với yêu cầu đang chờ rồi mới báo thành công cho web.

Nếu thầy hỏi “tại sao phải có phản hồi?”:

> Vì gửi lệnh thành công chưa chứng minh ESP32 đã thực hiện lệnh. Phản hồi giúp backend kiểm tra thiết bị đã áp dụng đúng yêu cầu hay chưa.

### 6. Luồng cảm biến đến còi diễn ra như thế nào? Có cần web không?

MPU6050 → ESP32 → Tính/lọc góc → Kiểm tra ngưỡng → Buzzer

> Luồng này xử lý cục bộ trên ESP32. Khi góc đã lọc đạt ngưỡng bật thì ESP32 điều khiển còi, không cần đợi web lấy trạng thái.
>
> Phần lấy mẫu và còi nằm trong vòng xử lý chính, còn Wi-Fi/MQTT nằm trong task mạng riêng. Vì vậy, khi broker mất kết nối nhưng thiết bị vẫn chạy và giám sát đang bật, cảnh báo tại hộp vẫn có thể hoạt động.
>
> Em đã thử dừng broker khi mẫu góc là 16° trong Wokwi. Web mất dữ liệu nhưng còi vẫn tiếp tục kêu.

Không tự tính luồng này thành một yêu cầu nâng cao riêng, vì nó dùng lại MPU6050 của luồng đo lên web. Quy định có điều kiện các thiết bị giữa những yêu cầu được tính điểm phải khác nhau.

### 7. Phần nào là căn bản, phần nào có thể đối chiếu nâng cao?

> Em dùng luồng MPU6050 đến web làm luồng căn bản chính. Ngoài ra, em đã triển khai luồng web điều khiển LED và chế độ giám sát, đồng thời tự xây website bằng Express và React, không dùng Node-RED.
>
> Em đối chiếu những phần bổ sung này với tiêu chí nâng cao. Việc công nhận luồng web đến LED và cách phân bổ điểm cho trường hợp cá nhân cần theo đánh giá của thầy. Em không tính hai luồng thành hai lần 4 điểm căn bản.

Bảng đối chiếu để bạn nhớ:

| Nội dung hiện có | Tiêu chí liên quan | Mức tối đa trong quy định |
|---|---|---|
| MPU6050 → ESP32 → MQTT → backend → frontend | Luồng căn bản input đến web | 4 điểm chức năng khi hiểu toàn bộ luồng |
| Web → ESP32 → LED | Luồng web đến output, nếu được công nhận là yêu cầu nâng cao riêng | 1,5 điểm khi đến thiết bị output |
| Website Express và React tự xây | Website quản lý không dùng Node-RED | 2 điểm |
| Còi dùng cùng MPU6050 của luồng căn bản | Cần xét điều kiện không dùng trùng thiết bị giữa yêu cầu | Không tự cộng thêm |

Các mức trên là điểm tối đa của tiêu chí, chưa phải điểm đã được chấm. Nguồn đối chiếu là mục C trong [PDF quy định chi tiết](<references/TCTA_QUY ĐỊNH ĐỒ ÁN CUỐI KỲ.pdf>).

### 8. Em chọn những linh kiện nào? Hiện đã có linh kiện thật chưa?

> Trong mô phỏng em dùng ESP32 DevKit, MPU6050, piezo thụ động, LED xanh và điện trở 330 ôm.
>
> Nguyên mẫu dự kiến có thêm breadboard, dây Dupont, cáp USB, hộp mua sẵn và băng keo hai mặt để cố định thử. Mặt đỡ có thể tận dụng khay hoặc cuốn tập sẵn có.
>
> Hiện em đã thực hiện mô phỏng và thiết kế dự kiến, chưa lắp nguyên mẫu phần cứng thật. Mẫu board, loại buzzer, hộp và cách gá cuối cùng sẽ được đối chiếu khi mua và nhận linh kiện.

Nếu đã mua hoặc nhận linh kiện sau cuộc trao đổi này, bạn thay câu cuối bằng tình trạng thực tế.

### 9. Vì sao chọn ESP32, MPU6050, buzzer và LED?

> Em chọn ESP32 vì có Wi-Fi, giao tiếp I²C và khả năng điều khiển GPIO/PWM, phù hợp cho cả đo cảm biến, phát còi và gửi MQTT.
>
> MPU6050 cung cấp gia tốc ba trục để tính độ nghiêng tổng. Nó còn có gyro để nghiên cứu phát triển sau này, nhưng firmware hiện chưa dùng gyro.
>
> Buzzer cung cấp cảnh báo nghe được tại chỗ. LED giúp người đứng gần hộp biết giám sát đang bật hay tạm dừng. Điện trở nối tiếp dùng để hạn dòng cho LED.
>
> Trong Wokwi, piezo thụ động cho phép chương trình tạo hai cao độ. Khi mua thật, em sẽ kiểm tra loại còi và thông số điện để chọn cách điều khiển phù hợp.

### 10. Em chia công việc như thế nào khi làm một mình?

> Vì làm cá nhân, em chia theo phần việc thay vì chia theo thành viên.
>
> Phần firmware gồm đọc cảm biến, tính góc, CAL, lọc, cảnh báo, LED và MQTT. Phần backend gồm kiểm tra telemetry, API và đối chiếu phản hồi điều khiển. Phần frontend gồm hiển thị trạng thái và gửi yêu cầu bắt đầu hoặc tạm dừng.
>
> Sau đó em tích hợp các phần để thử trên Wokwi, xây dựng mô hình cơ khí dự kiến và hoàn thiện báo cáo, slide.
>
> Giai đoạn sau buổi thuyết trình là chọn và lắp linh kiện thật, đối chiếu góc bằng thước, kiểm tra còi, LED và kết nối trên ESP32 thật.

Nếu thầy hỏi “ai chịu trách nhiệm toàn bộ luồng?”:

> Em phụ trách toàn bộ, nên em chịu trách nhiệm giải thích từ dữ liệu đầu vào, các bước xử lý đến đầu ra và phản hồi.

### 11. Cách tính điểm đồ án theo quy định là gì?

> Theo quy định, phần căn bản tối đa 4 điểm chức năng và 1 điểm làm việc nhóm/tích hợp, phần nâng cao tối đa 4 điểm, báo cáo tối đa 1 điểm.
>
> Tổng các phần được nhân với hệ số K, thể hiện mức độ hiểu do giảng viên đánh giá khi vấn đáp.

Điểm đồ án = (Điểm căn bản + Điểm nâng cao + Điểm báo cáo) × K

K từ 0 đến 1

> Vì em thực hiện cá nhân, cách áp dụng phần điểm làm việc nhóm cần theo xác nhận của thầy. Em không tự mặc định mình được điểm này chỉ vì các phần mềm đã tích hợp chung một project.

Điểm cần nhớ khi trả lời: làm được chức năng và giải thích được toàn bộ luồng đều quan trọng.

### 12. Em đăng ký hoặc đối chiếu những yêu cầu nào để tính điểm?

> Em đối chiếu luồng cảm biến đến web với yêu cầu căn bản. Phần nâng cao em có website tự xây không dùng Node-RED và luồng web đến LED để thầy xem xét theo điều kiện thiết bị khác nhau.
>
> Các chức năng như CAL, lọc góc, hysteresis, heartbeat và xử lý lỗi giúp hệ thống hoạt động đầy đủ hơn. Em không tự coi mỗi chức năng đó là một mục cộng điểm riêng nếu quy định không có tiêu chí tương ứng.
>
> Hiện em chưa triển khai cloud, lịch sử đo, thông báo điện thoại, email, chatbot hoặc đăng nhập, nên không đăng ký các mục đó.

Đây là cách trả lời rõ phạm vi mà không hứa trước tổng điểm.

### 13. Làm sản phẩm thật có được cộng điểm không?

> Quy định cho phép xem xét cộng tối đa 1 điểm vào điểm tổng kết khi làm sản phẩm thật. Sản phẩm phải hoạt động theo các chức năng đã mô tả, được đóng gói gọn và gần với thiết kế. Người thực hiện cũng phải hiểu và giải thích được luồng mình phụ trách.
>
> Hiện em chưa lắp phần cứng thật nên chưa coi mình đã đáp ứng điều kiện cộng điểm này. Em dự kiến thực hiện sau buổi thuyết trình.

Lưu ý cách nói là “được xem xét cộng tối đa”, không phải chắc chắn có thêm 1 điểm.

### 14. Em đã kiểm tra được gì và phần nào còn thiếu?

> Em đã thử trên Wokwi chuỗi góc 0°, 10°, 16°, 14°, 11°, các mẫu theo ±X, ±Y và một hướng chéo. Em đã ghi nhận cảnh báo bật, giữ bật và tắt theo hai ngưỡng.
>
> Em cũng đã thử tạm dừng/bắt đầu từ web, thay đổi mẫu khi pause, heartbeat khi pause, lỗi FAULT, dừng/chạy lại Wokwi và ngắt/phục hồi broker.
>
> CAL tại mốc ngang dùng I²C. Các mẫu nghiêng được cấp bằng ACCEL qua Serial, nên chưa phải phép đo sai số của cảm biến khi nghiêng vật lý.
>
> Kiểm thử tích hợp sử dụng Mosquitto và API thật, nhưng peer ESP32 là chương trình giả lập. Phần còn thiếu là lắp nguyên mẫu, đối chiếu góc với thước, đo đáp ứng và kiểm tra việc lưu mốc CAL qua reboot trên thiết bị.

### 15. Nếu chỉ có 30 giây để giới thiệu toàn bộ đồ án, em nói gì?

> “Em là Lưu Chí Hải, nhóm 24. Em thực hiện hộp cảnh báo độ nghiêng dùng ESP32 và MPU6050. Thiết bị tính góc nghiêng tĩnh, phát còi tại chỗ và gửi trạng thái lên web qua MQTT. Website cho phép bắt đầu hoặc tạm dừng giám sát, có phản hồi từ ESP32 và LED báo chế độ. Em đã thử các trạng thái chính trong Wokwi. Sau buổi thuyết trình, em sẽ lắp phần cứng thật và đối chiếu góc bằng thước. Phần xử lý khi xe chạy và khay tự điều chỉnh là hướng phát triển tiếp theo.”
