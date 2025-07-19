const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const TikTokManager = require('./services/tiktokManager');
const YouTubeManager = require('./services/youtubeManager');
const PlaylistManager = require('./services/playlistManager');
const StatisticsManager = require('./services/statisticsManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Managers
const statisticsManager = new StatisticsManager();
const playlistManager = new PlaylistManager();
const youtubeManager = new YouTubeManager();
const tiktokManager = new TikTokManager(io, playlistManager, youtubeManager, statisticsManager);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current state to new client
  socket.emit('playlist-updated', playlistManager.getPlaylist());
  socket.emit('tiktok-status', tiktokManager.getStatus());
  socket.emit('statistics-updated', statisticsManager.getStatistics());
  
  // Handle TikTok connection
  socket.on('connect-tiktok', (username) => {
    tiktokManager.connect(username);
  });
  
  socket.on('disconnect-tiktok', () => {
    tiktokManager.disconnect();
  });
  
  // Handle manual song addition
  socket.on('add-song-manual', async (data) => {
    try {
      const { song, artist } = data;
      const videoId = await youtubeManager.searchSong(song, artist);
      if (videoId) {
        const newSong = {
          videoId,
          title: `${song} - ${artist}`,
          requester: 'Manual',
          duration: null,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          channel: 'YouTube'
        };
        playlistManager.addSong(newSong);
        statisticsManager.addSongPlayed(newSong);
        io.emit('playlist-updated', playlistManager.getPlaylist());
        io.emit('statistics-updated', statisticsManager.getStatistics());
      } else {
        socket.emit('error', 'Could not find song');
      }
    } catch (error) {
      console.error('Error adding song manually:', error);
      socket.emit('error', 'Failed to add song manually');
    }
  });
  
  // Handle playlist controls
  socket.on('remove-song', (index) => {
    playlistManager.removeSong(index);
    io.emit('playlist-updated', playlistManager.getPlaylist());
  });
  
  socket.on('clear-playlist', () => {
    playlistManager.clearPlaylist();
    statisticsManager.resetStreak();
    io.emit('playlist-updated', playlistManager.getPlaylist());
    io.emit('statistics-updated', statisticsManager.getStatistics());
  });
  
  socket.on('next-song', () => {
    playlistManager.nextSong();
    io.emit('playlist-updated', playlistManager.getPlaylist());
    io.emit('play-next');
  });
  
  // Quick add test songs
  socket.on('quick-add', async (songName) => {
    try {
      let song, artist;
      switch(songName) {
        case 'despacito':
          song = 'Despacito';
          artist = 'Luis Fonsi';
          break;
        case 'shape':
          song = 'Shape of You';
          artist = 'Ed Sheeran';
          break;
        case 'gangnam':
          song = 'Gangnam Style';
          artist = 'PSY';
          break;
        default:
          return;
      }
      
      const videoId = await youtubeManager.searchSong(song, artist);
      if (videoId) {
        const newSong = {
          videoId,
          title: `${song} - ${artist}`,
          requester: 'Quick Add',
          duration: null,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          channel: 'YouTube'
        };
        playlistManager.addSong(newSong);
        statisticsManager.addSongPlayed(newSong);
        io.emit('playlist-updated', playlistManager.getPlaylist());
        io.emit('statistics-updated', statisticsManager.getStatistics());
      }
    } catch (error) {
      socket.emit('error', 'Failed to quick add song');
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Update statistics every 30 seconds
setInterval(() => {
  io.emit('statistics-updated', statisticsManager.getStatistics());
}, 30000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:3000`);
  console.log(`Backend: http://localhost:${PORT}`);
}); 