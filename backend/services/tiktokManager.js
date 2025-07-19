const { WebcastPushConnection } = require('tiktok-live-connector');

class TikTokManager {
  constructor(io, playlistManager, youtubeManager, statisticsManager) {
    this.io = io;
    this.playlistManager = playlistManager;
    this.youtubeManager = youtubeManager;
    this.statisticsManager = statisticsManager;
    this.connection = null;
    this.isConnected = false;
    this.currentUsername = null;
    this.comments = [];
    this.maxComments = 50; // Keep last 50 comments
  }

  async connect(username) {
    try {
      if (this.connection) {
        await this.disconnect();
      }

      console.log(`Connecting to TikTok Live: @${username}`);
      this.currentUsername = username;
      
      this.connection = new WebcastPushConnection(username, {
        processInitialData: false,
        enableExtendedGiftInfo: false,
        enableWebsocketUpgrade: true,
        requestPollingIntervalMs: 1000,
        sessionId: undefined,
        clientParams: {},
        requestHeaders: {},
        websocketHeaders: {},
        requestOptions: {
          timeout: 10000,
        },
      });

      this.connection.connect().then(state => {
        console.log(`Connected to TikTok Live: @${username}`, state);
        this.isConnected = true;
        this.io.emit('tiktok-status', this.getStatus());
        this.io.emit('tiktok-connected', { username, state });
      }).catch(err => {
        console.error('Failed to connect to TikTok Live:', err);
        this.isConnected = false;
        this.io.emit('tiktok-status', this.getStatus());
        this.io.emit('tiktok-error', { error: err.message });
      });

      // Listen for comments
      this.connection.on('comment', (data) => {
        this.handleComment(data);
      });

      // Listen for connection state changes
      this.connection.on('connected', () => {
        console.log('TikTok Live connected successfully');
        this.isConnected = true;
        this.io.emit('tiktok-status', this.getStatus());
      });

      this.connection.on('disconnected', () => {
        console.log('TikTok Live disconnected');
        this.isConnected = false;
        this.io.emit('tiktok-status', this.getStatus());
      });

      this.connection.on('error', (error) => {
        console.error('TikTok Live error:', error);
        this.io.emit('tiktok-error', { error: error.message });
      });

      // Listen for other events for monitoring
      this.connection.on('member', (data) => {
        this.io.emit('tiktok-member', data);
      });

      this.connection.on('chat', (data) => {
        this.handleComment(data);
      });

      this.connection.on('gift', (data) => {
        this.io.emit('tiktok-gift', data);
      });

      this.connection.on('social', (data) => {
        this.io.emit('tiktok-social', data);
      });

    } catch (error) {
      console.error('Error connecting to TikTok Live:', error);
      this.isConnected = false;
      this.io.emit('tiktok-error', { error: error.message });
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.disconnect();
        this.connection = null;
      }
      this.isConnected = false;
      this.currentUsername = null;
      console.log('Disconnected from TikTok Live');
      this.io.emit('tiktok-status', this.getStatus());
      this.io.emit('tiktok-disconnected');
    } catch (error) {
      console.error('Error disconnecting from TikTok Live:', error);
    }
  }

  handleComment(data) {
    const comment = {
      id: Date.now() + Math.random(),
      username: data.uniqueId || data.nickname || 'Unknown',
      message: data.comment || data.text || '',
      timestamp: new Date(),
      profilePicture: data.profilePictureUrl || null
    };

    console.log(`Comment from ${comment.username}: ${comment.message}`);

    // Add to comments list
    this.comments.unshift(comment);
    if (this.comments.length > this.maxComments) {
      this.comments = this.comments.slice(0, this.maxComments);
    }

    // Track comment in statistics
    if (this.statisticsManager) {
      this.statisticsManager.addComment(comment.username, comment.message);
    }

    // Emit comment to frontend
    this.io.emit('tiktok-comment', comment);
    this.io.emit('comments-updated', this.comments);
    
    // Emit updated statistics
    if (this.statisticsManager) {
      this.io.emit('statistics-updated', this.statisticsManager.getStatistics());
    }

    // Check if comment is a music request
    this.checkMusicRequest(comment);
  }

  async checkMusicRequest(comment) {
    const message = comment.message.toLowerCase().trim();
    
    // Check for !music command
    if (message.startsWith('!music ')) {
      const musicRequest = message.substring(7).trim(); // Remove '!music '
      
      if (musicRequest) {
        console.log(`Music request from ${comment.username}: ${musicRequest}`);
        
        // Highlight the comment
        this.io.emit('comment-highlighted', { ...comment, isHighlighted: true });
        
        try {
          // Parse song and artist
          let song, artist;
          
          // Try to split by common separators
          if (musicRequest.includes(' - ')) {
            [song, artist] = musicRequest.split(' - ').map(s => s.trim());
          } else if (musicRequest.includes(' by ')) {
            [song, artist] = musicRequest.split(' by ').map(s => s.trim());
          } else if (musicRequest.includes(' + ')) {
            [song, artist] = musicRequest.split(' + ').map(s => s.trim());
          } else {
            // If no separator found, use the whole string as song name
            song = musicRequest;
            artist = '';
          }

          console.log(`Parsed request - Song: "${song}", Artist: "${artist}"`);

                     // Search for the song
          let videoId;
          if (artist) {
            videoId = await this.youtubeManager.searchSong(song, artist);
          } else {
            videoId = await this.youtubeManager.searchSongSimple(song);
          }

          if (videoId) {
            const songData = {
              videoId: videoId,
              title: artist ? `${song} - ${artist}` : song,
              requester: comment.username,
              duration: null,
              thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
              channel: 'YouTube'
            };

            // Add to playlist
            this.playlistManager.addSong(songData);

            // Track song in statistics
            if (this.statisticsManager) {
              this.statisticsManager.addSongPlayed(songData);
            }

            // Notify clients
            this.io.emit('playlist-updated', this.playlistManager.getPlaylist());
            this.io.emit('song-added', {
              song: songData,
              requester: comment.username,
              originalRequest: musicRequest
            });
            
            // Emit updated statistics
            if (this.statisticsManager) {
              this.io.emit('statistics-updated', this.statisticsManager.getStatistics());
            }

            console.log(`Added "${songData.title}" to playlist (requested by ${comment.username})`);
          } else {
            console.log(`Could not find song for request: ${musicRequest}`);
            this.io.emit('song-not-found', {
              request: musicRequest,
              requester: comment.username
            });
          }

        } catch (error) {
          console.error('Error processing music request:', error);
          this.io.emit('song-error', {
            request: musicRequest,
            requester: comment.username,
            error: error.message
          });
        }
      }
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      username: this.currentUsername,
      commentsCount: this.comments.length
    };
  }

  getComments() {
    return this.comments;
  }
}

module.exports = TikTokManager; 