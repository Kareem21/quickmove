import React from 'react';

function StatsCards({ stats }) {
    // Function to return style based on sentiment value
    const getSentimentStyle = (sentiment) => {
        if (!sentiment) return {};
        // Convert sentiment to lowercase for consistent comparison
        const lowerSentiment = sentiment.toLowerCase();
        if (lowerSentiment === 'bullish') {
            return { backgroundColor: '#d4edda', color: '#155724' }; // Light green with dark green text
        } else if (lowerSentiment === 'bearish') {
            return { backgroundColor: '#f8d7da', color: '#721c24' }; // Light red with dark red text
        }
        return {};
    };

    // Vintage look base style for all cards
    const vintageCardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: "'Merriweather', serif",
        flex: '1 1 200px',
        textAlign: 'center',
    };

    return (
        <div className="stats-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div className="stats-card" style={vintageCardStyle}>
                <h3>Most Mentioned Ticker across r/wallstreetbets</h3>
                <p>
                    {stats.mostMentionedTicker.name} ({stats.mostMentionedTicker.count} mentions)
                </p>
            </div>
            <div
                className="stats-card"
                style={{ ...vintageCardStyle, ...getSentimentStyle(stats.sentimentReddit) }}
            >
                <h3>Analyze r/stocks</h3>
                <p>{stats.sentimentReddit}</p>
            </div>
            <div
                className="stats-card"
                style={{ ...vintageCardStyle, ...getSentimentStyle(stats.sentimentReddit) }}
            >
                <h3>Analyze r/wallstreetbets</h3>
                <p>{stats.sentimentReddit}</p>
            </div>
            <div
                className="stats-card"
                style={{ ...vintageCardStyle, ...getSentimentStyle(stats.sentimentReddit) }}
            >
                <h3>Analyze r/investing</h3>
                <p>{stats.sentimentReddit}</p>
            </div>
            <div
                className="stats-card"
                style={{ ...vintageCardStyle, ...getSentimentStyle(stats.sentimentReddit) }}
            >
                <h3>Analyze r/options</h3>
                <p>{stats.sentimentReddit}</p>
            </div>
            <div
                className="stats-card"
                style={{ ...vintageCardStyle, ...getSentimentStyle(stats.sentimentTwitter) }}
            >
                <h3>Analyze r/valueinvesting</h3>
                <p>{stats.sentimentTwitter}</p>
            </div>
            <div
                className="stats-card"
                style={{ ...vintageCardStyle, ...getSentimentStyle(stats.sentimentReddit) }}
            >
                <h3>Analyze r/NVDA_Stock</h3>
                <p>{stats.sentimentTwitter}</p>
            </div>
        </div>
    );
}

export default StatsCards;
