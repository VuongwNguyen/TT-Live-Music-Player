# Yêu cầu xây dựng ứng dụng lắng nghe TikTok Live để phát nhạc qua YouTube

## Mục tiêu
Tạo một ứng dụng Node.js đơn giản với giao diện web  HTML/JS có khả năng:
- Kết nối và lắng nghe sự kiện **comment** từ TikTok Live qua thư viện `tiktok-live-connector`.
- Khi người dùng comment theo cú pháp `!music <tên bài hát> + <tên tác giả>`, ứng dụng sẽ:
  - Tìm kiếm bài hát trên YouTube (sử dụng `youtube-search-api`, `ytsr`, hoặc bất kỳ thư viện nào phù hợp).
  - Thêm bài hát vào **playlist** (hàng đợi phát nhạc).
- Giao diện web sẽ hiển thị:
  - Danh sách comment đang được nhận từ livestream.
  - Danh sách bài hát trong hàng đợi phát nhạc, bao gồm: tên bài hát, người yêu cầu.
  - Player phát nhạc (có thể dùng `<iframe>` YouTube Player).
  - kết nối tiktok-live
- Tự động chuyển bài khi video hiện tại kết thúc (dựa vào `duration` hoặc theo sự kiện `onEnded` của YouTube Iframe API).
- Có thể điều khiển thủ công playlist: phát, dừng, bỏ qua bài tiếp theo.
- có thể thêm nhạc bằng thủ công (có thể nhập tên bài hát và tên tác giả để thêm thủ công)

## Công nghệ đề xuất
- `Node.js` hoặc `Express.js` để chạy server.
- `tiktok-live-connector` để kết nối TikTok Live.
- `ytsr`, `yt-search`, hoặc `youtube-search-api` để tìm kiếm video YouTube.
- HTML/JS để xây dựng UI.
- YouTube Iframe API để phát nhạc và điều khiển player.
- Socket.IO hoặc EventSource để truyền dữ liệu comment và playlist từ server về UI realtime.
- `yarn`  để chạy lẹnh

## Luồng hoạt động
1. Kết nối TikTok Live bằng `tiktok-live-connector`, lắng nghe sự kiện `comment`.
2. Khi có comment bắt đầu bằng `!music`, parse tên bài hát và người thể hiện.
3. Tìm kiếm bài hát phù hợp trên YouTube, lấy link và duration.
4. Thêm vào playlist.
5. UI:
    - Hiển thị comment livestream realtime.
    - Hiển thị hàng đợi bài hát.
    - Phát bài hát đầu tiên trong danh sách bằng iframe YouTube.
    - Khi hết bài hiện tại thì tự động phát bài tiếp theo.
    - Các nút điều khiển: Play, Pause, Next.

## API tối thiểu
- Route `/` trả về UI hiển thị comment + player + playlist + kết nối tiktok-live.
- Sử dụng WebSocket hoặc Socket.IO để cập nhật comment và playlist realtime từ server.

## Gợi ý cấu trúc thư mục
project-root/
├── server/
│ ├── index.js # Express server + TikTok live connection
│ ├── tiktok.js # Kết nối và xử lý sự kiện từ TikTok
│ └── youtube.js # Tìm kiếm YouTube
├── client/
│ ├── index.html # Giao diện đơn giản (hoặc dùng React)
│ └── app.js # Xử lý UI, socket, iframe, playlist
├── public/ # Assets tĩnh nếu cần
└── package.json