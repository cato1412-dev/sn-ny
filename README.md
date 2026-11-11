# 🎂 Website Chúc Mừng Sinh Nhật Người Thương (Editorial Anti-Slop Edition) ✨

Dự án website chúc mừng sinh nhật được tái thiết kế hoàn toàn theo tiêu chuẩn **Anti-AI-Slop** (loại bỏ giao diện AI rập khuôn, rẻ tiền) lấy cảm hứng từ các quy chuẩn thiết kế hàng đầu (`yetone/kill-ai-slop`, `heydamir/unslop`, `impeccable`):

- **LOẠI BỎ AI SLOP**:
  - ❌ Không dùng gradient tím neon / hồng cánh sen rực mắt.
  - ❌ Không dùng bóng đổ phát sáng (radioactive glows) lòe loẹt.
  - ❌ Không nhồi nhét emoji vô tội vạ vào mọi nút bấm và thẻ tiêu đề.
  - ❌ Không dùng khung kính mờ (glassmorphism) rẻ tiền.
- **THẨM MỸ EDITORIAL LUXURY & ẤM ÁP**:
  - ✨ Bảng màu đêm trầm mặc (Warm Obsidian `#0c0b0e`), ánh vàng nến tự nhiên (Candlelight Amber `#d4a359`), và sắc hoa nhung mộc mạc.
  - ✨ Typography tinh tuyển: Font chữ có hồn `Cormorant Garamond` (serif lãng mạn) kết hợp `Plus Jakarta Sans`.
  - ✨ Bức thư phong cách in thủ công (Letterpress Cotton Paper) nắn nót, ấm áp và chân thành.
  - ✨ Vảy vàng champagne và bụi sao rơi nhẹ nhàng thay cho confetti sặc sỡ kiểu casino.
- **TỐI ƯU TUYỆT ĐỐI CHO ĐIỆN THOẠI (ZERO-SCROLL VIEWPORT)**:
  - Cố định hoàn hảo trong 1 màn hình (`100dvh`), chuyển cảnh tại chỗ, cô ấy không cần vuốt hay cuộn trang.
  - Hỗ trợ Dynamic Island và tai thỏ trên iPhone.

---

## 🌟 Hành Trình 3 Chặng Tinh Tế

1. **Chặng 1: Mở Hộp Quà (Stage Invitation)**
   - Vòng Monogram chữ cái uốn lượn, thiết kế tinh giản và sang trọng.
   - Nút bấm tinh gọn, thanh thoát mở khóa âm thanh buổi tiệc.

2. **Chặng 2: Bánh Kem 3D & Chú Hổ Chibi (Stage Cake & Wish)**
   - Bánh kem 3D WebGL với chú Hổ con chibi siêu cute ngồi giữa vành 8 ngọn nến lung linh.
   - Cơ học vật lý chân thực: Vuốt ngón tay để xoay 3D với lực quán tính mượt mà. Chú hổ có nhịp thở vi mô sống động.
   - **Tương tác độc lạ**: Bật micro và thổi nhẹ vào mic điện thoại để dập tắt nến (hoặc chạm vào ngọn lửa / nút bấm).
   - Khi nến tắt: Không gian tối dịu 2.4s với đốm than hồng ấm áp thở nhẹ để cô ấy ước nguyện -> Bùng nổ vảy vàng champagne -> Hộp âm nhạc **Music Box** bài *Happy Birthday* ngân nga -> Dẫn lối vào bức thư.

3. **Chặng 3: Bức Thư Tay Cảm Xúc (Stage Letterpress Note)**
   - Tờ giấy cotton ấm áp xuất hiện, từng dòng tâm sự nắn nót gõ ra từ tốn.
   - Nút **"Thả Tim Yêu Thương"** trang nhã với icon SVG sắc nét (khi bấm sẽ tung chùm bụi vàng lấp lánh).
   - Nút **"Xem lại bánh kem"** giúp cô ấy quay lại ngắm nhìn bánh kem bất cứ khi nào.

---

## ✍️ Tùy Biến Thông Tin (`js/config.js`)

Mở file [`js/config.js`](file:///d:/code/sn-ny/js/config.js) để chỉnh sửa:
- `recipientName`: Tên thân mật của cô ấy.
- `birthDate`: Ngày sinh nhật (hiển thị trên nhãn nhỏ tinh tế góc trên).
- `letter.paragraphs`: Những lời chúc thật lòng từ trái tim bạn.
- `bgmUrl`: Để trống để dùng Music Box có sẵn (không sợ lỗi bản quyền/lỗi mạng), hoặc dán link MP3 riêng.

---

## 🚀 Đưa Lên GitHub Pages

1. Chạy lệnh tại thư mục `d:\code\sn-ny`:
   ```bash
   git init
   git add .
   git commit -m "Editorial anti-slop birthday website"
   git branch -M main
   ```
2. Đẩy lên repo GitHub của bạn:
   ```bash
   git remote add origin https://github.com/TÊN_GITHUB/TÊN_REPO.git
   git push -u origin main
   ```
3. Vào **Settings** -> **Pages** -> chọn `Deploy from a branch` -> chọn `main` và `/ (root)` -> bấm **Save**.
4. Gửi link cho cô ấy đúng thời khắc sinh nhật! 🎂✨
