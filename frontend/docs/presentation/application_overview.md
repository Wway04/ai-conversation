# Hệ Thống COD Risk Advisor - Hướng Dẫn Thuyết Trình

Tài liệu này tổng hợp chi tiết các trang và tính năng cốt lõi của ứng dụng **COD Risk Advisor** để hỗ trợ bạn trong quá trình thuyết trình với giáo viên.

---

## 1. Tổng Quan Dự Án (Project Overview)
**Mục tiêu**: Giải quyết vấn đề "bom hàng" (hoàn trả) trong kinh doanh thương mại điện tử sử dụng hình thức thanh toán COD (Cash on Delivery).
- **Giải pháp**: Sử dụng AI để phân tích hành vi người mua, đánh giá rủi ro và đưa ra khuyến nghị xử lý đơn hàng theo thời gian thực.
- **Giá trị cốt lõi**: Giảm tỷ lệ hoàn hàng, tối ưu chi phí vận hành và tăng lợi nhuận cho người bán.

---

## 2. Các Trang Chính (Core Pages)

### 📊 Trang Thống Kê (Dashboard)
Đây là trung tâm điều khiển, cung cấp cái nhìn tổng thể về tình hình kinh doanh và rủi ro:
- **Chỉ số chính (Stats Cards)**: Tổng đơn hàng, số đơn chờ xử lý, điểm rủi ro trung bình, và doanh thu tháng.
- **Biểu đồ phân bổ rủi ro (Risk Distribution)**: Phân loại đơn hàng theo các mức Thấp - Trung bình - Cao - Nghiêm trọng.
- **Xu hướng đơn hàng (Orders Trend)**: Theo dõi biến động lượng đơn hàng và đơn rủi ro qua thời gian.
- **Hiệu quả AI (AI Efficiency)**: So sánh độ chính xác giữa việc "Nghe theo AI" và "Tự quyết định" để minh chứng cho giá trị của hệ thống.
- **Đơn hàng rủi ro mới nhất**: Danh sách các đơn hàng cần sự chú ý ngay lập tức.

### 📦 Danh Sách Đơn Hàng (Order List)
Quản lý tập trung toàn bộ đơn hàng COD:
- **Phân loại thông minh**: Các tab lọc nhanh cho đơn "Chờ quyết định" và "Rủi ro cao".
- **Điểm rủi ro (Risk Score)**: Hiển thị trực quan điểm rủi ro trên từng dòng đơn hàng giúp người bán ưu tiên xử lý.
- **Tìm kiếm & Bộ lọc**: Tìm kiếm theo mã đơn, tên người mua, hoặc số điện thoại.

### 🔍 Chi Tiết Đơn Hàng & Phân Tích Rủi Ro (Order Detail)
Đây là trang quan trọng nhất, nơi AI thực hiện nhiệm vụ "Cố vấn":
- **Hồ sơ người mua (Buyer Profile)**: Phân tích lịch sử mua hàng, tỷ lệ hủy đơn, và độ tin cậy của tài khoản.
- **Yếu tố rủi ro (Risk Factors)**: Liệt kê chi tiết *tại sao* AI đánh giá đơn hàng này rủi ro (ví dụ: địa chỉ không rõ ràng, thường xuyên đổi địa chỉ, đặt hàng vào giờ nhạy cảm).
- **Ước tính lợi nhuận (Profit Estimation)**: So sánh lợi nhuận dự kiến nếu giao thành công và rủi ro mất phí ship nếu bị hoàn trả.
- **Khuyến nghị hành động**: AI đưa ra 4 hướng xử lý: Chấp nhận, Chấp nhận kèm xác minh SĐT, Điều chỉnh điều kiện (cọc trước), hoặc Từ chối.

### 🤖 Cố Vấn AI (AI Chat Advisor)
Trang hội thoại trực tiếp với AI:
- **Hỗ trợ thực tế**: Người bán có thể hỏi "Tại sao đơn #123 lại rủi ro?" hoặc "Làm sao để giảm tỷ lệ hoàn hàng?".
- **Bối cảnh hóa**: AI hiểu được dữ liệu của từng đơn hàng cụ thể để đưa ra câu trả lời chính xác nhất.

### 📝 Lịch Sử Quyết Định (Decision History)
Lưu trữ và đối soát hiệu quả:
- Theo dõi các quyết định đã thực hiện và kết quả thực tế (Thành công/Hoàn trả).
- Giúp người bán đánh giá lại chiến lược quản lý rủi ro của mình.

---

## 3. Công Nghệ Sử Dụng (Tech Stack)
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, ApexCharts.
- **Backend**: NestJS (Node.js framework), TypeScript, PostgreSQL.
- **Hạ tầng**: Docker cho database, JWT cho bảo mật.
- **Đặc điểm nổi bật**:
  - Hỗ trợ đa ngôn ngữ (i18n): Tiếng Việt & Tiếng Anh.
  - Thiết kế Responsive: Hoạt động tốt trên cả máy tính và thiết bị di động.
  - UI/UX Premium: Giao diện hiện đại, trực quan, tập trung vào trải nghiệm người dùng.

---

## 4. Những Điểm Nhấn Cần Lưu Ý Khi Thuyết Trình
1. **Tính Thực Tiễn**: Nhấn mạnh vào việc hệ thống giải quyết trực tiếp nỗi đau của các chủ shop online (bị "bom" hàng).
2. **Quy Trình Khép Kín**: Từ Dữ liệu -> AI Phân tích -> Gợi ý Hành động -> Lưu trữ Quyết định -> Học hỏi từ kết quả.
3. **Trải Nghiệm Người Dùng**: Ứng dụng không chỉ có các con số khô khan mà còn có Chat AI thân thiện và biểu đồ trực quan.

Chúc bạn có một buổi thuyết trình thành công tốt đẹp!
