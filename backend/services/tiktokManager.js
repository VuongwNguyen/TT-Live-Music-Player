const { WebcastPushConnection } = require('tiktok-live-connector');

class TikTokManager {
  constructor(io, playlistManager, youtubeManager, statisticsManager) {
    this.io = io;
    this.playlistManager = playlistManager;
    this.youtubeManager = youtubeManager;
    this.statisticsManager = statisticsManager;
    this.clientConnections = new Map(); // socketId -> Map(username -> connection)
    this.globalConnections = new Map(); // username -> socketId (global tracking)
    this.comments = [];
    this.maxComments = 100; // Keep last 100 comments for multi-user
  }

  async connect(username, socketId) {
    try {
      // Check if TikTok ID is already connected by ANY client
      if (this.globalConnections.has(username)) {
        const existingClientId = this.globalConnections.get(username);
        console.log(`TikTok @${username} already connected by client ${existingClientId}`);
        this.io.to(socketId).emit('tiktok-error', { 
          error: `@${username} is already connected by another user. Please try a different TikTok account.`,
          code: 'ALREADY_CONNECTED'
        });
        return;
      }

      // Initialize client connections if not exists
      if (!this.clientConnections.has(socketId)) {
        this.clientConnections.set(socketId, new Map());
      }

      const clientConns = this.clientConnections.get(socketId);
      
      // LIMIT: Each client can only connect to 1 TikTok account at a time
      if (clientConns.size > 0) {
        const currentConnection = Array.from(clientConns.keys())[0];
        console.log(`Client ${socketId} already connected to @${currentConnection}, must disconnect first`);
        this.io.to(socketId).emit('tiktok-error', { 
          error: `You can only connect to 1 TikTok account at a time. Currently connected to @${currentConnection}. Please disconnect first.`,
          code: 'SINGLE_CONNECTION_LIMIT',
          currentConnection
        });
        return;
      }
      
      // Check if this client is already connected to this user (should not happen after global check)
      if (clientConns.has(username)) {
        console.log(`Client ${socketId} already connected to @${username}`);
        this.io.to(socketId).emit('tiktok-error', { error: `Already connected to @${username}` });
        return;
      }

      console.log(`Client ${socketId} connecting to TikTok Live: @${username}`);
      
      const connection = new WebcastPushConnection(username, {
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

      connection.connect().then(state => {
        console.log(`Client ${socketId} connected to TikTok Live: @${username}`, state);
        
        // Store connection for this client
        clientConns.set(username, { connection, socketId });
        
        // Add to global tracking
        this.globalConnections.set(username, socketId);
        
        const status = this.getClientStatus(socketId);
        this.io.to(socketId).emit('tiktok-status', status);
        this.io.to(socketId).emit('tiktok-connected', { username, state });
        console.log(`Client ${socketId} TikTok connection established:`, status);
      }).catch(err => {
        console.error(`Client ${socketId} failed to connect to TikTok Live @${username}:`, err);
        this.io.to(socketId).emit('tiktok-error', { error: `Failed to connect to @${username}: ${err.message}` });
      });

      // Setup event listeners for this connection
      this.setupConnectionListeners(connection, username, socketId);

    } catch (error) {
      console.error(`Client ${socketId} error connecting to TikTok Live @${username}:`, error);
      this.io.to(socketId).emit('tiktok-error', { error: `Connection error for @${username}: ${error.message}` });
    }
  }

  setupConnectionListeners(connection, username, socketId) {
    // Listen for comments
    connection.on('comment', (data) => {
      this.handleComment(data, username, socketId);
    });

    // Listen for connection state changes
    connection.on('connected', () => {
      console.log(`Client ${socketId} TikTok Live @${username} connected successfully`);
      const status = this.getClientStatus(socketId);
      this.io.to(socketId).emit('tiktok-status', status);
      console.log(`Client ${socketId} status after TikTok connection:`, status);
    });

    connection.on('disconnected', () => {
      console.log(`Client ${socketId} TikTok Live @${username} disconnected`);
      this.handleUserDisconnected(username, socketId);
      // Emit updated status after disconnect
      const status = this.getClientStatus(socketId);
      this.io.to(socketId).emit('tiktok-status', status);
      console.log(`Client ${socketId} status after TikTok disconnect:`, status);
    });

    connection.on('error', (error) => {
      console.error(`Client ${socketId} TikTok Live @${username} error:`, error);
      this.io.to(socketId).emit('tiktok-error', { error: `@${username}: ${error.message}` });
      this.handleUserDisconnected(username, socketId);
    });

    // Listen for other events for monitoring
    connection.on('member', (data) => {
      this.io.to(socketId).emit('tiktok-member', { ...data, source: username });
    });

    connection.on('chat', (data) => {
      this.handleComment(data, username, socketId);
    });

    connection.on('gift', (data) => {
      this.io.to(socketId).emit('tiktok-gift', { ...data, source: username });
    });

    connection.on('social', (data) => {
      this.io.to(socketId).emit('tiktok-social', { ...data, source: username });
    });
  }

  async disconnect(socketId, username = null) {
    try {
      if (!this.clientConnections.has(socketId)) {
        return;
      }

      const clientConns = this.clientConnections.get(socketId);
      
      if (username) {
        // Disconnect specific user for this client
        const connData = clientConns.get(username);
        if (connData) {
          await connData.connection.disconnect();
          this.handleUserDisconnected(username, socketId);
          console.log(`Client ${socketId} TikTok Live @${username} disconnected manually`);
        }
      } else {
        // Disconnect all users for this client
        const disconnectPromises = [];
        for (const [user, connData] of clientConns.entries()) {
          disconnectPromises.push(connData.connection.disconnect().catch(err => 
            console.error(`Client ${socketId} error disconnecting @${user}:`, err)
          ));
        }
        
        await Promise.all(disconnectPromises);
        
        // Remove all this client's connections from global tracking
        for (const [user] of clientConns.entries()) {
          this.globalConnections.delete(user);
          console.log(`TikTok @${user} is now available for other clients to connect`);
        }
        
        // Clear client data
        this.clientConnections.delete(socketId);
        
        // Remove comments from this client
        this.comments = this.comments.filter(comment => comment.clientId !== socketId);
        
        console.log(`Client ${socketId} all TikTok Live connections disconnected`);
        // No need to emit to disconnected client
        // this.io.to(socketId).emit('tiktok-status', this.getClientStatus(socketId));
        // this.io.to(socketId).emit('comments-updated', []);
      }
    } catch (error) {
      console.error(`Client ${socketId} error disconnecting TikTok Live:`, error);
    }
  }

  handleUserDisconnected(username, socketId) {
    if (!this.clientConnections.has(socketId)) {
      return;
    }

    const clientConns = this.clientConnections.get(socketId);
    
    // Remove connection for this client
    clientConns.delete(username);
    
    // Remove from global tracking
    this.globalConnections.delete(username);
    
    // Remove comments from this user's channel for this client
    const initialCommentCount = this.comments.length;
    this.comments = this.comments.filter(comment => 
      !(comment.sourceChannel === username && comment.clientId === socketId)
    );
    
    console.log(`Client ${socketId} cleaned up ${initialCommentCount - this.comments.length} comments from @${username}`);
    console.log(`TikTok @${username} is now available for other clients to connect`);
    
    // Emit updated status and comments only to this client
    const clientComments = this.comments.filter(c => c.clientId === socketId);
    this.io.to(socketId).emit('tiktok-status', this.getClientStatus(socketId));
    this.io.to(socketId).emit('comments-updated', clientComments);
    this.io.to(socketId).emit('tiktok-disconnected', { username });
  }

  handleComment(data, sourceChannel, socketId) {
    // Extract TikTok user data
    const tiktokId = data.uniqueId || 'unknown';
    const displayName = data.nickname || data.displayName || data.uniqueId || 'Unknown User';
    
    // Format username as "Display Name (@tiktok_id)"
    const formattedUsername = tiktokId !== 'unknown' 
      ? `${displayName} (@${tiktokId})`
      : displayName;

    const comment = {
      id: Date.now() + Math.random(),
      username: formattedUsername,
      tiktokId: tiktokId, // Keep original TikTok ID for reference
      displayName: displayName, // Keep original display name
      message: data.comment || data.text || '',
      timestamp: new Date(),
      profilePicture: data.profilePictureUrl || null,
      sourceChannel: sourceChannel, // Track which TikTok channel this came from
      clientId: socketId // Track which client this comment belongs to
    };

    console.log(`Client ${socketId} comment from ${comment.username} in @${sourceChannel}: ${comment.message}`);

    // Add to comments list
    this.comments.unshift(comment);
    if (this.comments.length > this.maxComments) {
      this.comments = this.comments.slice(0, this.maxComments);
    }

    // Track comment in statistics (use TikTok ID for consistency)
    if (this.statisticsManager) {
      this.statisticsManager.addComment(comment.tiktokId, comment.message);
    }

    // Emit comment only to the client that owns this connection
    this.io.to(socketId).emit('tiktok-comment', comment);
    
    // Send updated comments only to this client
    const clientComments = this.comments.filter(c => c.clientId === socketId);
    this.io.to(socketId).emit('comments-updated', clientComments);
    
    // Emit updated statistics (global)
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
        
        // Highlight the comment for the specific client
        this.io.to(comment.clientId).emit('comment-highlighted', { ...comment, isHighlighted: true });
        
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
              requester: comment.username, // Use formatted username for display
              requesterTiktokId: comment.tiktokId, // Keep TikTok ID for reference
              duration: null,
              thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
              channel: 'YouTube'
            };

            // Add to playlist for this specific client
            this.playlistManager.addSong(songData, socketId);

            // Track song in statistics
            if (this.statisticsManager) {
              this.statisticsManager.addSongPlayed(songData);
            }

            // Notify only this client for playlist updates
            this.io.to(socketId).emit('playlist-updated', this.playlistManager.getPlaylist(socketId));
            this.io.to(socketId).emit('song-added', {
              song: songData,
              requester: comment.username,
              originalRequest: musicRequest
            });
            
            // Emit updated statistics (global)
            if (this.statisticsManager) {
              this.io.emit('statistics-updated', this.statisticsManager.getStatistics());
            }

            console.log(`Client ${socketId} added "${songData.title}" to playlist (requested by ${comment.username})`);
          } else {
            console.log(`Could not find song for request: ${musicRequest}`);
            this.io.to(comment.clientId).emit('song-not-found', {
              request: musicRequest,
              requester: comment.username
            });
          }

        } catch (error) {
          console.error('Error processing music request:', error);
          this.io.to(comment.clientId).emit('song-error', {
            request: musicRequest,
            requester: comment.username,
            error: error.message
          });
        }
      }
    }
  }

  getClientStatus(socketId) {
    if (!this.clientConnections.has(socketId)) {
      console.log(`Client ${socketId} status: Not connected`);
      return {
        isConnected: false,
        connectedUsers: [],
        totalConnections: 0,
        commentsCount: 0
      };
    }

    const clientConns = this.clientConnections.get(socketId);
    const clientComments = this.comments.filter(c => c.clientId === socketId);
    
    const status = {
      isConnected: clientConns.size > 0,
      connectedUsers: Array.from(clientConns.keys()),
      totalConnections: clientConns.size,
      commentsCount: clientComments.length
    };
    
    console.log(`Client ${socketId} status:`, status);
    return status;
  }

  // Method to clean up when client disconnects
  handleClientDisconnect(socketId) {
    if (this.clientConnections.has(socketId)) {
      console.log(`Client ${socketId} disconnected, cleaning up connections`);
      
      // Get list of TikTok usernames this client was connected to
      const clientConns = this.clientConnections.get(socketId);
      const connectedUsers = Array.from(clientConns.keys());
      
      // Perform cleanup without emitting to disconnected client
      this.cleanupClientData(socketId);
      
      // Log availability
      connectedUsers.forEach(username => {
        console.log(`TikTok @${username} is now available for other clients to connect`);
      });
    }
  }

  // Separate method for cleanup without emitting events
  async cleanupClientData(socketId) {
    try {
      if (!this.clientConnections.has(socketId)) {
        return;
      }

      const clientConns = this.clientConnections.get(socketId);
      
      // Disconnect all TikTok connections
      const disconnectPromises = [];
      for (const [user, connData] of clientConns.entries()) {
        disconnectPromises.push(connData.connection.disconnect().catch(err => 
          console.error(`Client ${socketId} error disconnecting @${user}:`, err)
        ));
      }
      
      await Promise.all(disconnectPromises);
      
      // Remove all this client's connections from global tracking
      for (const [user] of clientConns.entries()) {
        this.globalConnections.delete(user);
      }
      
      // Clear client data
      this.clientConnections.delete(socketId);
      
      // Remove comments from this client
      this.comments = this.comments.filter(comment => comment.clientId !== socketId);
      
      console.log(`Client ${socketId} cleanup completed - ${clientConns.size} connections removed`);
    } catch (error) {
      console.error(`Client ${socketId} error during cleanup:`, error);
    }
  }
  
  // Method to get currently connected TikTok accounts (for debugging)
  getGlobalConnections() {
    return {
      connectedAccounts: Array.from(this.globalConnections.keys()),
      totalConnections: this.globalConnections.size
    };
  }

  getComments() {
    return this.comments;
  }
}

module.exports = TikTokManager; 