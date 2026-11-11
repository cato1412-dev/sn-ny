/**
 * ========================================================
 * CONFIGURATION - TÙY CHỈNH THÔNG TIN DÀNH RIÊNG CHO NGƯỜI THƯƠNG
 * ========================================================
 * Bạn chỉ cần chỉnh sửa các thông tin trong file này để cá nhân hóa
 * trang web chúc mừng sinh nhật mà không cần đụng vào code khác!
 */

const CONFIG = {
  // --- THÔNG TIN CƠ BẢN ---
  recipientName: "Em Bé Của Anh",      // Tên hoặc cách gọi thân mật hiển thị trên web
  nickname: "Công Chúa Nhỏ",          // Biệt danh
  birthDate: "2026-11-15",             // Ngày sinh nhật (Định dạng: YYYY-MM-DD)
  
  // --- ÂM NHẠC NỀN ---
  // Để trống "" để dùng hộp âm nhạc Music Box bài Happy Birthday tự động
  // Hoặc dán link file mp3 nếu muốn phát bài hát riêng: "https://.../bai-hat.mp3"
  bgmUrl: "", 
  
  // --- MÀN HÌNH 1: THIỆP MỜI (INTRO) ---
  intro: {
    badge: "A Moment For You",
    title: "Món Quà Sinh Nhật",
    subtitle: "Dành cho ngày em bước sang tuổi mới với trọn vẹn bình yên và rạng rỡ.",
    buttonText: "Bắt Đầu Buổi Tiệc"
  },

  // --- MÀN HÌNH 3: BỨC THƯ TAY (SECRET LETTER) ---
  letter: {
    badge: "Gửi người anh thương",
    title: "Thương gửi em bé của anh,",
    paragraphs: [
      "Chúc mừng sinh nhật em bé của anh.",
      "Dạo này thấy em nhiều lúc mệt mỏi, hay im lặng gánh mọi chuyện một mình mà anh thương lắm. Đọc từng dòng tin nhắn gửi muộn, anh biết em đang phải chịu nhiều áp lực và suy nghĩ trong lòng, nhưng vì sợ anh lo nên em lại cứ cố giấu đi. Điều làm anh xót xa nhất là những lúc em mệt mỏi hay tủi thân như vậy, anh lại không thể có mặt ngay ở bên cạnh để ôm em một cái.",
      "Sinh nhật năm nay tụi mình còn nhiều nỗi lo toan, chưa thể đón một ngày sinh nhật trọn vẹn như em hằng mong muốn. Nhưng với anh, hôm nay em vẫn là cô gái đặc biệt nhất, và em xứng đáng nhận được tất cả những điều dịu dàng nhất.",
      "Chuyện tương lai hay ngoài kia thế nào anh không biết, anh chỉ biết hiện tại lòng anh lúc nào cũng hướng về em. Khoảng cách này chỉ là về mặt địa lý thôi, còn tâm trí và sự quan tâm của anh chưa bao giờ rời xa em nửa bước. Có mệt hay tủi thân thì cứ dựa vào anh, cứ gọi cho anh bất kể lúc nào. Đừng cố tỏ ra mạnh mẽ làm gì em nhé. Trước mặt người ngoài em có thể phải tự lập, nhưng trước mặt anh, em cứ là một em bé có quyền được yếu đuối, được thở dài và được vỗ về.",
      "Khó khăn tới đâu thì hai đứa mình cùng nhau tháo gỡ tới đó, rồi mọi thứ chắc chắn cũng sẽ ổn thôi. Anh vẫn đang cố gắng từng ngày để sớm rút ngắn khoảng cách này, để những sinh nhật sau của em, anh sẽ được ở ngay cạnh em, cùng em thổi nến và tự tay dắt em đi qua từng ngày chứ không còn phải chúc nhau qua chiếc điện thoại nữa.",
      "Tuổi mới, anh chúc em luôn khỏe mạnh, đêm về được ngủ những giấc thật sâu và bình an trong lòng. Mong em luôn giữ được nụ cười nhẹ nhõm và sự dịu dàng vốn có. Cứ yên tâm và vững lòng bước tiếp nhé, vì dù ở xa đến đâu, anh lúc nào cũng ở phía sau dõi theo, che chở và thương em."
    ],
    signature: "Anh thương và yêu em nhiều lắm."
  }
};
