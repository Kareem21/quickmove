import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import Card from './Card';
import CommentCard from './CommentCard';
import SentimentCard from './SentimentCard';

const SUPABASE_URL = 'https://ekqpaxwmblelcxbfxdun.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcXBheHdtYmxlbGN4YmZ4ZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTM5NzQsImV4cCI6MjA1MTIyOTk3NH0.aBxxX8gyeKAF3Filj4_k3Cf8mUS9retqPIGftIWf_hs';

function RedditPage() {
    const [posts, setPosts] = useState([]);
    const [selectedFlair, setSelectedFlair] = useState('');
    const [searchTicker, setSearchTicker] = useState('');
    const [tickerStats, setTickerStats] = useState('');
    const [tickerData, setTickerData] = useState(null); // { relatedPosts, comments }

    // Fetch all posts on mount
    useEffect(() => {
        async function init() {
            try {
                const fetchedPosts = await fetchAllPosts();
                // Sort posts by sentiment score (descending) then by post date (most recent first)
                fetchedPosts.sort((a, b) => {
                    const aScore = a.sentiment_score || 0;
                    const bScore = b.sentiment_score || 0;
                    if (bScore !== aScore) {
                        return bScore - aScore;
                    }
                    return new Date(b.post_timestamp) - new Date(a.post_timestamp);
                });
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error initializing dashboard:', error);
            }
        }
        init();
    }, []);

    async function fetchAllPosts() {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/redditscraper?select=*&order=score.desc`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
            }
        );
        const data = await response.json();
        return data;
    }

    async function fetchTickerStats(ticker) {
        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/post_comments?select=*&body=ilike.*${ticker}*`,
                {
                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization: `Bearer ${SUPABASE_KEY}`,
                    },
                }
            );
            const comments = await response.json();

            if (comments.length === 0) {
                setTickerStats(`No comments found for ticker "${ticker}"`);
                setTickerData(null);
                return;
            }

            const uniquePosts = new Set(comments.map((c) => c.post_id));
            setTickerStats(
                `Mentioned in: ${comments.length} comments across ${uniquePosts.size} posts`
            );

            // Filter posts that are related by having the ticker in their tickers array or matching the post_id
            const relatedPosts = posts.filter(
                (post) =>
                    uniquePosts.has(post.post_id) ||
                    (post.tickers && post.tickers.includes(ticker))
            );

            setTickerData({
                relatedPosts,
                comments,
            });
        } catch (error) {
            setTickerStats('Error fetching ticker data');
            console.error('Error:', error);
        }
    }

    function handleTickerSearch(e) {
        const value = e.target.value.toUpperCase();
        setSearchTicker(value);
        if (value.length >= 2) {
            fetchTickerStats(value);
        } else {
            setTickerStats('');
            setTickerData(null);
        }
    }

    // Filter posts by selected flair
    const filteredPosts = selectedFlair
        ? posts.filter((post) => post.flair === selectedFlair)
        : posts;

    // Re-sort the filtered posts by sentiment score (desc) then by date (desc)
    const sortedFilteredPosts = [...filteredPosts].sort((a, b) => {
        const aScore = a.sentiment_score || 0;
        const bScore = b.sentiment_score || 0;
        if (bScore !== aScore) return bScore - aScore;
        return new Date(b.post_timestamp) - new Date(a.post_timestamp);
    });

    // Compute the post with the highest bullish sentiment and the one with the highest bearish sentiment.
    const bullishPosts = posts.filter((post) => (post.sentiment_score || 0) > 0);
    const bearishPosts = posts.filter((post) => (post.sentiment_score || 0) < 0);
    const bullishPost =
        bullishPosts.length > 0
            ? bullishPosts.reduce((max, post) =>
                post.sentiment_score > max.sentiment_score ? post : max
            )
            : null;
    const bearishPost =
        bearishPosts.length > 0
            ? bearishPosts.reduce((min, post) =>
                post.sentiment_score < min.sentiment_score ? post : min
            )
            : null;

    // Top Stats for the StatsCards component
    const topStats = {
        mostMentionedTicker: getTopTicker(sortedFilteredPosts),
        sentimentReddit: 'Bullish', // Dummy value
        sentimentTwitter: 'Bearish', // Dummy value
    };

    return (
        <div>
            <h1 className="header">Reddit Dashboard</h1>
            <StatsCards stats={topStats} />

            {/* Filters */}
            <div className="controls">
                <select
                    value={selectedFlair}
                    onChange={(e) => setSelectedFlair(e.target.value)}
                    className="select"
                >
                    <option value="">All Flairs</option>
                    {Array.from(
                        new Set(posts.map((post) => post.flair).filter(Boolean))
                    ).map((flair) => (
                        <option key={flair} value={flair}>
                            {flair}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    value={searchTicker}
                    onChange={handleTickerSearch}
                    placeholder="Search by ticker..."
                    className="input"
                />
            </div>

            {/* Ticker Stats */}
            {tickerStats && <div className="ticker-stats">{tickerStats}</div>}

            {/* Sentiment Summary Cards */}
            <div
                className="sentiment-summary"
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    margin: '20px 0',
                }}
            >
                {bullishPost && (
                    <SentimentCard
                        label="Highest Bullish Sentiment Score"
                        post={bullishPost}
                    />
                )}
                {bearishPost && (
                    <SentimentCard
                        label="Highest Bearish Sentiment Score"
                        post={bearishPost}
                    />
                )}
            </div>

            {/* Main Content */}
            {tickerData ? (
                <div>
                    <h2 className="header" style={{ fontSize: '1.5em' }}>
                        Related Posts
                    </h2>
                    <div className="grid-3">
                        {tickerData.relatedPosts.map((post) => (
                            <Card key={post.post_id} post={post} />
                        ))}
                    </div>
                    <h2 className="header" style={{ fontSize: '1.5em' }}>
                        Comments Mentioning {searchTicker}
                    </h2>
                    <div>
                        {tickerData.comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                highlightTicker={searchTicker}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid-3">
                    {sortedFilteredPosts.length > 0 ? (
                        sortedFilteredPosts.map((post) => (
                            <Card key={post.post_id} post={post} />
                        ))
                    ) : (
                        <div>No posts found</div>
                    )}
                </div>
            )}
        </div>
    );
}

// Utility function to get the most mentioned ticker
function getTopTicker(posts) {
    const tickerCount = {};
    posts.forEach((post) => {
        if (post.tickers) {
            post.tickers.forEach((ticker) => {
                tickerCount[ticker] = (tickerCount[ticker] || 0) + 1;
            });
        }
    });
    const sortedTickers = Object.entries(tickerCount).sort((a, b) => b[1] - a[1]);
    return sortedTickers.length > 0
        ? { name: sortedTickers[0][0], count: sortedTickers[0][1] }
        : { name: 'None', count: 0 };
}

export default RedditPage;
