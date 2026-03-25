# Phân Tích Chi Tiết: Nhật Ký Quyết Định (Decisions History)

Bản này giải thích ý nghĩa của 4 thẻ thống kê (Stats Cards) trên trang Quyết định, giúp bạn trả lời câu hỏi "Tại sao số liệu này lại quan trọng?".

---

## 1. Tổng quyết định (Total Decisions)
- **Ý nghĩa**: Phản ánh tổng khối lượng công việc mà người bán đã thực hiện thông qua hệ thống.
- **Dòng chú thích**: Hiển thị chi tiết số lượng đơn đã được Chấp nhận so với số lượng bị Từ chối.
- **Tại sao cần?**: Cho thấy quy mô vận hành. Nếu con số này lớn, nó chứng minh hệ thống đang xử lý một lượng dữ liệu đáng kể.

## 2. Tỷ lệ chấp nhận (Acceptance Rate)
- **Công thức**: (Số đơn Chấp nhận + Xác minh + Điều chỉnh) / Tổng số đơn.
- **Ý nghĩa**: Cho biết mức độ "mở lòng" của shop với khách hàng. 
- **Lưu ý**: Tỷ lệ này cao không hẳn là tốt nếu rủi ro cũng cao. Mục tiêu là tìm ra điểm cân bằng: Chấp nhận tối đa nhưng vẫn đảm bảo an toàn.

## 3. Theo đề xuất AI (AI Alignment Rate)
- **Ý nghĩa**: Đo lường mức độ tin tưởng của người bán vào các khuyến nghị của AI. 
- **Cách tính**: Tỷ lệ các quyết định của người bán trùng khớp với gợi ý của AI (ví dụ: AI bảo "Duyệt", người bán cũng nhấn "Duyệt").
- **Tại sao quan trọng?**: 
    - Nếu tỷ lệ này thấp (<50%), chứng tỏ AI đang đưa ra gợi ý không sát thực tế hoặc người bán chưa tin tưởng hệ thống. 
    - Nếu tỷ lệ này cao (>80%), chứng tỏ AI đang thực sự trở thành một "trợ lý đắc lực", giúp người bán tiết kiệm thời gian suy nghĩ.

## 4. Lợi nhuận ròng (Net Profit - Chỉ số "Sống còn")
- **Công thức**: **Lợi nhuận thực tế** (từ các đơn giao thành công) - **Chi phí rủi ro** (phí ship của các đơn bị bom/hoàn trả).
- **Dòng chú thích**: Hiển thị (+ tiền lời) / (- tiền lỗ phí ship).
- **Ý nghĩa cực kỳ quan trọng**: 
    - Đây là con số cuối cùng chứng minh hệ thống có giúp người bán **kiếm được tiền hay không**. 
    - Một hệ thống AI giỏi phải giúp con số này tăng lên bằng cách: Giảm số đơn "lỗ" (từ chối đúng lúc) và giữ lại số đơn "lời" (xác minh đúng người).

---

## 5. Hệ thống Bộ lọc (Tabs Filter)
Tại sao lại chia thành 4 tab: All, Accepted, Rejected, Bad Outcomes?

- **All (Tất cả)**: Cái nhìn toàn diện, không bỏ sót bất kỳ dữ liệu nào.
- **Accepted (Đã chấp nhận)**: Tập trung vào việc **tạo ra doanh thu**. Giúp người bán kiểm tra xem những đơn mình đã cho đi có đang suôn sẻ không.
- **Rejected (Đã từ chối)**: Tập trung vào việc **ngăn chặn rủi ro**. Giúp người bán tự tin hơn khi thấy mình đã tránh được những khách hàng "xấu".
- **Bad Outcomes (Kết quả xấu) - QUAN TRỌNG NHẤT**:
    - Đây là nơi liệt kê các đơn hàng mà chúng ta đã quyết định giao (Accepted) nhưng cuối cùng khách lại không nhận hoặc hủy đơn.
    - **Lý do để tab này**: Để người bán và hệ thống AI cùng "học hỏi". Nhìn vào đây để biết tại sao mình sai, từ đó điều chỉnh lại ngưỡng rủi ro trong tương lai. Đây chính là tính năng giúp shop "thông minh" hơn theo thời gian.

---

### 💡 Gợi ý thuyết trình:
Bạn có thể nói với thầy: *"Trang Nhật ký quyết định không chỉ là một danh sách, mà là một 'bảng kế toán' về hiệu quả quản lý rủi ro. Nhìn vào Lợi nhuận ròng và Tỷ lệ theo AI, giáo viên sẽ thấy được dự án của em thực sự mang lại giá trị kinh tế trực tiếp cho người kinh doanh online."*
