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
- Real-time connection to any TikTok Live stream
- Automatic comment parsing for music requests
- Live comment display with highlighting for music requests
- Connection status monitoring with visual indicators

### 🎵 **Smart Music Management**
- Automatic YouTube search for requested songs
- Intelligent song matching with multiple format support
- Auto-playing playlist with seamless transitions
- Manual song addition and playlist controls
- Integrated horizontal scrolling playlist with thumbnails

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

### 📱 **Modern User Interface**
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
- **🎵 Integrated Playlist**: Merged into YouTubePlayer component
- **🎛️ Compact Controls**: Circular buttons with smart toggling

### Socket.IO Events (Updated)
| Event | Direction | Data | Description |
|-------|-----------|------|-------------|
| `connect-tiktok` | Client → Server | `username` | Connect to TikTok Live |
| `disconnect-tiktok` | Client → Server | - | Disconnect from TikTok Live |
| `add-song-manual` | Client → Server | `{song, artist}` | Add song manually |
| `remove-song` | Client → Server | `index` | Remove song from playlist |
| `clear-playlist` | Client → Server | - | Clear entire playlist |
| `next-song` | Client → Server | - | Skip to next song |
| `playlist-updated` | Server → Client | `playlist` | Playlist state change |
| `tiktok-status` | Server → Client | `status` | TikTok connection status |
| `comments-updated` | Server → Client | `comments` | Live chat updates |
| `statistics-updated` | Server → Client | `stats` | **NEW** Analytics data |
| `song-added` | Server → Client | `songData` | Song successfully added |
| `song-not-found` | Server → Client | `{request, requester}` | Song search failed |

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