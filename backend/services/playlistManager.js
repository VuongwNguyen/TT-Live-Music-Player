class PlaylistManager {
  constructor() {
    this.playlist = [];
    this.currentIndex = 0;
  }

  addSong(song) {
    this.playlist.push({
      ...song,
      id: Date.now() + Math.random(),
      addedAt: new Date()
    });
    console.log(`Added song: ${song.title} by ${song.requester}`);
  }

  removeSong(index) {
    if (index >= 0 && index < this.playlist.length) {
      const removed = this.playlist.splice(index, 1)[0];
      console.log(`Removed song: ${removed.title}`);
      
      // Adjust current index if needed
      if (index < this.currentIndex) {
        this.currentIndex--;
      } else if (index === this.currentIndex && this.currentIndex >= this.playlist.length) {
        this.currentIndex = this.playlist.length - 1;
      }
      
      // Ensure currentIndex is valid
      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }
    }
  }

  nextSong() {
    if (this.playlist.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      console.log(`Next song: ${this.getCurrentSong()?.title || 'None'}`);
    }
  }

  getCurrentSong() {
    if (this.playlist.length > 0 && this.currentIndex < this.playlist.length) {
      return this.playlist[this.currentIndex];
    }
    return null;
  }

  getPlaylist() {
    return {
      songs: this.playlist,
      currentIndex: this.currentIndex,
      currentSong: this.getCurrentSong(),
      totalSongs: this.playlist.length
    };
  }

  clearPlaylist() {
    this.playlist = [];
    this.currentIndex = 0;
    console.log('Playlist cleared');
  }

  isEmpty() {
    return this.playlist.length === 0;
  }

  setCurrentIndex(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentIndex = index;
    }
  }
}

module.exports = PlaylistManager; 