# 🌍 Hướng Dẫn Sử Dụng Biến Môi Trường

## 📋 Tổng Quan

File `example.env` chứa tất cả biến môi trường cần thiết cho ứng dụng TikTok Live Music Player. Hướng dẫn này sẽ giúp bạn cấu hình đúng cách.

---

## 🚀 Cài Đặt Nhanh

### **1. Tạo File .env**
```bash
# Copy file mẫu
cp example.env .env

# Hoặc tạo file mới
touch .env
```

### **2. Cấu Hình Cơ Bản**
```bash
# Môi trường
NODE_ENV=development

# Cổng server
PORT=5000

# URL Frontend (cho CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 🔧 Cấu Hình Chi Tiết

### **🏗️ Cấu Hình Server**

#### **NODE_ENV**
```bash
# Development (phát triển)
NODE_ENV=development

# Production (triển khai)
NODE_ENV=production
```

#### **PORT**
```bash
# Cổng server backend
PORT=5000

# Lưu ý: Không thay đổi nếu dùng Docker hoặc Vercel
```

### **🌐 Cấu Hình CORS & Socket.IO**

#### **Development (Local)**
```bash
# CORS cho development
CORS_ORIGIN_DEV=http://localhost:3000

# Socket.IO cho development  
SOCKET_CORS_ORIGIN_DEV=http://localhost:3000

# Server URL cho frontend development
REACT_APP_SERVER_URL_DEV=http://localhost:5000
```

#### **Production (Vercel)**
```bash
# Thay 'your-app-name' bằng tên app thực tế của bạn
CORS_ORIGIN_PROD=https://your-app-name.vercel.app,https://your-app-name.vercel.app:443
SOCKET_CORS_ORIGIN_PROD=https://your-app-name.vercel.app,https://your-app-name.vercel.app:443
REACT_APP_SERVER_URL=https://your-app-name.vercel.app
```

**Ví dụ thực tế:**
```bash
# Nếu app của bạn là: https://tiktok-music-app.vercel.app
CORS_ORIGIN_PROD=https://tiktok-music-app.vercel.app,https://tiktok-music-app.vercel.app:443
SOCKET_CORS_ORIGIN_PROD=https://tiktok-music-app.vercel.app,https://tiktok-music-app.vercel.app:443
REACT_APP_SERVER_URL=https://tiktok-music-app.vercel.app
```

### **🎵 Cấu Hình TikTok Live**

#### **TikTok Connection Settings**
```bash
# Khoảng thời gian polling (milliseconds)
TIKTOK_POLLING_INTERVAL=1000

# Số comment tối đa lưu trữ
TIKTOK_MAX_COMMENTS=50

# Bật WebSocket cho kết nối nhanh hơn
TIKTOK_ENABLE_WEBSOCKET=true
```

### **📺 Cấu Hình YouTube**

#### **YouTube Search**
```bash
# Số kết quả tìm kiếm tối đa
YOUTUBE_SEARCH_LIMIT=5

# Độ dài video ưu tiên (short, medium, long)
YOUTUBE_PREFERRED_DURATION=medium
```

#### **YouTube API Key (Tùy chọn)**
```bash
# Để tìm kiếm chính xác hơn (không bắt buộc)
# Lấy từ: https://console.developers.google.com/
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### **📊 Cấu Hình Thống Kê**

#### **Statistics Update**
```bash
# Cập nhật thống kê mỗi 30 giây
STATS_UPDATE_INTERVAL=30000

# Số comment lưu trữ trong lịch sử
STATS_MAX_COMMENTS_HISTORY=50

# Thời gian timeout session (24 giờ)
STATS_SESSION_TIMEOUT=86400000
```

### **🔒 Cấu Hình Bảo Mật**

#### **Rate Limiting**
```bash
# Cửa sổ thời gian (15 phút)
RATE_LIMIT_WINDOW=900000

# Số request tối đa trong cửa sổ
RATE_LIMIT_MAX_REQUESTS=100
```

#### **Session Security**
```bash
# Secret key cho session (thay đổi trong production)
SESSION_SECRET=your_session_secret_here
```

### **🛠️ Cấu Hình Development**

#### **Debug & Logging**
```bash
# Bật chế độ debug
DEBUG_MODE=false

# Mức độ log (error, warn, info, debug)
LOG_LEVEL=info

# Bật dev tools
ENABLE_DEV_TOOLS=true

# Bật hot reload
ENABLE_HOT_RELOAD=true
```

---

## 🐳 Cấu Hình Docker

### **Container Settings**
```bash
# Cổng container
CONTAINER_PORT=5000

# Môi trường container
CONTAINER_ENV=production
```

---

## 🌐 Cấu Hình Frontend

### **Tạo File .env trong thư mục frontend/**
```bash
# Development
REACT_APP_SERVER_URL_DEV=http://localhost:5000

# Production (thay bằng URL thực tế)
REACT_APP_SERVER_URL=https://your-app-name.vercel.app
```

