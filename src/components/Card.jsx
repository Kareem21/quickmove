import React from 'react';

function Card({ post, label }) {
    const timestamp = new Date(post.post_timestamp).toLocaleString();
    return (
        <div className="card">
            {label && (
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '4px'
                    }}
                >
                    {label}
                </div>
            )}
            <h2>{post.post_title}</h2>
            <p>Posted: {timestamp}</p>
            <p>Comments: {post.comment_count}</p>
            <p>Score: {post.score}</p>
            <p>Total Upvotes: {post.total_upvotes || 'N/A'}</p>
            <p>Total Downvotes: {post.total_downvotes || 'N/A'}</p>
            {post.upvote_ratio && (
                <p>Upvote Ratio: {(post.upvote_ratio * 100).toFixed(1)}%</p>
            )}
            <p>Tickers: {post.tickers ? post.tickers.join(', ') : 'None'}</p>
            <p>Flair: {post.flair || 'None'}</p>
            <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                View →
            </a>
        </div>
    );
}

export default Card;
