import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

import TikTokConnection from './components/TikTokConnection';
import YouTubePlayer from './components/YouTubePlayer';
import Comments from './components/Comments';
import ManualAdd from './components/ManualAdd';
import Statistics from './components/Statistics';

function App() {
  const [socket, setSocket] = useState(null);
  const [playlist, setPlaylist] = useState({ songs: [], currentIndex: 0, currentSong: null });
  const [comments, setComments] = useState([]);
  const [tiktokStatus, setTiktokStatus] = useState({ isConnected: false, username: null });
  const [notifications, setNotifications] = useState([]);
  const [statistics, setStatistics] = useState({
    topCommenter: null,
    topRequester: null,
    totalSongsPlayed: 0,
    totalComments: 0,
    uniqueUsers: 0,
    mostRequestedSong: null,
    mostRequestedArtist: null,
    sessionDuration: 0,
    currentStreak: 0,
    totalRequests: 0
  });


  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('playlist-updated', (playlistData) => {
      setPlaylist(playlistData);
    });

    newSocket.on('comments-updated', (commentsData) => {
      setComments(commentsData);
    });

    newSocket.on('tiktok-status', (status) => {
      setTiktokStatus(status);
    });

    newSocket.on('tiktok-comment', (comment) => {
      console.log('New comment:', comment);
    });

    newSocket.on('comment-highlighted', (comment) => {
      addNotification(`Music request: ${comment.message}`, 'success');
    });

    newSocket.on('song-added', (data) => {
      addNotification(`Added "${data.song.title}" (requested by ${data.requester})`, 'success');
    });

    newSocket.on('song-not-found', (data) => {
      addNotification(`Could not find: ${data.request} (by ${data.requester})`, 'error');
    });

    newSocket.on('song-error', (data) => {
      addNotification(`Error: ${data.error}`, 'error');
    });

    newSocket.on('tiktok-connected', (data) => {
      addNotification(`Connected to @${data.username}`, 'success');
    });

    newSocket.on('tiktok-error', (data) => {
      const isAlreadyConnected = data.code === 'ALREADY_CONNECTED';
      const isSingleLimit = data.code === 'SINGLE_CONNECTION_LIMIT';
      
      let notificationType = 'error';
      let prefix = 'TikTok Error';
      
      if (isAlreadyConnected) {
        notificationType = 'warning';
        prefix = '⚠️ Already Connected';
      } else if (isSingleLimit) {
        notificationType = 'warning';
        prefix = '⚠️ Connection Limit';
      }
      
      addNotification(`${prefix}: ${data.error}`, notificationType);
    });

    newSocket.on('error', (error) => {
      addNotification(`Error: ${error}`, 'error');
    });

    newSocket.on('statistics-updated', (stats) => {
      setStatistics(stats);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5 notifications
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="App">
      {/* Server Status Indicator */}
      <div className="server-status">
        <div className={`server-indicator ${socket?.connected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span className="status-text">
            {socket?.connected ? 'Server Connected' : 'Server Disconnected'}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification ${notification.type}`}
              onClick={() => removeNotification(notification.id)}
            >
              <span>{notification.message}</span>
              <button className="notification-close">×</button>
            </div>
          ))}
        </div>
      )}

      <main className="app-content">
        <div className="left-panel">
          <TikTokConnection socket={socket} status={tiktokStatus} />
          <ManualAdd socket={socket} />
          <Statistics statistics={statistics} />
        </div>

        <div className="center-panel">
          <div className="center-instructions">
            <div className="instructions-content">
              <div className="compact-help">
                <span>💬 Type in TikTok Live: <code>!music Song + Artist</code></span>
                <span className="creator-mini">by Yinnz</span>
              </div>
            </div>
          </div>
          
          <YouTubePlayer 
            socket={socket} 
            currentSong={playlist.currentSong}
            playlist={playlist}
          />
        </div>

        <div className="right-panel">
          <Comments comments={comments} />
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Yinnz - TikTok Live Music Player</p>
      </footer>
    </div>
  );
}

export default App; 