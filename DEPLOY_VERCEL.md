# 🚀 Deploy to Vercel - Complete Guide

## 📋 Prerequisites

1. **GitHub Account**: Push code to GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Version 16+ installed

## 🔧 Step 1: Prepare Your Repository

### **1.1 Push to GitHub**
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/tiktok-live-music-app.git
git push -u origin main
```

### **1.2 Verify Files Structure**
```
your-project/
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json
├── .vercelignore           # Files to exclude
├── backend/
│   ├── index.js
│   └── services/
├── frontend/
│   ├── package.json
│   ├── build/              # Built React app
│   └── src/
└── README.md
```

## 🌐 Step 2: Deploy to Vercel

### **2.1 Connect to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**

### **2.2 Configure Project Settings**

#### **Project Name**: `tiktok-live-music-app`
#### **Framework Preset**: `Other`
#### **Root Directory**: `./` (leave empty)

### **2.3 Environment Variables**

Add these environment variables in Vercel dashboard:

```bash
NODE_ENV=production
PORT=5000
```

### **2.4 Build Settings**

#### **Build Command**: `npm run vercel-build`
#### **Output Directory**: `frontend/build`
#### **Install Command**: `npm run install-all`

### **2.5 Deploy**

Click **"Deploy"** and wait for build to complete.

## 🔧 Step 3: Post-Deployment Configuration

### **3.1 Update CORS Settings**

After deployment, update `backend/index.js` with your actual Vercel URL:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://your-app-name.vercel.app"]  // Replace with your URL
      : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

### **3.2 Update Frontend Socket URL**

Update `frontend/src/App.js` with your Vercel URL:

```javascript
const serverUrl = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.vercel.app'  // Replace with your URL
  : 'http://localhost:5000';
```

### **3.3 Redeploy**

After making changes:
1. **Commit and push** to GitHub
2. **Vercel will auto-deploy** from GitHub

## 🎯 Step 4: Verify Deployment

### **4.1 Check URLs**

Your app will be available at:
- **Frontend**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api/health`
- **Debug**: `https://your-app-name.vercel.app/api/debug/connections`

### **4.2 Test Features**

1. **Server Connection**: Check if server indicator shows "Connected"
2. **TikTok Connection**: Try connecting to a TikTok Live stream
3. **Music Requests**: Test `!music` commands in TikTok Live
4. **Playlist**: Verify songs are added to playlist
5. **Real-time**: Check if comments update in real-time

## 🔧 Step 5: Troubleshooting

### **5.1 Common Issues**

#### **❌ Build Fails**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run install-all  # Install all dependencies
npm run build        # Build frontend
```

#### **❌ Socket Connection Fails**
```javascript
// Check CORS settings in backend/index.js
// Ensure Vercel URL is correct
```

#### **❌ TikTok Connection Fails**
```bash
# Check if TikTok Live is active
# Verify username format (without @)
# Check server logs in Vercel dashboard
```

### **5.2 Debug Commands**

#### **Check API Health**
```bash
curl https://your-app-name.vercel.app/api/health
```

#### **Check Connections**
```bash
curl https://your-app-name.vercel.app/api/debug/connections
```

#### **Check Playlists**
```bash
curl https://your-app-name.vercel.app/api/debug/playlists
```

## 📊 Step 6: Monitoring

### **6.1 Vercel Dashboard**

- **Analytics**: View traffic and performance
- **Functions**: Monitor serverless function usage
- **Logs**: Check application logs
- **Deployments**: Track deployment history

### **6.2 Performance**

- **Frontend**: Optimized React build (~73KB gzipped)
- **Backend**: Serverless functions with auto-scaling
- **WebSocket**: Real-time communication via Socket.IO

## 🔄 Step 7: Updates

### **7.1 Automatic Deployments**

- **Push to GitHub** → **Auto-deploy to Vercel**
- **Preview deployments** for pull requests
- **Rollback** to previous versions

### **7.2 Manual Deployments**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy manually
vercel

# Deploy to production
vercel --prod
```

## 🎉 Success!

Your TikTok Live Music Player is now live on Vercel!

### **🌐 Live URL**: `https://your-app-name.vercel.app`

### **📱 Features Available**:
- ✅ **Real-time TikTok Live connection**
- ✅ **Automatic music requests from chat**
- ✅ **YouTube integration for song playback**
- ✅ **Per-client playlist isolation**
- ✅ **Live statistics and analytics**
- ✅ **Mobile-optimized interface**
- ✅ **Debug endpoints for monitoring**

### **🔧 Next Steps**:
1. **Share your app** with users
2. **Monitor performance** in Vercel dashboard
3. **Add custom domain** if needed
4. **Set up monitoring** and alerts

---

**Happy Deploying! 🚀✨** 