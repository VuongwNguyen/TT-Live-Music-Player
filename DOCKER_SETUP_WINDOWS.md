# 🐳 Docker Setup Guide for Windows

## 🚨 **Lỗi: 'docker' is not recognized**

Bạn cần cài đặt Docker Desktop trên Windows trước khi sử dụng Docker commands.

---

## 🔧 **Cài đặt Docker Desktop cho Windows**

### **📋 Yêu cầu hệ thống:**
- **Windows 10** version 2004 trở lên (Build 19041+)
- **Windows 11** (khuyến nghị)
- **WSL 2** (Windows Subsystem for Linux)
- **Hyper-V** support (Pro/Enterprise) hoặc **WSL 2**

### **⬬ Bước 1: Download Docker Desktop**

1. **Truy cập**: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. **Click**: "Download for Windows"
3. **Chọn**: Intel chip hoặc Apple Silicon (nếu dùng Mac)

### **🔧 Bước 2: Cài đặt WSL 2 (Khuyến nghị)**

**PowerShell as Administrator:**
```powershell
# Enable WSL và Virtual Machine Platform
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart máy tính
Restart-Computer

# Sau khi restart, set WSL 2 as default
wsl --set-default-version 2

# Install Ubuntu (optional)
wsl --install -d Ubuntu
```

### **🚀 Bước 3: Cài đặt Docker Desktop**

1. **Chạy**: Docker Desktop Installer.exe
2. **Configuration options**:
   - ✅ **Use WSL 2 instead of Hyper-V** (khuyến nghị)
   - ✅ **Add shortcut to desktop**
   - ✅ **Use Docker Compose V2**

3. **Restart** máy tính sau khi cài đặt

### **⚙️ Bước 4: Kiểm tra cài đặt**

**PowerShell:**
```powershell
# Kiểm tra Docker version
docker --version
docker-compose --version

# Test run Hello World
docker run hello-world
```

**Kết quả mong đợi:**
```
Docker version 24.0.7, build afdd53b
Docker Compose version v2.21.0

Hello from Docker!
This message shows that your installation appears to be working correctly.
```

---

## 🔧 **Alternative: Docker Toolbox (Windows 7/8/10 Home cũ)**

Nếu máy bạn không support WSL 2:

1. **Download**: [Docker Toolbox](https://github.com/docker/toolbox/releases)
2. **Install**: VirtualBox + Docker Toolbox
3. **Use**: Docker Quickstart Terminal

---

## 🚀 **Chạy TikTok Live Music Player với Docker**

### **📝 Bước 1: Chuẩn bị environment**
```powershell
# Copy environment file
copy example.env .env

# Edit .env với text editor của bạn
notepad .env
```

### **🐳 Bước 2: Build và chạy**
```powershell
# Build Docker image
yarn docker:build

# Run container
yarn docker:run

# Hoặc development mode
yarn docker:dev

# Production deployment
yarn docker:prod
```

### **🌐 Bước 3: Truy cập ứng dụng**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🐛 **Troubleshooting**

### **❌ WSL 2 installation failed**
```powershell
# Update Windows to latest version
winget upgrade Microsoft.WindowsTerminal

# Manual WSL kernel update
# Download: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
```

### **❌ Docker Desktop won't start**
```powershell
# Restart Docker service
net stop com.docker.service
net start com.docker.service

# Reset Docker Desktop (nếu cần)
# Settings → Troubleshoot → Reset to factory defaults
```

### **❌ Port conflicts**
```powershell
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID_NUMBER> /F
```

### **❌ Performance issues**
```powershell
# Allocate more resources in Docker Desktop
# Settings → Resources → Advanced
# RAM: 4GB+ (khuyến nghị)
# CPU: 2+ cores
```

---

## 🔧 **Docker Commands Cheat Sheet**

### **🏗️ Build & Run:**
```powershell
# Build image
docker build -t tiktok-live-music .

# Run container
docker run -p 5000:5000 --env-file example.env tiktok-live-music

# Run in background
docker run -d -p 5000:5000 --name tiktok-music tiktok-live-music

# Stop container
docker stop tiktok-music

# Remove container
docker rm tiktok-music
```

### **📊 Monitoring:**
```powershell
# List running containers
docker ps

# View logs
docker logs tiktok-music

# Execute command in container
docker exec -it tiktok-music sh

# View container stats
docker stats tiktok-music
```

### **🧹 Cleanup:**
```powershell
# Remove unused images
docker image prune -f

# Remove all stopped containers
docker container prune -f

# Remove everything (careful!)
docker system prune -a -f
```

---

## 🎯 **Next Steps**

1. **✅ Cài đặt Docker Desktop**
2. **✅ Verify với `docker --version`**
3. **✅ Copy `example.env` thành `.env`**
4. **✅ Run `yarn docker:build`**
5. **✅ Run `yarn docker:run`**
6. **✅ Test trên `localhost:5000`**

---

## 💡 **Pro Tips**

- **WSL 2**: Hiệu suất tốt hơn Hyper-V
- **Resource allocation**: Đặt RAM >= 4GB cho Docker
- **Volume mounting**: Sử dụng `/mnt/c/` path trong WSL
- **Development**: Dùng `yarn docker:dev` cho hot reload
- **Production**: Dùng `yarn docker:prod` cho deployment

---

**🎵 Happy Dockerizing! 🐳** 