---

## 🚀 Triển Khai Production

### **1. Vercel Deployment**

#### **Environment Variables trong Vercel Dashboard:**
```bash
NODE_ENV=production
PORT=5000
CORS_ORIGIN_PROD=https://your-app-name.vercel.app
SOCKET_CORS_ORIGIN_PROD=https://your-app-name.vercel.app
REACT_APP_SERVER_URL=https://your-app-name.vercel.app
```

#### **Build Settings:**
- **Build Command**: `yarn vercel-build`
- **Output Directory**: `frontend/build`
- **Install Command**: `yarn install-deps`

### **2. Docker Deployment**

#### **Sử dụng file .env:**
```bash
# Build image
yarn docker:build

# Chạy với file env
yarn docker:run
```

---

## 🔍 Kiểm Tra Cấu Hình

### **1. Kiểm Tra Server**
```bash
# Health check
curl http://localhost:5000/api/health

# Debug connections
curl http://localhost:5000/api/debug/connections

# Debug playlists
curl http://localhost:5000/api/debug/playlists
```

### **2. Kiểm Tra Frontend**
```bash
# Mở browser console
# Kiểm tra kết nối Socket.IO
# Xem có lỗi CORS không
```

### **3. Kiểm Tra TikTok Connection**
```bash
# Thử kết nối TikTok Live
# Kiểm tra log server
# Xem thông báo lỗi
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### **❌ CORS Error**
```bash
# Kiểm tra CORS_ORIGIN_DEV và CORS_ORIGIN_PROD
# Đảm bảo URL đúng format
# Kiểm tra NODE_ENV
```

### **❌ Socket Connection Failed**
```bash
# Kiểm tra SOCKET_CORS_ORIGIN_DEV và SOCKET_CORS_ORIGIN_PROD
# Kiểm tra REACT_APP_SERVER_URL
# Xem log server
```

### **❌ TikTok Connection Failed**
```bash
# Kiểm tra TIKTOK_ENABLE_WEBSOCKET
# Kiểm tra TIKTOK_POLLING_INTERVAL
# Xem log TikTok connection
```

### **❌ YouTube Search Failed**
```bash
# Kiểm tra YOUTUBE_SEARCH_LIMIT
# Kiểm tra YOUTUBE_API_KEY (nếu có)
# Xem log YouTube search
```

---

## 📝 Checklist Cấu Hình

### **✅ Development Setup**
- [ ] Copy `example.env` thành `.env`
- [ ] Set `NODE_ENV=development`
- [ ] Set `PORT=5000`
- [ ] Set `CORS_ORIGIN_DEV=http://localhost:3000`
- [ ] Set `SOCKET_CORS_ORIGIN_DEV=http://localhost:3000`
- [ ] Set `REACT_APP_SERVER_URL_DEV=http://localhost:5000`

### **✅ Production Setup**
- [ ] Set `NODE_ENV=production`
- [ ] Thay `your-app-name` bằng URL thực tế
- [ ] Set `CORS_ORIGIN_PROD` với URL thực tế
- [ ] Set `SOCKET_CORS_ORIGIN_PROD` với URL thực tế
- [ ] Set `REACT_APP_SERVER_URL` với URL thực tế

### **✅ Security Setup**
- [ ] Thay đổi `SESSION_SECRET`
- [ ] Cấu hình `RATE_LIMIT_MAX_REQUESTS`
- [ ] Kiểm tra không có API keys trong code

---

## 🔄 Cập Nhật Cấu Hình

### **Khi Thay Đổi URL:**
1. Cập nhật tất cả biến có chứa URL
2. Restart server
3. Clear browser cache
4. Test lại kết nối

### **Khi Thêm Tính Năng Mới:**
1. Thêm biến môi trường vào `example.env`
2. Cập nhật hướng dẫn này
3. Test với các giá trị khác nhau

---

## 📞 Hỗ Trợ

### **Khi Gặp Vấn Đề:**
1. Kiểm tra file `.env` có đúng format không
2. Kiểm tra tất cả URL có đúng không
3. Xem log server và browser console
4. Sử dụng debug endpoints để kiểm tra

### **Debug Commands:**
```bash
# Kiểm tra biến môi trường
echo $NODE_ENV
echo $PORT

# Kiểm tra server
curl http://localhost:5000/api/health

# Kiểm tra kết nối
netstat -tulpn | grep 5000
```

---

**Lưu ý**: 
- ⚠️ **Không bao giờ commit file `.env`** vào Git
- 🔒 **Bảo mật thông tin nhạy cảm** trong production
- 📝 **Cập nhật hướng dẫn** khi thêm biến mới
- 🧪 **Test kỹ** trước khi deploy production

---

**Tác giả**: Yinnz  
**Cập nhật**: Tháng 1, 2024  
**Phiên bản**: 1.0.0 