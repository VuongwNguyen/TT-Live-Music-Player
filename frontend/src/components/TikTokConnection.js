import React, { useState } from 'react';

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

  const handleDisconnect = () => {
    if (!socket) return;
    socket.emit('disconnect-tiktok');
  };

  return (
    <div className="panel">
      <h3>🎪 TikTok Live Connection</h3>
      
      <div className="connection-status">
        <div className={`status-indicator ${status.isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>
            {status.isConnected ? `Connected to @${status.username}` : 'Disconnected'}
          </span>
        </div>
      </div>

      {!status.isConnected ? (
        <form onSubmit={handleConnect}>
          <div className="form-group">
            <label htmlFor="username">TikTok Username:</label>
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
      ) : (
        <div className="connected-controls">
          <div className="connection-info">
            <p><strong>Username:</strong> @{status.username}</p>
            <p><strong>Comments:</strong> {status.commentsCount || 0}</p>
          </div>
          <button
            onClick={handleDisconnect}
            className="btn btn-danger"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="connection-help">
        <h4>How to use:</h4>
        <ol>
          <li>Enter the TikTok username (without @)</li>
          <li>Click "Connect to Live"</li>
          <li>Songs will be added automatically</li>
        </ol>
      </div>

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
      `}</style>
    </div>
  );
};

export default TikTokConnection; 