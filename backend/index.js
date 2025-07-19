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
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.SOCKET_CORS_ORIGIN_PROD?.split(',') || ["https://your-app-name.vercel.app"]
      : process.env.SOCKET_CORS_ORIGIN_DEV || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN_PROD?.split(',') || ["https://your-app-name.vercel.app"]
    : process.env.CORS_ORIGIN_DEV || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Managers
const statisticsManager = new StatisticsManager();
const playlistManager = new PlaylistManager();
const youtubeManager = new YouTubeManager();
const tiktokManager = new TikTokManager(io, playlistManager, youtubeManager, statisticsManager);

// Socket.IO connection
io.on('connection', (socket) => {
  // Send initial data to client
  socket.emit('tiktok-status', tiktokManager.getClientStatus(socket.id));
  socket.emit('statistics-updated', statisticsManager.getStatistics());
  socket.emit('playlist-updated', playlistManager.getPlaylist(socket.id));
  
  // Send comments for this client
  const clientComments = tiktokManager.getComments().filter(c => c.clientId === socket.id);
  socket.emit('comments-updated', clientComments);
  
  console.log('Client connected:', socket.id);

  // Handle TikTok connection
  socket.on('connect-tiktok', (username) => {
    tiktokManager.connect(username, socket.id);
  });
  
  socket.on('disconnect-tiktok', (username = null) => {
    tiktokManager.disconnect(socket.id, username);
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
        playlistManager.addSong(newSong, socket.id);
        statisticsManager.addSongPlayed(newSong);
        
        // Emit only to this client
        socket.emit('playlist-updated', playlistManager.getPlaylist(socket.id));
        socket.emit('song-added', {
          song: newSong,
          requester: 'Manual',
          originalRequest: `${song} - ${artist}`
        });
        
        // Global statistics still broadcast
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
    try {
      playlistManager.removeSong(index, socket.id);
      socket.emit('playlist-updated', playlistManager.getPlaylist(socket.id));
    } catch (error) {
      console.error('Error removing song:', error);
      socket.emit('error', 'Failed to remove song');
    }
  });
  
  socket.on('clear-playlist', () => {
    try {
      playlistManager.clearPlaylist(socket.id);
      socket.emit('playlist-updated', playlistManager.getPlaylist(socket.id));
    } catch (error) {
      console.error('Error clearing playlist:', error);
      socket.emit('error', 'Failed to clear playlist');
    }
  });
  
  socket.on('next-song', () => {
    try {
      playlistManager.nextSong(socket.id);
      socket.emit('playlist-updated', playlistManager.getPlaylist(socket.id));
      socket.emit('play-next');
    } catch (error) {
      console.error('Error going to next song:', error);
      socket.emit('error', 'Failed to go to next song');
    }
  });

  // Client disconnect cleanup
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Clean up TikTok connections for this client
    tiktokManager.handleClientDisconnect(socket.id);
    
    // Clean up client's playlist
    playlistManager.removeClientPlaylist(socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check global TikTok connections
app.get('/api/debug/connections', (req, res) => {
  const globalConnections = tiktokManager.getGlobalConnections();
  res.json({
    ...globalConnections,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check playlist statistics
app.get('/api/debug/playlists', (req, res) => {
  const playlistStats = playlistManager.getStats();
  res.json({
    ...playlistStats,
    timestamp: new Date().toISOString()
  });
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
  if (process.env.NODE_ENV === 'production') {
    console.log(`Production mode - App deployed on Vercel`);
  } else {
    console.log(`Frontend: http://localhost:3000`);
    console.log(`Backend: http://localhost:${PORT}`);
  }
}); 