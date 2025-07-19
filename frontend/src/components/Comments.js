import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';

const Comments = ({ comments }) => {
  const commentsListRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isRapidCommenting, setIsRapidCommenting] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const lastCommentsLengthRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const lastCommentTimeRef = useRef(Date.now());
  
    // ULTRA-OPTIMIZED Auto-scroll for rapid comment bursts
  useEffect(() => {
    if (commentsListRef.current && comments.length > 0) {
      const scrollElement = commentsListRef.current;
      const isNewComment = comments.length > lastCommentsLengthRef.current;
      
      // Update last comments length
      lastCommentsLengthRef.current = comments.length;
      
      if (!isNewComment) return;
      
      // Cache scroll measurements for performance
      const { scrollHeight, scrollTop, clientHeight } = scrollElement;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
      
      if (isNearBottom && !isUserScrollingRef.current) {
        // Check for rapid commenting (within 100ms for ultra-fast detection)
        const now = Date.now();
        const timeDiff = now - lastCommentTimeRef.current;
        const isRapidUpdate = timeDiff < 100;
        lastCommentTimeRef.current = now;
        
        if (isRapidUpdate) {
          // IMMEDIATE SCROLL for rapid comments - bypass all delays
          scrollElement.scrollTop = scrollHeight;
          
          // Set rapid mode if not already
          if (!isRapidCommenting) {
            setIsRapidCommenting(true);
          }
        } else {
          // Use requestAnimationFrame for single comments (smoother)
          requestAnimationFrame(() => {
            if (scrollElement && !isUserScrollingRef.current) {
              scrollElement.scrollTop = scrollElement.scrollHeight;
            }
          });
        }
      }
    }
  }, [comments, isRapidCommenting]);
  
  // Clear rapid commenting state after inactivity - faster reset
  useEffect(() => {
    if (isRapidCommenting) {
      const timer = setTimeout(() => {
        setIsRapidCommenting(false);
      }, 0); // Faster reset - 500ms
      
      return () => clearTimeout(timer);
    }
  }, [isRapidCommenting]);

  // Additional ref for batched scroll operations
  const scrollBatchRef = useRef(null);
  
  // Mobile detection and touch handling
  const isMobileRef = useRef(false);
  const touchStartRef = useRef({ y: 0, time: 0 });
  const isIOSRef = useRef(false);

  // Extracted scroll calculations for reuse
  const performScrollCalculations = useCallback(() => {
    const scrollElement = commentsListRef.current;
    if (!scrollElement) return;
    
    const { scrollHeight, scrollTop, clientHeight } = scrollElement;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + (isMobileRef.current ? 80 : 50);
    
    // Update scroll button state
    setShowScrollButton(!isNearBottom && comments.length > 5);
    
    // Mark user as manually scrolling
    isUserScrollingRef.current = true;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Mobile-specific reset delays
    let resetDelay = 300;
    if (isMobileRef.current) {
      resetDelay = isRapidCommenting ? 200 : 500; // Longer delay for mobile
    } else {
      resetDelay = isRapidCommenting ? 150 : 300;
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, resetDelay);
  }, [comments.length, isRapidCommenting]);

  // MOBILE-OPTIMIZED scroll event handler
  const handleScroll = useCallback(() => {
    if (!commentsListRef.current) return;
    
    // Extra throttling for mobile devices
    if (scrollBatchRef.current) return;
    
    // Use different timing for mobile vs desktop with fallback
    const throttleMethod = isMobileRef.current ? 'idle' : 'animation';
    
    if (throttleMethod === 'idle' && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Use requestIdleCallback for mobile to avoid blocking touch events
      scrollBatchRef.current = window.requestIdleCallback(() => {
        scrollBatchRef.current = null;
        performScrollCalculations();
      }, { timeout: 50 });
    } else {
      // Fallback to requestAnimationFrame
      scrollBatchRef.current = requestAnimationFrame(() => {
        scrollBatchRef.current = null;
        performScrollCalculations();
      });
    }
  }, [performScrollCalculations]);

  // MOBILE-OPTIMIZED instant scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (!commentsListRef.current) return;
    
    // Reset user scrolling flag to allow auto-scroll
    isUserScrollingRef.current = false;
    
    const scrollElement = commentsListRef.current;
    
    try {
      if (isMobileRef.current) {
        // Mobile-specific scroll optimization
        if (isIOSRef.current) {
          // iOS Safari optimization
          scrollElement.style.webkitOverflowScrolling = 'auto';
          scrollElement.scrollTop = scrollElement.scrollHeight;
          scrollElement.style.webkitOverflowScrolling = 'touch';
        } else {
          // Android optimization
          scrollElement.style.scrollBehavior = 'auto';
          scrollElement.scrollTop = scrollElement.scrollHeight;
          // Trigger reflow for Android
          void scrollElement.offsetHeight; // Force layout recalculation
        }
      } else {
        // Desktop optimization
        scrollElement.style.scrollBehavior = 'auto';
        scrollElement.scrollTop = scrollElement.scrollHeight;
        void scrollElement.offsetHeight; // Force layout recalculation
      }
      
      // Enable rapid commenting mode temporarily
      setIsRapidCommenting(true);
      setTimeout(() => setIsRapidCommenting(false), isMobileRef.current ? 500 : 300);
    } catch (error) {
      // Fallback scroll if any error occurs
      console.warn('Scroll optimization failed, using fallback:', error);
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, []);

  // Mobile detection and setup
  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    // Detect mobile device
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    isIOSRef.current = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // iOS-specific scroll optimizations - delay to ensure DOM is ready
    if (isIOSRef.current) {
      // Use setTimeout to ensure commentsListRef is available
      const timer = setTimeout(() => {
        const scrollElement = commentsListRef.current;
        if (scrollElement) {
          // Enable momentum scrolling on iOS
          scrollElement.style.webkitOverflowScrolling = 'touch';
          scrollElement.style.transform = 'translate3d(0,0,0)';
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Mobile touch event handlers for better scroll detection
  const handleTouchStart = useCallback((e) => {
    if (!isMobileRef.current || !e.touches || !e.touches[0]) return;
    
    touchStartRef.current = {
      y: e.touches[0].clientY || 0,
      time: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isMobileRef.current) return;
    
    // Mark as user scrolling immediately on touch move
    isUserScrollingRef.current = true;
    
    // Clear any pending auto-scroll during touch
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!isMobileRef.current || !e.changedTouches || !e.changedTouches[0]) return;
    
    const touchEnd = {
      y: e.changedTouches[0].clientY || 0,
      time: Date.now()
    };
    
    const deltaY = Math.abs((touchStartRef.current.y || 0) - touchEnd.y);
    const deltaTime = Math.max(1, touchEnd.time - (touchStartRef.current.time || 0)); // Prevent division by zero
    const velocity = deltaY / deltaTime;
    
    // Longer delay for fast swipes (momentum scrolling)
    const swipeDelay = velocity > 1 ? 800 : 500;
    
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, swipeDelay);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const isHighlighted = useCallback((message) => {
    return message.toLowerCase().includes('!music');
  }, []);
  
  // Memoize reversed comments to prevent unnecessary recalculation
  const reversedComments = useMemo(() => {
    return [...comments].reverse();
  }, [comments]);

  return (
    <div className="panel comments-panel">
      <h3>
        💬 Live Comments ({comments.length})
        {isRapidCommenting && (
          <span className="rapid-indicator" title="Rapid commenting detected">
            🔥
          </span>
        )}
      </h3>
      
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
          <div 
            className={`comments-list ${isRapidCommenting ? 'rapid-mode' : ''}`} 
            ref={commentsListRef} 
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {reversedComments.map((comment, index, reversedArray) => (
              <div
                key={comment.id}
                className={`comment-item ${isHighlighted(comment.message) ? 'highlighted' : ''} ${index === reversedArray.length - 1 ? 'latest-comment' : ''}`}
              >
                <div className="comment-header">
                  <div className="comment-user">
                    {comment.profilePicture && (
                      <img
                        src={comment.profilePicture}
                        alt={comment.displayName || comment.username}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span 
                      className="username" 
                      title={comment.username}
                    >
                      {comment.username}
                    </span>
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
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button 
            className="scroll-to-bottom-btn" 
            onClick={scrollToBottom}
            type="button"
            aria-label="Scroll to new messages"
          >
            <span>↓</span>
            <span className="new-message-text">New messages</span>
          </button>
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
          height: calc(100vh - 8rem);
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
          /* Performance optimizations */
          will-change: scroll-position;
          contain: layout style paint;
          transform: translateZ(0);
        }

        .comment-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: none; /* Remove transitions for performance */
          border-left: 3px solid transparent;
          /* Performance optimizations */
          contain: layout style;
          will-change: auto;
        }

        /* Rapid mode optimizations - reduce visual effects for speed */
        .comments-list.rapid-mode .comment-item {
          /* Disable expensive effects during rapid commenting */
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }

        .comments-list.rapid-mode .comment-item.latest-comment {
          /* Simplified animation for rapid mode */
          animation: rapid-slide-in 0.1s ease-out;
        }

        @keyframes rapid-slide-in {
          0% { 
            opacity: 0.7;
            transform: translateY(5px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .comment-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .comment-item.highlighted {
          background: rgba(255, 193, 7, 0.15);
          border-left-color: #ffc107;
          animation: pulse-highlight 2s ease-in-out;
        }

        .comment-item.latest-comment {
          animation: slide-in-new 0.2s ease-out;
          transform: translateZ(0); /* Hardware acceleration */
        }

        @keyframes pulse-highlight {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes slide-in-new {
          0% { 
            opacity: 0;
            transform: translate3d(0, 10px, 0);
            background: rgba(76, 175, 80, 0.3);
          }
          100% { 
            opacity: 1;
            transform: translate3d(0, 0, 0);
            background: rgba(255, 255, 255, 0.05);
          }
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          min-width: 0;
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

        /* Hide scrollbar on mobile for cleaner look */
        @media (hover: none) and (pointer: coarse) {
          .comments-list::-webkit-scrollbar {
            display: none;
          }
          
          .comments-list {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        }

        /* ULTRA OPTIMIZED scrolling for rapid comments */
        .comments-list {
          scroll-behavior: auto;
          /* Hardware acceleration */
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          /* Additional performance optimizations */
          overflow-anchor: none; /* Prevent scroll anchoring interference */
          overscroll-behavior: contain; /* Prevent scroll chaining */
          
          /* Mobile-specific optimizations */
          -webkit-overflow-scrolling: touch; /* iOS momentum scrolling */
          -webkit-transform: translate3d(0, 0, 0); /* Force hardware acceleration on webkit */
          -webkit-backface-visibility: hidden;
          
          /* Touch optimizations */
          touch-action: pan-y; /* Allow vertical scrolling only */
          -ms-touch-action: pan-y;
          
          /* Prevent text selection during scroll */
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Rapid commenting optimizations */
        .comments-list.rapid-mode {
          /* Disable smooth scrolling completely during rapid mode */
          scroll-behavior: auto !important;
          /* Prioritize scrolling performance */
          will-change: scroll-position;
          
          /* Mobile rapid mode optimizations */
          -webkit-overflow-scrolling: auto; /* Disable momentum during rapid mode */
        }

        /* Mobile-specific styles */
        @media (hover: none) and (pointer: coarse) {
          .comments-list {
            /* Enhanced mobile scrolling */
            scroll-snap-type: none; /* Disable snap scrolling */
            overscroll-behavior-y: contain;
            
            /* Improve touch responsiveness */
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
          
          /* Larger touch targets on mobile */
          .scroll-to-bottom-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
            bottom: 1.5rem;
            right: 1.5rem;
            min-height: 48px; /* Minimum touch target size */
          }
          
          /* Mobile comment item optimizations */
          .comment-item {
            /* Prevent flickering during scroll on mobile */
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }

        .comment-item:last-child {
          margin-bottom: 0;
        }

        /* Scroll to bottom button */
        .scroll-to-bottom-btn {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: linear-gradient(45deg, #4fc3f7, #29b6f6);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 195, 247, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
          animation: bounce-in 0.3s ease-out;
          z-index: 10;
        }

        .scroll-to-bottom-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 195, 247, 0.4);
        }

        .scroll-to-bottom-btn span:first-child {
          font-size: 1rem;
          animation: bounce-arrow 1s infinite;
        }

        .new-message-text {
          font-size: 0.75rem;
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce-arrow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }

        /* Position relative for button positioning */
        .comments-content {
          position: relative;
        }

        /* Rapid commenting indicator */
        .rapid-indicator {
          margin-left: 0.5rem;
          animation: pulse-fire 1s infinite;
          font-size: 0.9rem;
        }

        @keyframes pulse-fire {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
              .comment-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          flex: 1;
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
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        `}</style>
    </div>
  );
};

Comments.displayName = 'Comments';

export default React.memo(Comments); 