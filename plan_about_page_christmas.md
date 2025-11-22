# Kế hoạch Cải thiện Giao diện Trang "Về Chúng Tôi" (Christmas Edition)

Mục tiêu: Biến trang `AboutPage` thành một câu chuyện ấm áp, lan tỏa không khí lễ hội và tinh thần sẻ chia của thương hiệu trong mùa Giáng Sinh.

## 1. Hero Section (Phần Mở Đầu)
*   **Background:**
    *   Sử dụng hình ảnh không gian bếp ấm cúng với ánh đèn vàng, lò sưởi hoặc bàn tiệc Giáng Sinh thịnh soạn.
    *   Overlay màu tối nhẹ để làm nổi bật text.
*   **Tiêu đề:**
    *   Thay đổi từ "Về Chúng Tôi" đơn điệu thành "Câu Chuyện Mùa Lễ Hội" hoặc "Mang Giáng Sinh Về Bếp Nhà".
    *   Font: Merriweather hoặc Playfair Display (Serif), màu Vàng kim (#F8B229) hoặc Trắng kem.
*   **Hiệu ứng:**
    *   Hiệu ứng tuyết rơi nhẹ nhàng (tận dụng `SnowEffect` component nếu có).

## 2. Phần "Câu Chuyện Của Chúng Tôi" (Our Story)
*   **Nội dung:**
    *   Lồng ghép thông điệp về sự sum họp, niềm vui và sẻ chia vào câu chuyện thương hiệu.
    *   Ví dụ: "Chúng tôi không chỉ phục vụ món ăn, chúng tôi mang đến những khoảnh khắc quây quần bên người thân yêu."
*   **Hình ảnh minh họa:**
    *   Thêm khung viền trang trí (vòng nguyệt quế, dây kim tuyến) quanh ảnh giới thiệu.
    *   Nếu có thể, sử dụng ảnh đội ngũ nhân viên đang đội mũ Noel hoặc trang trí cửa hàng.
*   **Style:**
    *   Nền: Màu kem nhạt (#FFFAF0) hoặc đỏ nhung trầm (#8B0000) cho các block text để tạo độ tương phản.

## 3. Giá Trị Cốt Lõi (Core Values)
*   **Cards:**
    *   Biến các thẻ giá trị thành hình dáng "Thiệp Giáng Sinh" hoặc "Hộp Quà".
    *   Background: Trắng, viền đỏ hoặc xanh lá.
    *   Shadow: Glow nhẹ màu vàng ấm.
*   **Icons:**
    *   Thay thế icon mặc định bằng icon theo chủ đề:
        *   Chất lượng -> Ngôi sao vàng trên đỉnh cây thông.
        *   Tận tâm -> Trái tim len ấm áp.
        *   Tốc độ -> Cỗ xe tuần lộc.

## 4. Đội Ngũ (Our Team) - Nếu có
*   **Avatar:**
    *   Thêm overlay mũ ông già Noel hoặc sừng tuần lộc nhỏ lên góc ảnh đại diện nhân viên (dùng CSS `::after`).
*   **Khung ảnh:**
    *   Viền tròn hoặc vuông với họa tiết kẹo gậy (sọc đỏ trắng).

## 5. Thống kê / Thành tựu
*   **Số liệu:**
    *   Màu số liệu: Đỏ tươi hoặc Vàng kim.
    *   Icon đi kèm: Chuông, Bông tuyết.

## 6. Call to Action (Lời Kêu Gọi)
*   **Thông điệp:** "Cùng chúng tôi tạo nên mùa Giáng Sinh đáng nhớ!"
*   **Nút bấm:**
    *   "Đặt Tiệc Ngay": Gradient Đỏ - Cam.
    *   Hiệu ứng Hover: Phóng to nhẹ, icon hộp quà rung rinh.

## 7. Footer / Kết thúc
*   **Lời chúc:** Thêm một câu chúc "Merry Christmas & Happy New Year" cách điệu ở cuối trang.
*   **Trang trí:** Dải dây đèn nhấp nháy (CSS animation) ở ngay trên footer.

---
**Lưu ý kỹ thuật:**
*   Sử dụng các biến màu CSS global đã định nghĩa trong `christmas.css` (nếu có) hoặc `global.css`.
*   Đảm bảo Responsive trên mobile, đặc biệt là các background image và font size tiêu đề.
