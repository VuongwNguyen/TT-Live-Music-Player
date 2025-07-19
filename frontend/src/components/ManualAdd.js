import React, { useState } from 'react';

const ManualAdd = ({ socket }) => {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!song.trim() || !socket) return;
    
    setIsAdding(true);
    
    socket.emit('add-song-manual', {
      song: song.trim(),
      artist: artist.trim() || 'Unknown'
    });
    
    // Reset form
    setSong('');
    setArtist('');
    
    // Reset adding state after a delay
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <div className="panel">
      <h3>🎼 Add Song</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            id="song"
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="Song name *"
            disabled={isAdding}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist (optional)"
            disabled={isAdding}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-success"
          disabled={!song.trim() || isAdding}
          style={{ width: '100%' }}
        >
          {isAdding ? 'Adding...' : '+ Add'}
        </button>
      </form>
    </div>
  );
};

export default ManualAdd; 