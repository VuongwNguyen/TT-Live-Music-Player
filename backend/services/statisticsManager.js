class StatisticsManager {
  constructor() {
    this.sessionStartTime = Date.now();
    this.comments = new Map(); // username -> count
    this.requests = new Map(); // username -> count
    this.songsPlayed = [];
    this.totalComments = 0;
    this.totalRequests = 0;
    this.currentStreak = 0;
    this.requestedSongs = new Map(); // song title -> count
    this.requestedArtists = new Map(); // artist -> count
  }

  // Track a new comment
  addComment(username, message) {
    this.totalComments++;
    
    const currentCount = this.comments.get(username) || 0;
    this.comments.set(username, currentCount + 1);
    
    // Check if it's a music request
    if (message.toLowerCase().includes('!music')) {
      this.addRequest(username);
    }
  }

  // Track a music request
  addRequest(username) {
    this.totalRequests++;
    
    const currentCount = this.requests.get(username) || 0;
    this.requests.set(username, currentCount + 1);
  }

  // Track a song being played
  addSongPlayed(song) {
    this.songsPlayed.push({
      ...song,
      playedAt: Date.now()
    });
    
    this.currentStreak++;
    
    // Track most requested songs
    if (song.title) {
      const songCount = this.requestedSongs.get(song.title) || 0;
      this.requestedSongs.set(song.title, songCount + 1);
    }
    
    // Track most requested artists (extract from title)
    if (song.title && song.title.includes(' - ')) {
      const artist = song.title.split(' - ')[1];
      if (artist) {
        const artistCount = this.requestedArtists.get(artist) || 0;
        this.requestedArtists.set(artist, artistCount + 1);
      }
    }
  }

  // Reset streak when manually cleared
  resetStreak() {
    this.currentStreak = 0;
  }

  // Get top commenter
  getTopCommenter() {
    if (this.comments.size === 0) return null;
    
    let topUser = null;
    let maxComments = 0;
    
    for (const [username, count] of this.comments) {
      if (count > maxComments) {
        maxComments = count;
        topUser = username;
      }
    }
    
    return topUser ? { username: topUser, count: maxComments } : null;
  }

  // Get top requester
  getTopRequester() {
    if (this.requests.size === 0) return null;
    
    let topUser = null;
    let maxRequests = 0;
    
    for (const [username, count] of this.requests) {
      if (count > maxRequests) {
        maxRequests = count;
        topUser = username;
      }
    }
    
    return topUser ? { username: topUser, count: maxRequests } : null;
  }

  // Get most requested song
  getMostRequestedSong() {
    if (this.requestedSongs.size === 0) return null;
    
    let topSong = null;
    let maxCount = 0;
    
    for (const [title, count] of this.requestedSongs) {
      if (count > maxCount) {
        maxCount = count;
        topSong = title;
      }
    }
    
    return topSong ? { title: topSong, count: maxCount } : null;
  }

  // Get most requested artist
  getMostRequestedArtist() {
    if (this.requestedArtists.size === 0) return null;
    
    let topArtist = null;
    let maxCount = 0;
    
    for (const [name, count] of this.requestedArtists) {
      if (count > maxCount) {
        maxCount = count;
        topArtist = name;
      }
    }
    
    return topArtist ? { name: topArtist, count: maxCount } : null;
  }

  // Get session duration in seconds
  getSessionDuration() {
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  // Get unique users count
  getUniqueUsers() {
    return this.comments.size;
  }

  // Get complete statistics
  getStatistics() {
    return {
      topCommenter: this.getTopCommenter(),
      topRequester: this.getTopRequester(),
      totalSongsPlayed: this.songsPlayed.length,
      totalComments: this.totalComments,
      uniqueUsers: this.getUniqueUsers(),
      mostRequestedSong: this.getMostRequestedSong(),
      mostRequestedArtist: this.getMostRequestedArtist(),
      sessionDuration: this.getSessionDuration(),
      currentStreak: this.currentStreak,
      totalRequests: this.totalRequests
    };
  }

  // Reset all statistics
  reset() {
    this.sessionStartTime = Date.now();
    this.comments.clear();
    this.requests.clear();
    this.songsPlayed = [];
    this.totalComments = 0;
    this.totalRequests = 0;
    this.currentStreak = 0;
    this.requestedSongs.clear();
    this.requestedArtists.clear();
  }
}

module.exports = StatisticsManager; 