# 🚀 Deployment Guide - TikTok Live Music Player

## 📋 Overview

Bạn có 2 lựa chọn deployment chính:

1. **🚀 Same Server (Khuyến nghị)** - Deploy backend + frontend cùng một server
2. **🔀 Separate Servers** - Deploy riêng biệt để scale độc lập

---

## 🚀 Option 1: Same Server Deployment (Khuyến nghị)

### ✅ **Ưu điểm:**
- **Đơn giản**: 1 server, 1 domain, 1 SSL cert
- **Socket.IO tối ưu**: Không có cross-origin issues
- **Chi phí thấp**: Chỉ cần 1 server
- **Phù hợp real-time**: TikTok Live cần low latency
- **Dễ debug**: Logs tập trung

### 🔧 **Cách deploy:**

#### **A. Vercel (Serverless - Free tier)**

1. **Chuẩn bị:**
```bash
# Build frontend
yarn build

# Test local production
yarn deploy
```

2. **Deploy lên Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

3. **Environment Variables trên Vercel:**
```
NODE_ENV=production
PORT=5000
```

#### **B. Railway (Container-based)**

1. **Connect GitHub repo:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

2. **Config Railway:**
```bash
# Set environment
railway variables set NODE_ENV=production

# Start command
node backend/index.js
```

#### **C. Heroku (Traditional PaaS)**

1. **Heroku setup:**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node backend/index.js" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

2. **Config vars:**
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=80
```

#### **D. VPS (Ubuntu/CentOS)**

1. **Server setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn

# Install PM2
npm install -g pm2
```

2. **Deploy app:**
```bash
# Clone repo
git clone https://github.com/Yinnz/tiktok-live-music-app.git
cd tiktok-live-music-app

# Install & build
yarn install-deps
yarn build

# Start with PM2
pm2 start backend/index.js --name "tiktok-music"
pm2 save
pm2 startup
```

3. **Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO support
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔀 Option 2: Separate Server Deployment

### ⚖️ **Khi nào nên dùng:**
- **Large scale**: Expect nhiều concurrent users
- **Team lớn**: Frontend & backend teams riêng
- **Scaling needs**: Cần scale frontend/backend độc lập
- **CDN requirements**: Frontend cần global distribution

### 🖥️ **Frontend Deployment:**

#### **Vercel/Netlify (Static):**
```bash
# Frontend only
cd frontend
yarn build

# Deploy to Vercel
vercel --prod

# Hoặc Netlify
netlify deploy --prod --dir=build
```

#### **Config cho separate deployment:**
```javascript
// frontend/src/config.js
const config = {
  development: {
    BACKEND_URL: 'http://localhost:5000'
  },
  production: {
    BACKEND_URL: 'https://your-backend-api.com'
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### 🔧 **Backend Deployment:**

#### **Digital Ocean/AWS EC2:**
```bash
# Chỉ backend
cd backend
yarn install
NODE_ENV=production yarn start

# Với PM2
pm2 start index.js --name "tiktok-backend"
```

#### **Backend CORS config:**
```javascript
// backend/index.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Development
    'https://your-frontend.vercel.app' // Production
  ],
  credentials: true
}));

// Socket.IO CORS
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://your-frontend.vercel.app'
    ],
    methods: ["GET", "POST"]
  }
});
```

---

## 🛠️ **Production Environment Setup**

### **Environment Variables:**
```bash
# Backend (.env)
NODE_ENV=production
PORT=5000

# Optional
YOUTUBE_API_KEY=your_youtube_api_key
STATS_UPDATE_INTERVAL=30000

# Frontend (.env.production)
REACT_APP_BACKEND_URL=https://your-backend.com
REACT_APP_WS_URL=wss://your-backend.com
```

### **Security Checklist:**
- ✅ HTTPS enabled (SSL certificate)
- ✅ Environment variables set
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Error logging setup
- ✅ Health check endpoints
- ✅ Process manager (PM2) running
- ✅ Database backups (if any)

---

## 📊 **Performance Monitoring**

### **Backend Monitoring:**
```javascript
// backend/index.js - Add health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV
  });
});
```

### **PM2 Monitoring:**
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs tiktok-music

# Restart if needed
pm2 restart tiktok-music

# Monitor with web interface
pm2 web
```

---

## 🐛 **Deployment Troubleshooting**

### **Common Issues:**

#### **Port conflicts:**
```bash
# Check if port is in use
lsof -i :5000

# Kill process
kill -9 PID
```

#### **Node.js version:**
```bash
# Check version
node --version

# Should be >= 16.0.0
nvm install 18
nvm use 18
```

#### **Build failures:**
```bash
# Clear cache
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# Frontend build issues
cd frontend
rm -rf build node_modules
yarn install
yarn build
```

#### **Socket.IO connection issues:**
```javascript
// Check CORS settings
// Verify WebSocket support on hosting platform
// Ensure proper proxy configuration
```

---

## 🎯 **Recommended Deployment Strategy**

### **Cho personal project:**
```
🚀 Same Server + Vercel
├── ✅ Free tier available
├── ✅ Auto SSL
├── ✅ Global CDN
├── ✅ Git integration
└── ✅ Easy domain setup
```

### **Cho production app:**
```
🔧 Same Server + VPS
├── 🖥️ Ubuntu 20.04 LTS
├── 🔄 PM2 process manager
├── 🌐 Nginx reverse proxy
├── 🔒 Let's Encrypt SSL
└── 📊 Monitoring setup
```

### **Cho enterprise:**
```
🔀 Separate + Microservices
├── ⚛️ Frontend: Vercel/Netlify
├── 🔧 Backend: AWS ECS/K8s
├── 🗄️ Database: AWS RDS
├── 📈 Monitoring: DataDog
└── 🔄 CI/CD: GitHub Actions
```

---

## 📝 **Quick Deploy Commands**

```bash
# Development
yarn dev

# Build for production
yarn build

# Deploy to production (same server)
yarn deploy

# Check production health
curl https://your-app.com/api/health

# Monitor logs
pm2 logs tiktok-music

# Update deployment
git pull origin main
yarn install-deps
yarn build
pm2 restart tiktok-music
```

---

**Khuyến nghị**: Bắt đầu với **Same Server deployment** trên **Vercel** cho đơn giản, sau đó scale lên VPS khi cần thiết! 🚀 