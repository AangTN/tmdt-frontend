# Kế hoạch Cải thiện Giao diện Khách hàng (Christmas Edition)

Sau khi kiểm tra toàn bộ giao diện khách hàng, dưới đây là kế hoạch chi tiết để đồng bộ hóa theme Giáng Sinh cho các trang còn lại, đảm bảo trải nghiệm người dùng liền mạch và ấn tượng.

## 1. Trang Danh sách Combo (`CombosPage`)
**Mục tiêu:** Biến trang Combo thành "Gói Quà Tiết Kiệm" hấp dẫn.

*   **Hero Section:**
    *   Thay background gradient đỏ đơn giản bằng background "Đêm Giáng Sinh" (Midnight Blue + Sao lấp lánh) hoặc "Rừng Thông" (Xanh đậm) để đồng bộ với Homepage.
    *   Thêm hiệu ứng tuyết rơi nhẹ (CSS overlay).
    *   Tiêu đề: Font Serif (Merriweather), màu Vàng kim (#F8B229), text-shadow phát sáng.
*   **Featured Combo (Combo Nổi bật):**
    *   Biến Card thành hình dáng "Hộp Quà Khổng Lồ".
    *   Viền: Vàng kim lấp lánh.
    *   Badge "Combo Nổi bật": Thiết kế lại thành hình nơ quà tặng (Ribbon).
*   **Danh sách Combo:**
    *   Card Style: Background trắng kem (#FFFAF0), viền mỏng xanh lá.
    *   Hover: Nổi lên (translateY) và đổ bóng đỏ.
    *   Nút "Xem chi tiết": Gradient Đỏ lễ hội, bo tròn.

## 2. Trang Chi tiết Combo (`ComboDetailPage`)
**Mục tiêu:** Làm nổi bật giá trị tiết kiệm và cảm giác "đập hộp".

*   **Layout:**
    *   Background: Pattern bông tuyết mờ trên nền kem.
    *   Breadcrumb: Style lại với icon cây thông làm separator.
*   **Hình ảnh:**
    *   Khung ảnh: Viền xoắn kẹo gậy (Candy Cane) hoặc khung vàng kim.
*   **Thông tin & Giá:**
    *   Giá tiền: Font lớn, màu Đỏ rực, icon hộp quà bên cạnh.
    *   Dòng "Tiết kiệm...": Highlight nền xanh lá nhạt, text xanh đậm, icon túi tiền.
*   **Danh sách món trong Combo:**
    *   Hiển thị dạng list có icon checkmark (✓) hoặc bông tuyết đầu dòng.
    *   Mỗi món là một "món quà nhỏ" trong gói quà lớn.

## 3. Trang Đăng nhập / Đăng ký (`LoginPage`)
**Mục tiêu:** Tạo cảm giác ấm cúng, chào đón thành viên về "ngôi nhà chung".

*   **Layout:**
    *   Chia đôi màn hình (trên Desktop):
        *   Một bên là hình ảnh minh họa Giáng sinh (Ông già Noel check list, Lò sưởi ấm áp).
        *   Một bên là Form đăng nhập.
*   **Form Container:**
    *   Style như một tấm thiệp mời hoặc lá thư gửi Ông già Noel.
    *   Background: Giấy cũ hoặc trắng ngà.
    *   Viền: Tem thư hoặc khung tranh gỗ.
*   **Input Fields:**
    *   Focus: Border xanh lá, icon (user, lock) màu đỏ.
*   **Nút Action:**
    *   "Đăng nhập": Gradient Đỏ.
    *   "Đăng ký": Border Vàng kim.

## 4. Trang Thành công / Thất bại (`OrderSuccessPage` / `PaymentFailedPage`)
**Mục tiêu:** Ăn mừng đơn hàng hoặc an ủi/hướng dẫn khi lỗi.

*   **Order Success:**
    *   Icon: Thay emoji đơn giản bằng hình minh họa Ông già Noel cưỡi xe trượt tuyết hoặc Hộp quà bật mở.
    *   Message: "Ho Ho Ho! Đơn hàng của bạn đã được gửi đi!"
    *   Nút "Tiếp tục mua sắm": Style lễ hội.
    *   Hiệu ứng: Pháo giấy (Confetti) hoặc Tuyết rơi nhiều hơn.
*   **Payment Failed:**
    *   Icon: Người tuyết tan chảy hoặc Tuần lộc buồn.
    *   Message: "Oops! Có chút trục trặc với cỗ xe tuần lộc..."
    *   Nút "Thử lại": Màu cam/vàng để khích lệ.

## 5. Trang Theo dõi Đơn hàng (`TrackOrderPage`)
**Mục tiêu:** Biến việc chờ đợi thành trải nghiệm thú vị.

*   **Timeline/Progress Bar:**
    *   Các mốc trạng thái: Thay chấm tròn bằng các icon:
        *   Chờ xác nhận: 📝 (List)
        *   Đang chuẩn bị: 👨‍🍳 (Bếp) hoặc 🍪 (Bánh)
        *   Đang giao: 🛷 (Xe trượt tuyết)
        *   Hoàn thành: 🎁 (Quà)
    *   Thanh tiến trình: Màu đỏ/trắng xoắn (Kẹo gậy).

## 6. Trang Thông tin & Liên hệ (`AboutPage` / `ContactPage`)
**Mục tiêu:** Kể câu chuyện thương hiệu mùa lễ hội.

*   **About Page:**
    *   Thêm đoạn giới thiệu về "Bếp Pizza mùa Giáng Sinh".
    *   Hình ảnh đội ngũ đội mũ Noel.
*   **Contact Page:**
    *   Form liên hệ style "Gửi thư cho chúng tôi".

## 7. Trang Hồ sơ Cá nhân (`ProfileEditPage`)
**Mục tiêu:** Gọn gàng, sạch sẽ, dễ sử dụng.

*   **Card Profile:**
    *   Background trắng, shadow nhẹ.
    *   Avatar: Thêm khung viền trang trí (vòng nguyệt quế).

---
**Lưu ý chung:**
*   Đảm bảo Responsive trên Mobile cho tất cả các trang.
*   Sử dụng biến màu CSS global (`var(--primary)`, `var(--gold)`, etc.) để dễ quản lý.
*   Tối ưu hóa hình ảnh để không làm chậm trang web.
