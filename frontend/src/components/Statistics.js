import React from 'react';

const Statistics = ({ statistics }) => {
  const {
    topCommenter,
    topRequester,
    totalSongsPlayed,
    totalComments,
    uniqueUsers,
    mostRequestedSong,
    mostRequestedArtist,
    sessionDuration,
    currentStreak,
    totalRequests
  } = statistics || {};

  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const StatItem = ({ icon, label, value, subtext }) => (
    <div className="stat-item">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value || 'N/A'}</div>
        <div className="stat-label">{label}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );

  return (
    <div className="panel statistics-panel">
      <h3>📊 Live Statistics</h3>
      
      <div className="stats-grid">
        <StatItem
          icon="👑"
          label="Top Commenter"
          value={topCommenter?.username || 'None'}
          subtext={topCommenter ? `${topCommenter.count} comments` : ''}
        />
        
        <StatItem
          icon="🎵"
          label="Top Requester"
          value={topRequester?.username || 'None'}
          subtext={topRequester ? `${topRequester.count} requests` : ''}
        />
        
        <StatItem
          icon="▶️"
          label="Songs Played"
          value={totalSongsPlayed || 0}
        />
        
        <StatItem
          icon="💬"
          label="Total Comments"
          value={totalComments || 0}
        />
        
        <StatItem
          icon="👥"
          label="Unique Users"
          value={uniqueUsers || 0}
        />
        
        <StatItem
          icon="⏱️"
          label="Session Time"
          value={formatDuration(sessionDuration)}
        />
        
        <StatItem
          icon="🔥"
          label="Current Streak"
          value={currentStreak || 0}
          subtext="songs in a row"
        />
        
        <StatItem
          icon="🎤"
          label="Music Requests"
          value={totalRequests || 0}
        />
      </div>

      {mostRequestedSong && (
        <div className="popular-section">
          <h4>🏆 Most Popular</h4>
          <div className="popular-item">
            <span className="popular-label">Song:</span>
            <span className="popular-value">{mostRequestedSong.title}</span>
            <span className="popular-count">({mostRequestedSong.count}x)</span>
          </div>
          {mostRequestedArtist && (
            <div className="popular-item">
              <span className="popular-label">Artist:</span>
              <span className="popular-value">{mostRequestedArtist.name}</span>
              <span className="popular-count">({mostRequestedArtist.count}x)</span>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .statistics-panel {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0.75rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
          min-width: 0;
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          line-height: 1.1;
          word-break: break-word;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.1;
        }

        .stat-subtext {
          font-size: 0.6rem;
          color: rgba(255, 193, 7, 0.8);
          line-height: 1.1;
        }

        .popular-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.75rem;
          border-top: 2px solid rgba(255, 193, 7, 0.5);
        }

        .popular-section h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.8rem;
          color: rgba(255, 193, 7, 0.9);
        }

        .popular-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
          font-size: 0.75rem;
        }

        .popular-item:last-child {
          margin-bottom: 0;
        }

        .popular-label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .popular-value {
          color: #fff;
          font-weight: 500;
          flex: 1;
          text-align: center;
          margin: 0 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .popular-count {
          color: rgba(76, 175, 80, 0.8);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-item {
            padding: 0.4rem;
          }
          
          .stat-value {
            font-size: 0.8rem;
          }
          
          .stat-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Statistics; 