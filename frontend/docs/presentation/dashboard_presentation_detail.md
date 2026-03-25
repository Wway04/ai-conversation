# Phân Tích Chi Tiết: Trang Thống Kê (Dashboard)

Trang Dashboard được thiết kế để làm "Trung tâm chỉ huy" (Command Center) cho người bán. Mục tiêu là giúp họ biết ngay lập tức tình trạng sức khỏe của cửa hàng mà không cần đọc từng con số chi tiết.

---

## 1. Các Thẻ Chỉ Số Thông Minh (Stats Cards)
- **Các chỉ số**: Tổng đơn, Đơn chờ xử lý, Điểm rủi ro TB, Doanh thu tháng.
- **Tại sao chọn 4 chỉ số này?**: 
    - Đây là "North Star Metrics" (Chỉ số định hướng) của một shop COD. 
    - **Đơn chờ xử lý** nhắc nhở về khối lượng công việc còn tồn đọng.
    - **Điểm rủi ro TB** cho biết tổng thể tệp khách hàng hiện tại đang "sạch" hay "bẩn" (có nhiều gian lận hay không).
- **Thiết kế**: Sử dụng màu sắc tương phản (Xanh, Cam, Tím, Lục) và Sparkline (biểu đồ nhỏ) để thấy ngay xu hướng tăng/giảm trong 24h qua mà không cần mở biểu đồ lớn.

## 2. Biểu Đồ Phân Bổ Rủi Ro (Risk Distribution)
- **Loại biểu đồ**: Donut Chart (Biểu đồ tròn khuyết).
- **Lý do**: Donut chart cực kỳ hiệu quả trong việc thể hiện **tỷ lệ phần trăm trên tổng thể**. 
- **Ý nghĩa**: Người bán có thể thấy ngay phần "màu đỏ" (Nghiêm trọng/Cao) chiếm bao nhiêu diện tích. Nếu màu đỏ chiếm >30%, đó là tín hiệu báo động cần thắt chặt chính sách duyệt đơn ngay lập tức.

## 3. Biểu Đồ Xu Hướng Đơn Hàng (Orders Trend)
- **Loại biểu đồ**: Area Chart (Biểu đồ vùng có dải màu).
- **Lý do**: So sánh giữa "Tổng đơn" và "Đơn rủi ro" theo chu kỳ 14 ngày.
- **Ý nghĩa**: Giúp phát hiện các cuộc "tấn công" (ví dụ: bỗng nhiên một ngày lượng đơn rủi ro tăng vọt - có thể là đối thủ chơi xấu hoặc một chiến dịch spam đơn ảo). Lưu ý khoảng thời gian 14 ngày là đủ để thấy được chu kỳ mua sắm cuối tuần/đầu tuần.

## 4. Biểu Đồ Kết Quả Đơn Hàng (Decision Outcomes)
- **Loại biểu đồ**: Bar Chart (Biểu đồ cột).
- **Lý do**: Cung cấp cái nhìn trung thực về những gì đã xảy ra sau khi giao hàng.
- **Giá trị**: Đây là "Feedback Loop" (Vòng lặp phản hồi). Nếu cột "Giao thất bại" hoặc "Hoàn trả" quá cao, người bán cần xem lại AI (hoặc cách họ nghe theo AI) có đang bị sai sót ở đâu không.

## 5. Hiệu Quả AI (AI Efficiency - Unique Selling Point)
- **Lý do**: Đây là phần quan trọng nhất để thuyết phục người dùng về giá trị của AI.
- **Thiết kế**: Sử dụng so sánh trực quan giữa tỷ lệ giao thành công khi *theo* AI và khi *bỏ qua* AI. 
- **Mục đích**: Chứng minh bằng con số cụ thể rằng: "Nếu bạn nghe theo AI, tỷ lệ thành công của bạn cao hơn X%". Đây là lợi ích kinh tế trực tiếp (ROI).

## 6. Đơn Hàng Rủi Ro Mới Nhất (Recent Risky Orders)
- **Lý do**: Dashboard không chỉ để xem, mà còn để **hành động**.
- **Chức năng**: Liệt kê 5-10 đơn hàng "nguy hiểm nhất" vừa mới phát sinh.
- **Thiết kế**: Sử dụng Badge màu sắc (Đỏ/Cam) để thu hút sự chú ý. Có nút "Xem tất cả" để chuyển hướng nhanh sang trang Order List đã được lọc sẵn.

---

### 💡 Gợi ý cho bạn khi thuyết trình phần này:
Hãy nói với thầy rằng: *"Dashboard này không chỉ là một bảng báo cáo dữ liệu tĩnh. Nó được thiết kế dựa trên tâm lý học người dùng (quy tắc 5 giây): Trong 5 giây đầu tiên nhìn vào, người bán phải biết mình cần làm gì (duyệt đơn nào) và tình hình kinh doanh đang ổn hay không."*
