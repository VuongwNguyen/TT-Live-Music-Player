import React from 'react';

const Comments = ({ comments }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const isHighlighted = (message) => {
    return message.toLowerCase().includes('!music');
  };

  return (
    <div className="panel comments-panel">
      <h3>💬 Live Comments ({comments.length})</h3>
      
      <div className="comments-content">
        {comments.length === 0 ? (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <p>No comments yet</p>
            <p className="help-text">
              Comments from TikTok Live will appear here when connected
            </p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`comment-item ${isHighlighted(comment.message) ? 'highlighted' : ''}`}
              >
                <div className="comment-header">
                  <div className="comment-user">
                    {comment.profilePicture && (
                      <img
                        src={comment.profilePicture}
                        alt={comment.username}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="username">@{comment.username}</span>
                  </div>
                  <span className="comment-time">
                    {formatTime(comment.timestamp)}
                  </span>
                </div>
                
                <div className="comment-message">
                  {comment.message}
                </div>
                
                {isHighlighted(comment.message) && (
                  <div className="music-request-badge">
                    🎵 Music Request
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .comments-panel {
          display: flex;
          flex-direction: column;
          height: auto;
          flex-shrink: 0;
        }

        .comments-content {
          height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .no-comments {
          text-align: center;
          padding: 2rem 1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .no-comments-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-comments p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .help-text {
          font-size: 0.8rem !important;
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .comments-list {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
        }

        .comment-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .comment-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .comment-item.highlighted {
          background: rgba(255, 193, 7, 0.15);
          border-left-color: #ffc107;
          animation: pulse-highlight 2s ease-in-out;
        }

        @keyframes pulse-highlight {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .comment-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .username {
          font-size: 0.85rem;
          font-weight: 500;
          color: #4fc3f7;
        }

        .comment-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .comment-message {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
          word-break: break-word;
          margin-bottom: 0.3rem;
        }

        .comment-item.highlighted .comment-message {
          color: white;
          font-weight: 500;
        }

        .music-request-badge {
          font-size: 0.7rem;
          background: linear-gradient(45deg, #ffc107, #ff9800);
          color: #000;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          display: inline-block;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Custom scrollbar for comments */
        .comments-list::-webkit-scrollbar {
          width: 6px;
        }

        .comments-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .comments-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .comments-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Auto-scroll to bottom */
        .comments-list {
          display: flex;
          flex-direction: column-reverse;
        }

        .comment-item:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default Comments; 