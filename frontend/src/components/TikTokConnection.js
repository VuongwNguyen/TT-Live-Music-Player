import React, { useState, useEffect } from 'react';

const TikTokConnection = ({ socket, status }) => {
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (e) => {
    e.preventDefault();
    if (!username.trim() || !socket) return;

    setIsConnecting(true);
    socket.emit('connect-tiktok', username.trim());

    // Reset connecting state after a delay
    setTimeout(() => {
      setIsConnecting(false);
    }, 3000);
  };

  const handleDisconnect = (username = null) => {
    if (!socket) return;
    socket.emit('disconnect-tiktok', username);
  };

  // Clear input when successfully connected
  useEffect(() => {
    if (status.isConnected && status.connectedUsers && status.connectedUsers.length > 0) {
      setUsername('');
    }
  }, [status.isConnected, status.connectedUsers]);



  return (
    <div className="panel">
      <h3>🎪 TikTok Live Connection</h3>
      
      <div className="connection-status">
        <div className={`status-indicator ${status.isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>
            {status.isConnected 
              ? `Connected to TikTok Live`
              : 'Not Connected'
            }
          </span>
        </div>
      </div>

      {/* Show connection form only when not connected */}
      {!status.isConnected && (
        <form onSubmit={handleConnect}>
        <div className="form-group">
          <label htmlFor="username">Add TikTok Live:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username (without @)"
            disabled={isConnecting}
          />
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={!username.trim() || isConnecting}
          style={{ width: '100%' }}
        >
          {isConnecting ? 'Connecting...' : 'Connect to Live'}
        </button>
      </form>
      )}

      {/* Show connected users */}
      {status.isConnected && status.connectedUsers && status.connectedUsers.length > 0 && (
        <div className="connected-users">
          <div className="current-connection">
            <div className="connection-header">
              <span className="user-icon">📺</span>
              <span className="username">@{status.connectedUsers[0]}</span>
              <span className="live-indicator">🔴 LIVE</span>
            </div>
            
            <div className="connection-actions">
              <button
                onClick={() => handleDisconnect(status.connectedUsers[0])}
                className="btn btn-danger disconnect-btn"
                title={`Disconnect @${status.connectedUsers[0]}`}
              >
                Disconnect
              </button>
            </div>
            
            <div className="connection-stats">
              <p><strong>Comments:</strong> {status.commentsCount || 0}</p>
            </div>
          </div>
        </div>
      )}

        {!status.isConnected && (
          <div className="connection-help">
            <h4>How to use:</h4>
          <ol>
            <li>Enter TikTok username (without @)</li>
            <li>Click "Connect to Live"</li>
            <li>Only <strong>1 connection</strong> allowed per user</li>
            <li>Songs will be added automatically from connected stream</li>
          </ol>
          
          <div className="connection-notes">
            <h5>📌 Important:</h5>
            <ul>
              <li>You can only connect to <strong>1 TikTok account</strong> at a time</li>
              <li>Each TikTok account can only be connected by <strong>one user globally</strong></li>
              <li>Disconnect current connection to switch to a different account</li>
            </ul>
          </div>
        </div>
        )}

      <style jsx>{`
        .connection-status {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.connected .status-dot {
          background: #4caf50;
        }

        .status-indicator.disconnected .status-dot {
          background: #f44336;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .connected-controls {
          text-align: center;
        }

        .connection-info {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .connection-info p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .connection-help {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .connection-help h4 {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .connection-help ol {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          padding-left: 1.2rem;
        }

        .connection-help li {
          margin: 0.25rem 0;
        }

        .connection-help code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.7rem;
        }

        .connected-users {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .connected-users h4 {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
        }



        .current-connection {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.1));
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .connection-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
          font-weight: bold;
        }

        .connection-actions {
          margin-bottom: 0.75rem;
        }

        .disconnect-btn {
          width: 100%;
          padding: 0.5rem;
          background: rgba(244, 67, 54, 0.8);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.2s ease;
        }

        .disconnect-btn:hover {
          background: rgba(244, 67, 54, 1);
        }



        .live-indicator {
          font-size: 0.7rem;
          padding: 0.2rem 0.4rem;
          background: rgba(244, 67, 54, 0.8);
          border-radius: 10px;
          color: white;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .user-icon {
          font-size: 1rem;
        }

        .username {
          font-size: 0.85rem;
          font-weight: 500;
          color: #4fc3f7;
        }

        .btn-disconnect {
          background: rgba(244, 67, 54, 0.8);
          color: white;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.2s ease;
        }

        .btn-disconnect:hover {
          background: rgba(244, 67, 54, 1);
          transform: scale(1.1);
        }

        .connection-stats {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .connection-stats p {
          margin: 0;
          font-size: 0.85rem;
          text-align: center;
        }

        .connection-notes {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(255, 152, 0, 0.1);
          border-left: 3px solid #ff9800;
          border-radius: 5px;
        }

        .connection-notes h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.8rem;
          color: #ffa726;
        }

        .connection-notes ul {
          margin: 0;
          padding-left: 1rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .connection-notes li {
          margin: 0.3rem 0;
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
};

export default TikTokConnection; 