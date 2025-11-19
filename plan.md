📋 Kế hoạch thực hiện: "Giáng Sinh hóa" Website Secret Pizza
Bạn có thể copy từng bước (Prompt) dưới đây gửi cho Copilot để nó thực hiện lần lượt.

Bước 1: Thiết lập màu sắc và Theme (Global Styles)
Prompt cho Agent: "Hãy tạo một file CSS mới tên là src/styles/christmas.css.

Trong file này, định nghĩa một class toàn cục (ví dụ: body.christmas-theme).

Bên trong class đó, hãy ghi đè (override) các biến CSS root hiện có trong src/styles/global.css:

--primary: Đổi sang màu đỏ ông già Noel (#D42426).

--primary-dark: Đổi sang màu đỏ đậm hơn (#A61B1E).

--secondary: Đổi sang màu xanh lá cây thông (#165B33).

Thêm biến mới --gold: màu vàng chuông (#F8B229).

Import file này vào src/main.jsx sau file global.css.

Thêm logic vào src/App.jsx để tự động thêm class christmas-theme vào thẻ body khi component được mount (và chỉ khi không phải trang Admin)."

Bước 2: Tạo hiệu ứng tuyết rơi (Snow Component)
Prompt cho Agent: "Tạo một component mới src/components/ui/SnowEffect.jsx để làm hiệu ứng tuyết rơi toàn trang.

Yêu cầu kỹ thuật:

Sử dụng React useEffect để sinh ra một mảng khoảng 50 phần tử (bông tuyết).

Mỗi bông tuyết cần có vị trí left (0-100%), animation-duration và animation-delay ngẫu nhiên để trông tự nhiên.

Viết CSS Module đi kèm (SnowEffect.module.css) sử dụng @keyframes để bông tuyết rơi từ trên xuống (top: -10px đến 100vh) và lắc lư nhẹ sang hai bên.

Quan trọng: Container của tuyết phải có position: fixed, z-index cao, và pointer-events: none để không chặn click chuột của người dùng.

Gắn component này vào src/App.jsx, hiển thị nó ở mọi nơi ngoại trừ các route bắt đầu bằng /admin."

Bước 3: Trang trí Header (Mũ Noel & Màu sắc)
Prompt cho Agent: "Hãy chỉnh sửa src/components/layout/Header.module.css để trang trí lại thanh điều hướng:

Logo: Dùng pseudo-element ::after trên class .brand để thêm một biểu tượng mũ ông già Noel (🎅) nằm nghiêng trên chữ "Secret Pizza".

Border: Đổi viền dưới của .navBar sang màu xanh lá (var(--secondary)) hoặc màu đỏ đậm.

Nút Giỏ hàng: Thay đổi màu nền của .cartCount (badge số lượng) sang màu vàng (--gold) để trông giống một chiếc chuông nhỏ."

Bước 4: Làm mới trang chủ (Hero Section)
Prompt cho Agent: "Cập nhật src/pages/HomePage.module.css để thay đổi phần Hero Banner:

Thay đổi background của .hero thành gradient kết hợp giữa Đỏ Giáng Sinh và Xanh Lá Cây.

Tìm các class .heroBubbleOne và .heroBubbleTwo (đang là hình tròn mờ), hãy đổi chúng thành hình dạng bông tuyết (dùng ký tự ❄️ hoặc content: '❄') và cho chúng hiệu ứng trôi nổi nhẹ nhàng.

Cập nhật nút CTA chính (Đặt ngay) để có thêm viền hoặc bóng đổ màu vàng (--gold) tạo cảm giác nổi bật."

Bước 5: Gói quà cho thẻ sản phẩm (Product Card)
Prompt cho Agent: "Chỉnh sửa src/components/ui/ProductCard.module.css để biến các thẻ món ăn thành các gói quà:

Thêm một viền mỏng (border) màu vàng nhạt hoặc xanh lá cho .card.

Chỉnh sửa class .promotionBadge (nhãn giảm giá): Đổi nền sang màu xanh lá (--secondary) và chữ trắng để tương phản với theme màu đỏ chủ đạo.

Thêm hiệu ứng hover: Khi di chuột vào thẻ, shadow nên chuyển sang tông màu vàng ấm (gold glow)."

Bước 6: Chân trang phủ tuyết (Footer)
Prompt cho Agent: "Cuối cùng, hãy cập nhật src/components/layout/Footer.module.css:

Sử dụng pseudo-element ::before trên class .footer để tạo một lớp phủ ở cạnh trên cùng của footer.

Dùng background: radial-gradient(...) lặp lại để tạo hiệu ứng gợn sóng màu trắng, trông giống như một lớp tuyết phủ trên nền tối của footer.

Đảm bảo lớp tuyết này nằm đè lên phần tiếp giáp giữa nội dung chính và footer."

💡 Mẹo cho bạn khi làm việc với Agent:
Nếu Agent viết code quá dài, hãy nhắc: "Chỉ đưa ra phần CSS thay đổi thôi" hoặc "Dùng CSS variables để dễ chỉnh sửa sau này".

Để gỡ bỏ theme sau Giáng sinh, bạn chỉ cần xóa dòng import christmas.css trong main.jsx và component SnowEffect trong App.jsx là xong.