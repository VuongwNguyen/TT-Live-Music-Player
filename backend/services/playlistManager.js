class PlaylistManager {
  constructor() {
    this.clientPlaylists = new Map(); // socketId -> playlist data
  }

  // Initialize playlist for a client
  initializeClientPlaylist(socketId) {
    if (!this.clientPlaylists.has(socketId)) {
      this.clientPlaylists.set(socketId, {
        playlist: [],
        currentIndex: 0
      });
      console.log(`Initialized playlist for client ${socketId}`);
    }
  }

  // Get client's playlist data
  getClientPlaylist(socketId) {
    this.initializeClientPlaylist(socketId);
    return this.clientPlaylists.get(socketId);
  }

  addSong(song, socketId) {
    this.initializeClientPlaylist(socketId);
    const clientData = this.clientPlaylists.get(socketId);
    
    clientData.playlist.push({
      ...song,
      id: Date.now() + Math.random(),
      addedAt: new Date(),
      clientId: socketId
    });
    console.log(`Client ${socketId} added song: ${song.title} by ${song.requester}`);
  }

  removeSong(index, socketId) {
    const clientData = this.getClientPlaylist(socketId);
    
    if (index >= 0 && index < clientData.playlist.length) {
      const removed = clientData.playlist.splice(index, 1)[0];
      console.log(`Client ${socketId} removed song: ${removed.title}`);
      
      // Adjust current index if needed
      if (index < clientData.currentIndex) {
        clientData.currentIndex--;
      } else if (index === clientData.currentIndex && clientData.currentIndex >= clientData.playlist.length) {
        clientData.currentIndex = clientData.playlist.length - 1;
      }
      
      // Ensure currentIndex is valid
      if (clientData.currentIndex < 0) {
        clientData.currentIndex = 0;
      }
    }
  }

  nextSong(socketId) {
    const clientData = this.getClientPlaylist(socketId);
    
    if (clientData.playlist.length > 0) {
      clientData.currentIndex = (clientData.currentIndex + 1) % clientData.playlist.length;
      console.log(`Client ${socketId} next song: ${this.getCurrentSong(socketId)?.title || 'None'}`);
    }
  }

  getCurrentSong(socketId) {
    const clientData = this.getClientPlaylist(socketId);
    
    if (clientData.playlist.length > 0 && clientData.currentIndex < clientData.playlist.length) {
      return clientData.playlist[clientData.currentIndex];
    }
    return null;
  }

  getPlaylist(socketId) {
    const clientData = this.getClientPlaylist(socketId);
    
    return {
      songs: clientData.playlist,
      currentIndex: clientData.currentIndex,
      currentSong: this.getCurrentSong(socketId),
      totalSongs: clientData.playlist.length
    };
  }

  clearPlaylist(socketId) {
    const clientData = this.getClientPlaylist(socketId);
    
    clientData.playlist = [];
    clientData.currentIndex = 0;
    console.log(`Client ${socketId} playlist cleared`);
  }

  isEmpty(socketId) {
    const clientData = this.getClientPlaylist(socketId);
    return clientData.playlist.length === 0;
  }

  setCurrentIndex(index, socketId) {
    const clientData = this.getClientPlaylist(socketId);
    
    if (index >= 0 && index < clientData.playlist.length) {
      clientData.currentIndex = index;
    }
  }

  // Clean up when client disconnects
  removeClientPlaylist(socketId) {
    if (this.clientPlaylists.has(socketId)) {
      const clientData = this.clientPlaylists.get(socketId);
      console.log(`Client ${socketId} playlist removed - had ${clientData.playlist.length} songs`);
      this.clientPlaylists.delete(socketId);
    }
  }

  // Get statistics for debugging
  getStats() {
    const totalClients = this.clientPlaylists.size;
    let totalSongs = 0;
    
    for (const [socketId, data] of this.clientPlaylists) {
      totalSongs += data.playlist.length;
    }
    
    return {
      totalClients,
      totalSongs,
      clientCount: totalClients
    };
  }
}

module.exports = PlaylistManager; 