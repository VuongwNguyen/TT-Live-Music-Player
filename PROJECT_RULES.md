# 📋 Project Rules & Guidelines

## 🎯 Project Overview

**Project Name**: TikTok Live Music Player  
**Version**: 2.0.0  
**Package Manager**: Yarn  
**Deployment**: Docker + Vercel  
**Maintainer**: Yinnz  

---

## 🏗️ Architecture Rules

### **📁 File Structure**
```
demo/
├── backend/                 # Node.js Express server
│   ├── index.js            # Main server file
│   └── services/           # Business logic services
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.js          # Main app component
│   └── build/              # Production build
├── package.json            # Root package.json (yarn)
├── vercel.json             # Vercel deployment config
├── Dockerfile              # Docker production build
├── docker-compose.yml      # Docker services
└── README.md               # Project documentation
```

### **🔧 Technology Stack**
- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: React 18 + Socket.IO Client
- **Package Manager**: Yarn (no npm)
- **Deployment**: Docker + Vercel
- **Database**: In-memory (RAM storage)

---

## 💻 Development Rules

### **📦 Package Management**
```bash
# ✅ Use Yarn ONLY - No npm
yarn install
yarn add package-name
yarn remove package-name

# ❌ Don't use npm
npm install  # ❌
npm install package-name  # ❌
```

### **🔄 Scripts Usage**
```bash
# Development
yarn dev              # Start both backend + frontend
yarn backend          # Backend only with nodemon
yarn frontend         # Frontend only

# Build & Deploy
yarn build            # Build frontend
yarn start            # Start backend
yarn deploy           # Full deployment
yarn vercel-build     # Build for Vercel

# Docker
yarn docker:build     # Build Docker image
yarn docker:prod      # Production deployment
```

### **📝 Code Style**
```javascript
// ✅ Use single quotes
const message = 'Hello World';

// ✅ Use semicolons
const name = 'John';

// ✅ Use arrow functions
const handleClick = () => {
  console.log('clicked');
};

// ✅ Use const/let (no var)
const API_URL = 'http://localhost:5000';
let counter = 0;

// ✅ Use template literals
const url = `${API_URL}/api/health`;
```

### **🎨 CSS Guidelines**
```css
/* ✅ Use kebab-case for class names */
.user-profile { }
.comment-section { }

/* ✅ Use BEM methodology for complex components */
.comment__item { }
.comment__item--highlighted { }

/* ✅ Use CSS variables for theming */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

---

## 🚀 Deployment Rules

### **🐳 Docker Deployment**
```bash
# ✅ Production deployment
yarn docker:build
yarn docker:prod

# ✅ Development with Docker
yarn docker:dev

# ✅ Cleanup
yarn docker:stop
yarn docker:clean
```

### **🌐 Vercel Deployment**
```bash
# ✅ Build for Vercel
yarn vercel-build

# ✅ Follow DEPLOY_VERCEL.md guide
# 1. Push to GitHub
# 2. Connect to Vercel
# 3. Configure environment variables
# 4. Deploy
```

### **🔧 Environment Variables**
```bash
# Required for production
NODE_ENV=production
PORT=5000

# Optional
MAX_CONNECTIONS=100
PLAYLIST_CLEANUP_INTERVAL=300000
COMMENT_HISTORY_LIMIT=100
```

---

## 📊 Data Management Rules

### **💾 Storage Strategy**
- **✅ In-Memory**: Comments, playlists, statistics
- **✅ Per-Client Isolation**: Each user has independent data
- **✅ Auto-Cleanup**: Data removed on disconnect
- **❌ No Database**: Don't add database without discussion

### **🔒 Data Isolation**
```javascript
// ✅ Each client has isolated data
clientConnections = new Map(); // socketId -> connections
clientPlaylists = new Map();   // socketId -> playlist

// ✅ Global uniqueness for TikTok accounts
globalConnections = new Map(); // username -> socketId
```

---

## 🐛 Bug Fix Rules

### **🔍 Debugging Process**
1. **Check Console Logs**: Browser + Server
2. **Use Debug Endpoints**:
   ```bash
   curl localhost:5000/api/health
   curl localhost:5000/api/debug/connections
   curl localhost:5000/api/debug/playlists
   ```
3. **Check Connection Status**: Server indicator
4. **Verify TikTok Live**: Username format, live status

### **📱 Mobile Issues**
- **Scroll Problems**: Check CSS overflow settings
- **Touch Issues**: Verify touch event handlers
- **Performance**: Monitor memory usage

### **🔌 Connection Issues**
- **Server Disconnect**: Check backend logs
- **TikTok Connection**: Verify username format
- **Socket Errors**: Check CORS settings

---

## 📝 Documentation Rules

### **📚 Required Documentation**
- ✅ **README.md**: Main project documentation
- ✅ **DEPLOY_VERCEL.md**: Vercel deployment guide
- ✅ **DOCKER_SETUP_WINDOWS.md**: Docker setup guide
- ✅ **PROJECT_RULES.md**: This file

### **📖 Code Comments**
```javascript
// ✅ Use descriptive comments
/**
 * Handles TikTok Live connection for a specific client
 * @param {string} username - TikTok username (without @)
 * @param {string} socketId - Client socket ID
 */
