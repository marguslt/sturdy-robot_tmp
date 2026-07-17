import React, { useState } from 'react';

export default function TrackComments({ comments }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!comments || comments.length === 0) return null;

  return (
    <div className="comments-container">
      <div className="comments-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>
          <span>📝</span>
          Etappide kommentaarid ja märkmed
        </h2>
        <span className={`accordion-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment-card">
              <div className="comment-track-title">{comment.track}</div>
              <div className="comment-text">"{comment.text}"</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
