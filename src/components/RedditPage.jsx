import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import Card from './Card';
import CommentCard from './CommentCard';

// Replace with your actual Supabase URL and Key
const SUPABASE_URL = 'https://ekqpaxwmblelcxbfxdun.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcXBheHdtYmxlbGN4YmZ4ZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTM5NzQsImV4cCI6MjA1MTIyOTk3NH0.aBxxX8gyeKAF3Filj4_k3Cf8mUS9retqPIGftIWf_hs';

function RedditPage() {
    const [posts, setPosts] = useState([]);
    const [selectedFlair, setSelectedFlair] = useState('');
    const [searchTicker, setSearchTicker] = useState('');
    const [tickerStats, setTickerStats] = useState('');
    const [tickerData, setTickerData] = useState(null); // { relatedPosts, comments }

    // Fetch all posts on mount
    useEffect(() => {
        const init = async () => {
            try {
                const fetchedPosts = await fetchAllPosts();
                // Sort posts by score descending
                fetchedPosts.sort((a, b) => b.score - a.score);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error initializing dashboard:', error);
            }
        };
        init();
    }, []);

    async function fetchAllPosts() {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/redditscraper?select=*&order=score.desc`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
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
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                }
            );
            const comments = await response.json();

            if (comments.length === 0) {
                setTickerStats(`No comments found for ticker "${ticker}"`);
                setTickerData(null);
                return;
            }

            const uniquePosts = new Set(comments.map(c => c.post_id));
            setTickerStats(`Mentioned in: ${comments.length} comments across ${uniquePosts.size} posts`);

            // Show both posts and comments
            const relatedPosts = posts.filter(post =>
                uniquePosts.has(post.post_id) || (post.tickers && post.tickers.includes(ticker))
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
        ? posts.filter(post => post.flair === selectedFlair)
        : posts;

    // Get unique flairs for the dropdown
    const flairs = Array.from(new Set(posts.map(post => post.flair).filter(Boolean)));

    // Compute featured posts if available
    let mostCommented = null;
    let highestUpvotes = null;
    if (filteredPosts.length > 0) {
        mostCommented = filteredPosts.reduce((max, post) => post.comment_count > max.comment_count ? post : max, filteredPosts[0]);
        highestUpvotes = filteredPosts.reduce((max, post) => (post.total_upvotes || 0) > (max.total_upvotes || 0) ? post : max, filteredPosts[0]);
    }

    // Top Stats for the StatsCards component
    const topStats = {
        mostMentionedTicker: getTopTicker(filteredPosts),
        sentimentReddit: "Bullish",    // Dummy value
        sentimentTwitter: "Bearish",   // Dummy value
  //      topTwitterAccounts: "elonmusk, unusual whales, trump, roaring kitty"
    };

    return (
        <div>
            <h1 className="header">Reddit Dashboard</h1>

            {/* Top Stats Cards */}
            <StatsCards stats={topStats} />

            {/* Filters */}
            <div className="controls">
                <select
                    value={selectedFlair}
                    onChange={(e) => setSelectedFlair(e.target.value)}
                    className="select"
                >
                    <option value="">All Flairs</option>
                    {flairs.map(flair => (
                        <option key={flair} value={flair}>{flair}</option>
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

            {/* If no ticker search is active, show featured posts and stats */}
            {!tickerData && filteredPosts.length > 0 && (
                <>
                    <div className="total-posts">Total Posts: {filteredPosts.length}</div>
                    <div className="score-info">Score = Total Upvotes - Total Downvotes</div>

                    {mostCommented && highestUpvotes && (
                        <div className="featured">
                            <Card post={mostCommented} label="🏆 Most Commented" />
                            <Card post={highestUpvotes} label="⭐ Highest Upvotes" />
                        </div>
                    )}
                </>
            )}

            {/* Main Content */}
            {tickerData ? (
                <div>
                    <div>
                        <h2 className="header" style={{ fontSize: '1.5em' }}>Related Posts</h2>
                        <div className="grid-3">
                            {tickerData.relatedPosts.map(post => (
                                <Card key={post.post_id} post={post} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="header" style={{ fontSize: '1.5em' }}>Comments Mentioning {searchTicker}</h2>
                        <div>
                            {tickerData.comments.map(comment => (
                                <CommentCard key={comment.id} comment={comment} highlightTicker={searchTicker} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid-3">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
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
    posts.forEach(post => {
        if (post.tickers) {
            post.tickers.forEach(ticker => {
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