async connect(username, socketId) {
  // Implementation
}

// ✅ Use inline comments for complex logic
const isConnected = clientConns.size > 0; // Check if client has any connections
```

---

## 🔄 Git Rules

### **📝 Commit Messages**
```bash
# ✅ Use emoji prefixes
🎯 Feature: Add per-client playlist isolation
🔧 Fix: Mobile scroll issues
📚 Docs: Update README with new features
🚀 Deploy: Prepare for Vercel deployment

# ✅ Use descriptive messages
git commit -m "🎯 Feature: Add per-client playlist isolation

✨ New Features:
- Each client has independent playlist
- No cross-client data sharing
- Auto-cleanup on disconnect

🔧 Technical Changes:
- PlaylistManager refactored for multi-client support
- Socket events updated for per-client data
- Memory optimization for large user base"
```

### **🌿 Branch Strategy**
```bash
# ✅ Main branch: Production ready
main

# ✅ Feature branches: New features
feature/per-client-playlists
feature/mobile-optimization

# ✅ Hotfix branches: Critical fixes
hotfix/connection-issue
```

---

## 🧪 Testing Rules

### **✅ Required Testing**
1. **Server Connection**: Check if backend is running
2. **TikTok Connection**: Test with live TikTok stream
3. **Music Requests**: Test `!music` commands
4. **Multi-Client**: Test with multiple browser tabs
5. **Mobile**: Test on iOS/Android devices

### **📱 Mobile Testing Checklist**
- [ ] **iOS Safari**: Momentum scrolling works
- [ ] **Android Chrome**: Touch events respond
- [ ] **Rapid Comments**: Auto-scroll keeps up
- [ ] **Responsive Design**: All screen sizes

---

## 🚨 Security Rules

### **🔒 Security Guidelines**
- ✅ **No API Keys**: Don't commit API keys to Git
- ✅ **Environment Variables**: Use .env files
- ✅ **Input Validation**: Validate all user inputs
- ✅ **CORS Configuration**: Proper origin settings

### **⚠️ Security Checklist**
- [ ] No sensitive data in code
- [ ] Environment variables configured
- [ ] CORS origins set correctly
- [ ] Input sanitization implemented

---

## 📈 Performance Rules

### **⚡ Performance Guidelines**
- ✅ **Bundle Size**: Keep frontend < 100KB gzipped
- ✅ **Memory Usage**: Monitor per-client memory
- ✅ **Connection Limits**: Max 100 concurrent users
- ✅ **Cleanup**: Remove unused data

### **📊 Performance Targets**
- **Frontend Load**: < 3 seconds
- **Socket Connection**: < 1 second
- **TikTok Connection**: < 5 seconds
- **Memory per Client**: < 2MB

---

## 🔄 Update Rules

### **📦 Dependency Updates**
```bash
# ✅ Check for updates
yarn outdated

# ✅ Update dependencies
yarn upgrade

# ✅ Test after updates
yarn dev
yarn test
```

### **🔄 Breaking Changes**
- ✅ **Discuss**: Before making breaking changes
- ✅ **Document**: Update all documentation
- ✅ **Test**: Thorough testing required
- ✅ **Notify**: Inform team of changes

---

## 📞 Support Rules

### **🆘 Getting Help**
1. **Check Documentation**: README.md, PROJECT_RULES.md
2. **Check Issues**: GitHub issues
3. **Debug Endpoints**: Use /api/debug/* endpoints
4. **Console Logs**: Check browser + server logs

### **🐛 Reporting Bugs**
```markdown
**Bug Report Template:**

**Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Device: Desktop/Mobile

**Console Logs:**
Paste any error messages
```

---

## 📋 Checklist

### **🚀 Before Deployment**
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Performance targets met
- [ ] Security checklist completed

### **🔧 Before Committing**
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Comments added for complex logic
- [ ] Commit message follows format

### **📚 Before Release**
- [ ] README.md updated
- [ ] Version numbers updated
- [ ] Changelog created
- [ ] Deployment tested
- [ ] Rollback plan ready

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Yinnz 