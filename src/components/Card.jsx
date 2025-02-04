import React from 'react';

function Card({ post, label }) {
    const timestamp = new Date(post.post_timestamp).toLocaleString();

    // Compute a background color based on sentiment score:
    // For vintage green, we use a soft green color; for vintage red, a soft red.
    // Adjust these color codes as desired.
    let sentimentColor = '#fff'; // Default white
    if (post.sentiment_score > 0) {
        sentimentColor = '#DFF0D8'; // Soft vintage green
    } else if (post.sentiment_score < 0) {
        sentimentColor = '#F2DEDE'; // Soft vintage red
    }

    const cardStyle = {
        backgroundColor: sentimentColor,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        margin: '10px',
    };

    return (
        <div className="card" style={cardStyle}>
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
            <p>Sentiment Score: {post.sentiment_score !== undefined ? post.sentiment_score : 'N/A'}</p>
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
