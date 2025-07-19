const youtubeSearch = require('youtube-search-api');

class YouTubeManager {
  constructor() {
    this.searchOptions = {
      type: 'video',
      duration: 'medium', // Prefer songs over long videos
    };
  }

  async searchSong(songName, artistName) {
    try {
      const query = `${songName} ${artistName}`;
      console.log(`Searching YouTube for: ${query}`);
      
      const results = await youtubeSearch.GetListByKeyword(query, false, 5);
      
      if (results && results.items && results.items.length > 0) {
        // Filter for music-related content
        const musicResults = results.items.filter(item => {
          const title = item.title.toLowerCase();
          const description = (item.description || '').toLowerCase();
          
          // Basic filtering for music content
          return (
            title.includes(songName.toLowerCase()) ||
            title.includes(artistName.toLowerCase()) ||
            title.includes('music') ||
            title.includes('official') ||
            description.includes('music')
          );
        });
        
        const selectedResult = musicResults.length > 0 ? musicResults[0] : results.items[0];
        
        console.log(`Found: ${selectedResult.title} (${selectedResult.id})`);
        
        return selectedResult.id; // Return just the video ID for compatibility
      } else {
        console.log(`No results found for: ${query}`);
        return null;
      }
    } catch (error) {
      console.error(`YouTube search error for "${songName} ${artistName}":`, error.message);
      return null;
    }
  }

  async searchSongSimple(query) {
    try {
      console.log(`Simple YouTube search for: ${query}`);
      
      const results = await youtubeSearch.GetListByKeyword(query, false, 3);
      
      if (results && results.items && results.items.length > 0) {
        const selectedResult = results.items[0];
        
        console.log(`Found: ${selectedResult.title} (${selectedResult.id})`);
        
        return selectedResult.id; // Return just the video ID for compatibility
      } else {
        console.log(`No results found for: ${query}`);
        return null;
      }
    } catch (error) {
      console.error(`YouTube search error for "${query}":`, error.message);
      return null;
    }
  }

  getVideoUrl(videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  getThumbnailUrl(videoId, quality = 'mqdefault') {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }
}

module.exports = YouTubeManager; 