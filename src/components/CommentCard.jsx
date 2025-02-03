import React from 'react';

function CommentCard({ comment, highlightTicker }) {
    const timestamp = new Date(comment.created_at).toLocaleString();
    const regex = new RegExp(`\\b(${highlightTicker})\\b`, 'gi');
    const highlightedBody = comment.body.replace(
        regex,
        match => `<span class="comment-highlight">${match}</span>`
    );

    return (
        <div className="comment-card">
            <p><small>Created: {timestamp}</small></p>
            <p dangerouslySetInnerHTML={{ __html: highlightedBody }} />
            <p><small>Score: {comment.score}</small></p>
        </div>
    );
}

export default CommentCard;
