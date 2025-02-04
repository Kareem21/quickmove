import React from 'react';

const SentimentCard = ({ label, post }) => {
    return (
        <div
            className="sentiment-card"
            style={{
                border: '1px solid #ccc',
                padding: '15px',
                margin: '10px',
                width: '45%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '5px',
            }}
        >
            <h3>{label}</h3>
            <h4>{post.post_title}</h4>
            <p>
                <strong>Sentiment Score:</strong> {post.sentiment_score}
            </p>
            <p>
                <strong>Date:</strong>{' '}
                {new Date(post.post_timestamp).toLocaleString()}
            </p>
            <h4>Top 5 Words:</h4>
            <ul>
                {post.top_words && Array.isArray(post.top_words) && post.top_words.length > 0 ? (
                    post.top_words.slice(0, 5).map((wordObj, index) => (
                        <li key={index}>
                            {wordObj.word}: {wordObj.count}
                        </li>
                    ))
                ) : (
                    <li>No top words available</li>
                )}
            </ul>
        </div>
    );
};

export default SentimentCard;
