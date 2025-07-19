# 🎵 TikTok Live Music Player

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/VuongwNguyen/tiktok-live-music-app)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

> A real-time music streaming application that transforms TikTok Live interactions into an automated DJ experience. Users can request songs through TikTok Live chat, and the app automatically finds and plays them via YouTube with comprehensive live analytics and modern UI.

**Created by [Yinnz](https://github.com/VuongwNguyen) 👨‍💻**

---

## 🌟 Features

### 🎪 **TikTok Live Integration**
- **Single connection per user**: Each user can connect to 1 TikTok Live stream at a time
- **Global uniqueness**: Each TikTok account can only be connected by one user globally
- Real-time connection to any TikTok Live stream
- Automatic comment parsing for music requests
- Live comment display with highlighting for music requests
- **Simple disconnect**: Easy one-click disconnect to switch accounts
- **Auto-cleanup**: Comments and requests cleared when user disconnects
- Connection status monitoring with visual indicators

### 🎵 **Smart Music Management**
- **Per-client playlists**: Each user has their own independent playlist
- **No playlist sharing**: Songs requested by one user don't appear in others' playlists
- Automatic YouTube search for requested songs
- Intelligent song matching with multiple format support
- Auto-playing playlist with seamless transitions
- Manual song addition and playlist controls
- Integrated horizontal scrolling playlist with thumbnails
- **Auto-cleanup**: Client playlists removed when user disconnects

### 🎛️ **Advanced Player Controls**
- **Ultra-compact controls**: Play/Pause toggle, Replay, Next, Clear
- **Circular button design**: Modern, space-efficient interface
- **Auto-next functionality**: Seamless song transitions
- **Error handling**: Auto-skip on player errors
- **Tooltips**: Hover descriptions for all controls

### 📊 **Live Analytics Dashboard**
- **👑 Top Commenter**: Most active user in chat
- **🎵 Top Requester**: User with most music requests
- **▶️ Songs Played**: Total tracks played in session
- **💬 Total Comments**: Real-time comment counter
- **👥 Unique Users**: Number of distinct participants
- **⏱️ Session Time**: Automatic session duration tracking
- **🔥 Current Streak**: Consecutive songs played
- **🏆 Most Popular**: Top requested songs and artists

### 📱 **Mobile-Optimized Interface**
- **Ultra-smooth scrolling**: Optimized for rapid comment streams
- **Touch-optimized**: Native mobile scroll behavior on iOS/Android
- **Hardware acceleration**: 60fps smooth performance
- **Responsive design**: Adaptive layout for all screen sizes
- **Zero-latency auto-scroll**: Instant comment following during bursts

### 🎮 **Modern User Interface**
- **3-panel layout**: Organized workspace with proper alignment
- **Responsive design**: Perfect on desktop, tablet, and mobile
- **Real-time sync**: Comments height matches Music Player
- **Gradient themes**: Beautiful visual effects with blur
- **Sticky positioning**: Optimized scrolling experience
- **Status indicators**: Server connection and TikTok status

### ⚡ **Development & Testing**
- **Cross-platform compatibility**: Windows PowerShell support
- **Hot reload**: Instant development updates
- **Error notifications**: Real-time debugging assistance
- **Statistics tracking**: Comprehensive analytics for streamers

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Yarn** package manager (recommended) or **npm**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Windows**: PowerShell or Command Prompt
- **macOS/Linux**: Terminal

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yinnz/tiktok-live-music-app.git
   cd tiktok-live-music-app
   ```

2. **Install dependencies**
   ```bash
   yarn install-deps
   # or
   npm run install-deps
   ```

3. **Start the application**
   
   **For Windows PowerShell:**
   ```powershell
   # Open two PowerShell windows/tabs
   
   # Terminal 1 - Backend
   cd backend; yarn dev
   
   # Terminal 2 - Frontend  
   cd frontend; yarn dev
   ```
   
   **For macOS/Linux or Git Bash:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Access the application**
   - 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
   - 🔧 **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 📖 How to Use

### 1. **Connect to TikTok Live**
- Enter a TikTok username (without @) in the left panel
- Click "Connect to Live" button
- **Single connection limit**: You can only connect to 1 TikTok account at a time
- **Global uniqueness**: If someone else is already connected to a TikTok account, you'll get a warning
- **Easy switching**: Disconnect current connection to switch to a different account
- Monitor connection status in the green/red indicator
- Watch for "Server Connected" status in top-left corner

### 2. **Request Songs from TikTok Live**
TikTok Live viewers can request songs using these formats:
```
!music Despacito + Luis Fonsi
!music Shape of You - Ed Sheeran  
!music Gangnam Style by PSY
!music Never Gonna Give You Up
```

### 3. **Monitor Live Analytics**
The Statistics panel (left sidebar) provides real-time insights:
- **Top users** who are most active in your stream
- **Popular songs** that are frequently requested
- **Session metrics** for stream performance analysis
- **Engagement tracking** with comment and request counts

### 4. **Control Playback**
- **▶️/⏸️**: Toggle play/pause with smart state detection
- **🔄**: Replay current song from beginning
- **⏭️**: Skip to next song in queue
- **🗑️**: Clear entire playlist
- **❌**: Remove individual songs from playlist cards

### 5. **Manual Song Management**
- **Add songs manually**: Use the form in left panel
- **Playlist overview**: Horizontal scrolling cards with thumbnails
- **Song details**: View requester, channel, and duration info
- **Quick removal**: Click ❌ on any playlist item

---

## 🏗️ Architecture

### Backend (`/backend`)
```
Node.js + Express.js + Socket.IO + Statistics Engine
├── 📡 TikTok Manager - Real-time chat monitoring
├── 🔍 YouTube Manager - Automatic song discovery  
├── 🎵 Playlist Manager - Queue and playback control
├── 📊 Statistics Manager - Live analytics tracking
└── 🔄 WebSocket Server - Real-time client communication
```

### Frontend (`/frontend`)
```
React 18 + Modern CSS + YouTube Player API + Analytics UI
├── 🎮 YouTube Player - Integrated playlist & compact controls
├── 💬 Comments Component - Live chat with 80vh height
├── 📊 Statistics Component - Real-time analytics dashboard
├── ➕ Manual Add - Song addition form
├── 📺 TikTok Connection - Live stream integration
└── 🔌 Socket.IO Client - Real-time bidirectional updates
```

### Key Technologies
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend Framework** | Express.js | RESTful API and static serving |
| **Real-time Communication** | Socket.IO | Bidirectional client-server updates |
| **TikTok Integration** | tiktok-live-connector | Live chat monitoring & parsing |
| **Music Search** | youtube-search-api | Song discovery and metadata |
| **Analytics Engine** | Custom StatisticsManager | Live metrics tracking |
| **Frontend Framework** | React 18 + Hooks | Modern UI with state management |
| **Video Player** | YouTube Player API | High-quality music playback |
| **Styling** | Modern CSS + Flexbox/Grid | Responsive 3-panel layout |
| **Development Tools** | Yarn + Hot Reload | Cross-platform development |

---

## 🎯 Command Reference

### Development Commands

**Windows PowerShell:**
```powershell
# Start backend server
cd backend; yarn dev

# Start frontend development server (in new terminal)
cd frontend; yarn dev

# Install all dependencies
yarn install-deps
```

**macOS/Linux/Git Bash:**
```bash
# Start both frontend and backend simultaneously
yarn dev

# Install all dependencies (root, backend, frontend)  
yarn install-deps

# Run only backend server
yarn backend

# Run only frontend development server
yarn frontend
```

### Production Commands
```bash
# Build frontend for production
yarn build

# Start production server
yarn start
```

### Music Request Formats
| Format | Example | Description |
|--------|---------|-------------|
| `!music Song + Artist` | `!music Despacito + Luis Fonsi` | **Recommended format** |
| `!music Song - Artist` | `!music Shape of You - Ed Sheeran` | Alternative separator |
| `!music Song by Artist` | `!music Gangnam Style by PSY` | Natural language |
| `!music Song Name` | `!music Never Gonna Give You Up` | Song only (no artist) |

---

## 📊 Analytics Features

### Real-time Statistics Tracking
The app automatically tracks comprehensive analytics:

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| **Top Commenter** | User with most chat messages | Real-time |
| **Top Requester** | User with most music requests | Real-time |
| **Songs Played** | Total tracks played this session | Per song |
| **Total Comments** | All chat messages received | Real-time |
| **Unique Users** | Distinct usernames seen | Real-time |
| **Session Duration** | Time since app started | Every 30 seconds |
| **Current Streak** | Consecutive songs played | Per song |
| **Music Requests** | Total `!music` commands | Real-time |
| **Popular Songs** | Most frequently requested tracks | Per request |
| **Popular Artists** | Most frequently requested artists | Per request |

### Statistics Dashboard
- **Grid layout**: 2x4 responsive card design
- **Hover effects**: Interactive visual feedback
- **Mobile optimized**: Single column on small screens
- **Color coding**: Visual hierarchy with status colors
- **Auto-updates**: Live data refresh every 30 seconds

---

## 🛠️ Configuration

### Environment Variables
Create a `.env` file in the `/backend` directory:
```env
# Server Configuration
PORT=5000

# TikTok Live Configuration  
# Add any additional TikTok settings here

# YouTube API Configuration (optional)
# YOUTUBE_API_KEY=your_api_key_here

# Statistics Configuration
STATS_UPDATE_INTERVAL=30000  # 30 seconds
```

### Port Configuration
- **Frontend**: Default port `3000` (React development server)
- **Backend**: Default port `5000` (Express server)
- **WebSocket**: Automatic on backend port with Socket.IO
- **Proxy**: Frontend automatically proxies API requests to backend

### Layout Configuration
```css
/* Responsive Breakpoints */
Desktop: 3-panel layout (Left: 300px, Center: 1fr, Right: 350px)
Tablet: Stacked layout with responsive heights
Mobile: Single column with optimized spacing

/* Panel Heights */
Comments: 80vh (80% of viewport height)
Music Player: fit-content (automatic based on content)
Statistics: Auto-sizing grid layout
```

---

## 🐛 Troubleshooting

### TikTok Connection Issues
```bash
❌ Problem: Cannot connect to TikTok Live
✅ Solutions:
- Verify username is correct (without @ symbol)
- Ensure user is currently live streaming
- Check server status indicator (top-left corner)
- Try refreshing the connection
- Some private accounts may have restrictions
```

### Statistics Not Updating
```bash
❌ Problem: Analytics show zeros or outdated data
✅ Solutions:
- Verify TikTok connection is active
- Check server connection status
- Refresh the page to reset statistics
- Ensure comments are being received
- Check browser console for errors (F12)
```

### Layout Alignment Issues
```bash
❌ Problem: Comments panel not aligned with Music Player
✅ Solutions:
- Check browser zoom level (should be 100%)
- Clear browser cache and refresh (Ctrl+F5)
- Resize browser window to trigger responsive layout
- Ensure both panels have proper heights set
```

### PowerShell Command Issues
```bash
❌ Problem: Commands fail in Windows PowerShell
✅ Solutions:
- Use semicolon (;) instead of && for command chaining
- Run commands in separate terminal windows/tabs
- Example: "cd frontend; yarn dev" instead of "cd frontend && yarn dev"
- Consider using Git Bash as alternative
```

### YouTube Player Issues
```bash
❌ Problem: Songs not playing or loading
✅ Solutions:  
- Refresh the page (Ctrl+F5)
- Check browser console for errors (F12)
- Verify internet connection for YouTube access
- Some videos may be region-restricted
- Try clearing browser cache and cookies

❌ Problem: Playlist empty or not updating
✅ Solutions:
- Check if you're connected to TikTok Live
- Verify song requests use correct format: !music Song Name
- Check playlist stats: curl localhost:5000/api/debug/playlists
- Clear playlist and try adding songs manually
```

### Mobile Performance Issues
```bash
❌ Problem: Slow scrolling or lag on mobile
✅ Solutions:
- Close other browser tabs to free memory
- Use native browser (Safari on iOS, Chrome on Android)
- Check network connection quality
- Clear browser cache and reload

❌ Problem: Comments not auto-scrolling on mobile
✅ Solutions:
- Don't scroll manually during comment bursts
- Tap the "New messages" button to jump to bottom
- Mobile optimization activates automatically
- Use momentum scrolling (swipe and release)
```

---

## 🧪 Testing & Quality Assurance

### 🎯 **Multi-Client Testing Scenarios**

#### **Scenario 1: TikTok Connection Isolation**
```bash
# Test global uniqueness protection
1. Client A connects to @user123 ✅
2. Client B tries @user123 → ❌ "Already connected by another user"
3. Client B connects to @user456 ✅
4. Client A disconnects → @user123 becomes available
5. Client B connects to @user123 ✅

# Verification:
curl localhost:5000/api/debug/connections
```

#### **Scenario 2: Per-Client Playlist Isolation**
```bash
# Test playlist separation
1. Client A: Connects to @user123, requests "Despacito"
2. Client B: Connects to @user456, requests "Shape of You"
3. Expected: Client A only sees "Despacito", Client B only sees "Shape of You"
4. Client A disconnects → Only Client A's playlist cleared
5. Client B's playlist remains intact

# Verification:
curl localhost:5000/api/debug/playlists
```

#### **Scenario 3: Single Connection Limit**
```bash
# Test one connection per client
1. Client A connects to @user123 ✅
2. Client A tries @user456 → ❌ "You can only connect to 1 TikTok account"
3. Client A disconnects @user123
4. Client A connects to @user456 ✅
```

### 📱 **Mobile Testing Checklist**

#### **Touch & Scroll Performance**
- [ ] **iOS Safari**: Momentum scrolling works smoothly
- [ ] **Android Chrome**: Touch events respond instantly
- [ ] **Rapid Comments**: Auto-scroll keeps up with burst comments
- [ ] **Touch Interference**: Manual scroll disables auto-scroll temporarily
- [ ] **Velocity Detection**: Fast swipes get longer delay before auto-scroll resumes

#### **Responsive Design**
- [ ] **Portrait Mode**: All panels stack properly
- [ ] **Landscape Mode**: 3-panel layout on tablets
- [ ] **Small Screens**: Touch targets meet 44px minimum
- [ ] **Text Input**: No zoom on focus (16px font minimum)

### 🔧 **Debug & Monitoring Tools**

#### **Health Checks**
```bash
# Server health
curl localhost:5000/api/health

# Active TikTok connections
curl localhost:5000/api/debug/connections

# Playlist statistics
curl localhost:5000/api/debug/playlists
```

#### **Performance Monitoring**
```bash
# Browser Console (F12)
- Check for JavaScript errors
- Monitor network requests
- Watch WebSocket connection status

# Real-time Statistics
- Session duration tracking
- Comment/request counters
- User engagement metrics
```

#### **Load Testing**
```bash
# Multiple client simulation
1. Open 5+ browser tabs/windows
2. Connect each to different TikTok accounts
3. Generate rapid song requests
4. Monitor memory usage and performance
5. Verify no data leaks between clients
```

---

## 🔧 Development

### Project Structure
```
tiktok-live-music-app/
├── 📦 package.json                 # Root package with scripts
├── 📚 README.md                    # This comprehensive documentation
├── 🔧 backend/                     # Node.js backend services
│   ├── 📦 package.json            # Backend dependencies
│   ├── 🚀 index.js                # Express server + Socket.IO setup
│   └── 🛠️ services/               # Business logic modules
│       ├── 📺 tiktokManager.js     # TikTok Live integration
│       ├── 🔍 youtubeManager.js    # YouTube search logic
│       ├── 🎵 playlistManager.js   # Playlist queue management
│       └── 📊 statisticsManager.js # Live analytics engine
├── ⚛️ frontend/                    # React frontend application 
│   ├── 📦 package.json            # Frontend dependencies
│   ├── 🌐 public/                 # Static assets
│   └── 💻 src/                     # React source code
│       ├── 🎮 App.js               # Main application with 3-panel layout
│       ├── 🎨 App.css              # Global styles + responsive design
│       └── 🧩 components/          # React components
│           ├── 📺 TikTokConnection.js  # Live stream connection
│           ├── ▶️ YouTubePlayer.js     # Music player + playlist
│           ├── 💬 Comments.js          # Live chat display
│           ├── ➕ ManualAdd.js          # Manual song addition
│           └── 📊 Statistics.js        # Real-time analytics
└── 📝 .gitignore                  # Git ignore rules
```

### New Components Added
- **📊 Statistics.js**: Live analytics dashboard with grid layout
- **📊 StatisticsManager.js**: Backend service for tracking metrics
- **🎵 Per-Client PlaylistManager**: Individual playlists for each user
- **📱 Mobile-Optimized Comments**: Ultra-smooth scroll with touch optimization
- **🎛️ Compact Controls**: Circular buttons with smart toggling
- **🔧 Debug Endpoints**: Admin tools for monitoring connections and playlists

### Socket.IO Events (Updated)
| Event | Direction | Data | Description |
|-------|-----------|------|-------------|
| `connect-tiktok` | Client → Server | `username` | Connect to TikTok Live |
| `disconnect-tiktok` | Client → Server | `username?` | Disconnect current TikTok connection |
| `add-song-manual` | Client → Server | `{song, artist}` | Add song manually |
| `remove-song` | Client → Server | `index` | Remove song from playlist |
| `clear-playlist` | Client → Server | - | Clear entire playlist |
| `next-song` | Client → Server | - | Skip to next song |
| `playlist-updated` | Server → Client | `playlist` | Playlist state change |
| `tiktok-status` | Server → Client | `status` | Single-user connection status |
| `tiktok-disconnected` | Server → Client | `username` | Specific user disconnected |
| `comments-updated` | Server → Client | `comments` | Live chat updates |
| `statistics-updated` | Server → Client | `stats` | **NEW** Analytics data |
| `song-added` | Server → Client | `songData` | Song successfully added |

### API Endpoints
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/health` | GET | Server health check | `{ status: 'OK', timestamp: '...' }` |
| `/api/debug/connections` | GET | **Admin Debug**: View all connected TikTok accounts | `{ connectedAccounts: [...], totalConnections: n }` |
| `/api/debug/playlists` | GET | **Admin Debug**: View playlist statistics across all clients | `{ totalClients: n, totalSongs: n, clientCount: n }` |

**Debug Endpoint Usage:**
```bash
# Check which TikTok accounts are currently connected
curl http://localhost:5000/api/debug/connections

# Check playlist statistics across all clients
curl http://localhost:5000/api/debug/playlists

# Example responses:
{
  "connectedAccounts": ["user123", "streamer456"],
  "totalConnections": 2,
  "timestamp": "2024-01-15T10:30:00.000Z"
}

{
  "totalClients": 5,
  "totalSongs": 23,
  "clientCount": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

| `song-not-found` | Server → Client | `{request, requester}` | Song search failed |

### Architecture Updates (v2.0)

#### 🏗️ **Per-Client Architecture**
```
Each Client Session:
├── 🎪 TikTok Connection (1:1 mapping)
│   ├── Unique TikTok account per client
│   ├── Comments filtered by client
│   └── Auto-cleanup on disconnect
├── 🎵 Individual Playlist
│   ├── Songs isolated per client
│   ├── Independent playback controls
│   └── No cross-client interference
└── 📊 Global Statistics (shared)
    ├── Session-wide analytics
    ├── Top commenters/requesters
    └── Performance metrics
```

#### 🔧 **Data Isolation**
- **✅ Client-Specific**: TikTok connections, playlists, comments
- **✅ Global Shared**: Statistics, performance metrics
- **✅ Auto-Cleanup**: All client data removed on disconnect
- **✅ Memory Efficient**: No data leaks or cross-contamination

---

## 🎨 UI/UX Improvements

### Modern Interface Design
- **Circular control buttons**: Space-efficient, modern appearance
- **Smart tooltips**: Hover descriptions for all interactive elements
- **Gradient backgrounds**: Beautiful visual depth with blur effects
- **Status indicators**: Clear visual feedback for all connections
- **Responsive typography**: Optimized text sizes across devices

### Layout Optimization
```
┌─────────────────────────────────────────────────────────────┐
│  🟢 Server Connected                                        │
├─────────────┬─────────────────────────┬─────────────────────┤
│ 📺 TikTok   │    💬 Instructions      │ 💬 Live Comments    │
│ Connection  │ ┌─────────────────────┐ │ (80vh height)       │
├─────────────┤ │ 🎵 Music Player     │ │                     │
│ ➕ Manual   │ │ ○ ○ ○ ○ Controls   │ │ [Live chat stream]  │
│ Add Song    │ │ 🎵 🎵 🎵 Playlist   │ │                     │
├─────────────┤ └─────────────────────┘ │                     │
│ 📊 Live     │                         │                     │
│ Statistics  │                         │                     │
│ [Analytics] │                         │                     │
└─────────────┴─────────────────────────┴─────────────────────┘
```

### Responsive Breakpoints
- **Desktop** (1200px+): Full 3-panel layout with statistics
- **Tablet** (768px-1199px): Stacked panels with responsive heights  
- **Mobile** (<768px): Single column with optimized spacing

---

## 📄 License

This project is created for educational and entertainment purposes. Please ensure you comply with:
- [TikTok's Terms of Service](https://www.tiktok.com/legal/terms-of-service)
- [YouTube's Terms of Service](https://www.youtube.com/t/terms)
- [YouTube API Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow the existing code style and structure
- Test on multiple browsers and screen sizes
- Ensure PowerShell compatibility for Windows users
- Update documentation for new features
- Include analytics tracking for new user interactions

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/Yinnz/tiktok-live-music-app/issues)
3. Create a new issue with detailed information
4. Include browser console logs and system information
5. Join our community discussions

## 🙏 Acknowledgments

- **TikTok Live Community** - For inspiring real-time interactive experiences
- **YouTube** - For providing the music streaming platform
- **Open Source Community** - For the amazing libraries and tools
- **Streamers and Viewers** - For testing and providing valuable feedback
- **Analytics Community** - For insights on meaningful metrics tracking

---

<div align="center">

**Built with ❤️ by [Yinnz](https://github.com/VuongwNguyen)**

*Transforming TikTok Live streaming with seamless music requests and comprehensive analytics*

[⭐ Star this project](https://github.com/VuongwNguyen/tiktok-live-music-app) • [🐛 Report Bug](https://github.com/VuongwNguyen/tiktok-live-music-app/issues) • [💡 Request Feature](https://github.com/VuongwNguyen/tiktok-live-music-app/issues)

**Version 2.0.0** - Now with Live Analytics Dashboard and Modern UI

</div> 

---

## 🚀 Production Deployment

### 📋 **Environment Configuration**

#### **Backend Environment Variables**
```bash
# Copy example environment file
cp example.env .env

# Configure variables:
PORT=5000                    # Server port
NODE_ENV=production         # Environment mode
TZ=UTC                      # Timezone setting

# Optional optimizations:
MAX_CONNECTIONS=100         # Maximum concurrent clients
PLAYLIST_CLEANUP_INTERVAL=300000  # 5 minutes cleanup
COMMENT_HISTORY_LIMIT=100   # Comments per client
```

#### **Frontend Build Configuration**
```bash
# Production build
cd frontend
npm run build

# Build output:
build/
├── index.html              # Main entry point
├── static/js/main.js       # Optimized JavaScript (~73KB)
├── static/css/main.css     # Optimized CSS (~2.4KB)
└── asset-manifest.json     # Asset mapping
```

### 🐳 **Docker Deployment**

#### **Build & Run**
```bash
# Build Docker image
docker build -t tiktok-live-music-app .

# Run with environment
docker run -d \
  -p 5000:5000 \
  -e NODE_ENV=production \
  --name tiktok-music-app \
  tiktok-live-music-app

# Check logs
docker logs tiktok-music-app

# Monitor performance
docker stats tiktok-music-app
```

#### **Docker Compose**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 🔒 **Security & Performance**

#### **Production Optimizations**
```bash
# Enable compression
npm install compression --save

# Rate limiting
npm install express-rate-limit --save

# Security headers
npm install helmet --save

# Process management
npm install pm2 -g
pm2 start backend/index.js --name "tiktok-music-app"
```

#### **Monitoring & Alerts**
```bash
# Application monitoring
curl localhost:5000/api/health
curl localhost:5000/api/debug/connections
curl localhost:5000/api/debug/playlists

# System monitoring
htop                        # CPU/Memory usage
netstat -tulpn | grep 5000 # Port status
tail -f logs/app.log       # Application logs
```

### 📊 **Performance Benchmarks**

#### **Expected Capacity**
- **Concurrent Users**: 50-100 simultaneous clients
- **Memory Usage**: ~100MB base + 2MB per active client
- **CPU Usage**: <10% on modern servers
- **Network**: ~1KB/s per client for real-time updates

#### **Scaling Considerations**
- **Per-Client Memory**: Each client maintains isolated playlist (~1-2MB)
- **WebSocket Connections**: One per client for real-time updates
- **TikTok Rate Limits**: Consider API rate limiting for popular streams
- **YouTube API Quota**: Monitor daily quota usage for song searches

--- 