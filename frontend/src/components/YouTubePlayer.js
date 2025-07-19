import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({ socket, currentSong, playlist }) => {
  const [playerState, setPlayerState] = useState('stopped');
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('play-next', () => {
        // Force player to load new song
        if (playerRef.current && currentSong) {
          playerRef.current.loadVideoById(currentSong.videoId);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('play-next');
      }
    };
  }, [socket, currentSong]);

  

  const opts = {
    height: '315',
    width: '100%',
    playerVars: {
      autoplay: 0, // Start with autoplay disabled for better compatibility
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      enablejsapi: 1,
      fs: 1,
      playsinline: 1
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    setError(null);
    console.log('YouTube Player ready');
    
    // Auto-play the first song if available
    if (currentSong && currentSong.videoId) {
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.playVideo();
        }
      }, 1000);
    }
  };

  const onStateChange = (event) => {
    const { data } = event;
    
    // YouTube Player states:
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    
    switch (data) {
      case -1:
        setPlayerState('unstarted');
        break;
      case 0:
        setPlayerState('ended');
        handleSongEnded();
        break;
      case 1:
        setPlayerState('playing');
        setError(null);
        break;
      case 2:
        setPlayerState('paused');
        break;
      case 3:
        setPlayerState('buffering');
        break;
      case 5:
        setPlayerState('cued');
        break;
      default:
        setPlayerState('unknown');
    }
  };

  const handleSongEnded = () => {
    console.log('Song ended, auto-playing next song');
    
    // Auto-next with a small delay
    setTimeout(() => {
      if (socket) {
        socket.emit('next-song');
      }
    }, 1000);
  };

  const onError = (event) => {
    console.error('YouTube Player error:', event.data);
    setError(`Player error: ${event.data}`);
    
    // Auto-skip on error after a delay
    setTimeout(() => {
      if (socket) {
        socket.emit('next-song');
      }
    }, 2000);
  };

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  const handleReplay = () => {
    if (playerRef.current && currentSong) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
  };

  const handleNext = () => {
    if (socket) {
      socket.emit('next-song');
    }
  };

  const handleRemoveSong = (index) => {
    if (socket) {
      socket.emit('remove-song', index);
    }
  };

  const handleClearPlaylist = () => {
    if (socket && window.confirm('Are you sure you want to clear the entire playlist?')) {
      socket.emit('clear-playlist');
    }
  };

  const getPlayerStateDisplay = () => {
    switch (playerState) {
      case 'playing':
        return '▶️ Playing';
      case 'paused':
        return '⏸️ Paused';
      case 'buffering':
        return '⏳ Buffering';
      case 'ended':
        return '⏹️ Ended';
      case 'cued':
        return '⏸️ Ready';
      default:
        return '⏹️ Stopped';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    return ` (${duration})`;
  };

  const getThumbnailUrl = (song) => {
    if (song.thumbnail) return song.thumbnail;
    return `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`;
  };

  return (
    <div className="panel youtube-player">
      <h3>🎵 Music Player</h3>
      
      {currentSong ? (
        <div className="player-container">
          <div className="current-song-info">
            <h4 className="song-title">{currentSong.title}</h4>
            <p className="song-requester">Requested by: {currentSong.requester}</p>
            {currentSong.channel && (
              <p className="song-channel">Channel: {currentSong.channel}</p>
            )}
          </div>

          <div className="player-wrapper">
            <YouTube
              videoId={currentSong.videoId}
              opts={opts}
              onReady={onReady}
              onStateChange={onStateChange}
              onError={onError}
            />
          </div>

          <div className="player-controls-section">
            <div className="player-controls">
              <button
                className="btn"
                onClick={playerState === 'playing' ? handlePause : handlePlay}
                disabled={!isReady}
                title={playerState === 'playing' ? 'Pause' : 'Play'}
              >
                {playerState === 'playing' ? '⏸️' : '▶️'}
              </button>
              <button
                className="btn"
                onClick={handleReplay}
                disabled={!isReady}
                title="Replay"
              >
                🔄
              </button>
              <button
                className="btn"
                onClick={handleNext}
                disabled={playlist.songs.length <= 1}
                title="Next Song"
              >
                ⏭️
              </button>
              {playlist.songs.length > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={handleClearPlaylist}
                  title="Clear Playlist"
                >
                  🗑️
                </button>
              )}
            </div>
            
            {error && (
              <div className="error-display">
                <span className="error-message">⚠️ {error}</span>
              </div>
            )}
          </div>

          {/* Integrated Playlist */}
          <div className="integrated-playlist">
            <h4>🎵 Playlist ({playlist.songs.length})</h4>
            
            {playlist.songs.length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">🎵</div>
                <p>No songs in playlist</p>
                <div className="empty-help">
                  <p>Songs will appear here when:</p>
                  <ul>
                    <li>You add songs manually</li>
                    <li>TikTok Live users request songs</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="song-list">
                {playlist.songs.map((song, index) => (
                  <div
                    key={song.id}
                    className={`song-item ${index === playlist.currentIndex ? 'current' : ''}`}
                  >
                    <div className="song-thumbnail">
                      <img
                        src={getThumbnailUrl(song)}
                        alt={song.title}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik00OCA0MEw3MiA1NUw0OCA3MFY0MFoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+';
                        }}
                      />
                      {index === playlist.currentIndex && (
                        <div className="current-indicator">▶️</div>
                      )}
                      <div className="song-index">{index + 1}</div>
                    </div>

                    <div className="song-details">
                      <div className="song-title">
                        {song.title}
                        {formatDuration(song.duration)}
                      </div>
                      <div className="song-meta">
                        <span className="requester">👤 {song.requester}</span>
                        {song.channel && (
                          <span className="channel">📺 {song.channel}</span>
                        )}
                      </div>
                      {song.addedAt && (
                        <div className="added-at">
                          ⏰ {new Date(song.addedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>

                    <div className="song-actions">
                      <button
                        className="btn-icon btn-remove"
                        onClick={() => handleRemoveSong(index)}
                        title="Remove song"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-song">
          <div className="no-song-icon">🎵</div>
          <h4>No song selected</h4>
          <p>Add songs to the playlist to start playing music!</p>
          <div className="help-text">
            <p>Songs will be added automatically when users comment:</p>
            <code>!music Song Name + Artist</code>
          </div>
        </div>
      )}

      <style jsx>{`
        .youtube-player {
          height: fit-content;
        }

        .player-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .current-song-info {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 8px;
        }

        .song-title {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #fff;
          line-height: 1.3;
        }

        .song-requester,
        .song-channel {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0.25rem 0;
        }

        .player-wrapper {
          border-radius: 8px;
          overflow: hidden;
          background: #000;
        }

        .player-controls-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .player-controls {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .player-controls .btn {
          font-size: 1.2rem;
          padding: 0.6rem;
          min-width: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1;
        }

        .player-controls .btn:first-child {
          background: linear-gradient(45deg, #4caf50, #388e3c);
        }

        .error-display {
          margin-top: 0.75rem;
          text-align: center;
        }

        .error-message {
          color: #f44336;
          font-size: 0.8rem;
          background: rgba(244, 67, 54, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .playlist-progress {
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .playlist-progress span {
          display: block;
          margin: 0.2rem 0;
        }

        .no-song {
          text-align: center;
          padding: 2rem 1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .no-song-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-song h4 {
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .no-song p {
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .help-text {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .help-text p {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }

        .help-text code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        /* Integrated Playlist Styles */
        .integrated-playlist {
          margin-top: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .integrated-playlist h4 {
          margin: 0 0 0.75rem 0;
          color: #fff;
          font-size: 0.9rem;
          text-align: center;
        }

        .empty-playlist {
          text-align: center;
          padding: 1.5rem 1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          opacity: 0.5;
        }

        .empty-help {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 0.75rem;
          text-align: left;
        }

        .empty-help p {
          font-size: 0.75rem;
          margin-bottom: 0.4rem;
        }

        .empty-help ul {
          font-size: 0.75rem;
          padding-left: 1rem;
        }

        .empty-help li {
          margin: 0.25rem 0;
        }

        .song-list {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 0.5rem;
        }

        .song-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          min-width: 120px;
          flex-shrink: 0;
          position: relative;
        }

        .song-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(2px);
        }

        .song-item.current {
          background: rgba(76, 175, 80, 0.2);
          border-color: rgba(76, 175, 80, 0.5);
        }

        .song-thumbnail {
          position: relative;
          flex-shrink: 0;
          width: 60px;
          height: 45px;
          border-radius: 4px;
          overflow: hidden;
          background: #333;
        }

        .song-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .current-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .song-index {
          position: absolute;
          top: 2px;
          left: 2px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-weight: 500;
        }

        .song-details {
          text-align: center;
          margin-top: 0.5rem;
          flex: 1;
        }

        .song-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          margin-bottom: 0.25rem;
          line-height: 1.1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.2em;
        }

        .song-meta {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          margin-bottom: 0.2rem;
        }

        .song-meta span {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.6);
          display: block;
          text-align: center;
        }

        .requester {
          color: rgba(255, 193, 7, 0.8);
        }

        .channel {
          color: rgba(33, 150, 243, 0.8);
        }

        .added-at {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .song-actions {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
        }

        .btn-icon {
          background: rgba(0, 0, 0, 0.6);
          border: none;
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 3px;
          font-size: 0.7rem;
          transition: all 0.2s ease;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-remove:hover {
          background: rgba(244, 67, 54, 0.3);
          transform: scale(1.1);
        }

        /* Custom scrollbar for horizontal song list */
        .song-list::-webkit-scrollbar {
          height: 6px;
        }

        .song-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .song-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .song-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .player-controls {
            gap: 0.4rem;
          }

          .player-controls .btn {
            font-size: 1rem;
            padding: 0.5rem;
            min-width: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default YouTubePlayer; 