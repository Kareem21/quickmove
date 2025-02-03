import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ekqpaxwmblelcxbfxdun.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcXBheHdtYmxlbGN4YmZ4ZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTM5NzQsImV4cCI6MjA1MTIyOTk3NH0.aBxxX8gyeKAF3Filj4_k3Cf8mUS9retqPIGftIWf_hs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function TwitterPage() {

    const [tweets, setTweets] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(''); // Filter by Twitter Username


    // Fetch trending topics from Supabase
    // Fetch trending topics from Supabase
    async function fetchTrendingTopics() {
        const { data, error } = await supabase
            .from('trending_topics')
            .select('*')
            .order('scraped_at', { ascending: false })
            .limit(10);
        if (error) {
            console.error('Error fetching trending topics:', error);
        } else {
            setTrendingTopics(data);
        }
    }

    // Fetch tweets from Supabase
    async function fetchTweets() {
        const { data, error } = await supabase
            .from('fintweets')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        if (error) {
            console.error('Error fetching tweets:', error);
        } else {
            setTweets(data);
        }
    }

    // Compute aggregate metrics from the fetched tweets
    const totalTweets = tweets.length;
    const uniqueUsers = new Set(tweets.map(tweet => tweet.username)).size;

    // Get the most mentioned ticker
    const getTopMentionedTicker = () => {
        const tickerCount = {};
        tweets.forEach(tweet => {
            if (tweet.tickers) {
                const tickers = Array.isArray(tweet.tickers) ? tweet.tickers : tweet.tickers.split(',');
                tickers.forEach(ticker => {
                    const cleanTicker = ticker.trim();
                    if (cleanTicker) {
                        tickerCount[cleanTicker] = (tickerCount[cleanTicker] || 0) + 1;
                    }
                });
            }
        });
        const sortedTickers = Object.entries(tickerCount).sort((a, b) => b[1] - a[1]);
        return sortedTickers.length > 0 ? sortedTickers[0][0] : 'None';
    };

    const topTicker = getTopMentionedTicker();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await Promise.all([fetchTrendingTopics(), fetchTweets()]);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading Twitter data...</div>;
    }

    // Filter tweets based on search query and selected user
    const filteredTweets = tweets.filter(tweet => {
        return (
            (searchQuery === '' || tweet.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedUser === '' || tweet.username === selectedUser)
        );
    });

    return (
        <div style={{ padding: '20px', position: 'relative' }}>
            <h1>Twitter Dashboard</h1>

            {/* Top Twitter Movers Card (Fixed to Top Right) */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#fdf6e3', // Light vintage beige
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                width: '250px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontFamily: "'Merriweather', serif"
            }}>
                <h3 style={{ marginTop: 0 }}>Twitter accounts to watch</h3>
                <ol style={{ paddingLeft: '20px', margin: 0 }}>
                    <li>@elonmusk</li>
                    <li>@realDonaldTrump</li>
                    <li>@unusual_whales</li>
                    <li>@TheRoaringKitty</li>
                    <li>@michaeljburry</li>
                </ol>
            </div>

            {/* Aggregate Metrics Section */}
            <section style={{
                marginBottom: '30px',
                borderBottom: '1px solid #ccc',
                paddingBottom: '10px'
            }}>
                <h2>Aggregate Metrics</h2>
                <p>Total Tweets: {totalTweets}</p>
                <p>Unique Users: {uniqueUsers}</p>
                <p>Top Mentioned Ticker: {topTicker}</p>
            </section>

            {/* Trending Topics Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2>Trending Twitter Topics</h2>
                {trendingTopics && trendingTopics.length > 0 ? (
                    <ul>
                        {trendingTopics.map((topic) => (
                            <li key={topic.id}>
                                <strong>{topic.trend_name}</strong> – Scraped at: {new Date(topic.scraped_at).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No trending topics available.</p>
                )}
            </section>

            {/* Tweets Section */}
            <section>
                <h2>Interesting Tweets</h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search tweets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px',
                        marginBottom: '10px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontFamily: "'Merriweather', serif"
                    }}
                />

                {/* Filter by Twitter Username */}
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    style={{
                        padding: '10px',
                        marginBottom: '20px',
                        width: '100%',
                        maxWidth: '200px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontFamily: "'Merriweather', serif"
                    }}
                >
                    <option value="">Filter by user</option>
                    {Array.from(new Set(tweets.map(tweet => tweet.username))).map(user => (
                        <option key={user} value={user}>@{user}</option>
                    ))}
                </select>

                <h2>Cross match Tweets</h2>
                {filteredTweets.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {filteredTweets.map((tweet) => (
                            <div key={tweet.tweet_id} style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '15px',
                                background: '#faf3e0'
                            }}>
                                <h3>@{tweet.username}</h3>
                                <p>{tweet.content}</p>
                                <p><small>Created at: {new Date(tweet.created_at).toLocaleString()}</small></p>
                                {tweet.tickers && (
                                    <p><small>Tickers: {Array.isArray(tweet.tickers) ? tweet.tickers.join(', ') : tweet.tickers}</small></p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tweets available.</p>
                )}
            </section>
        </div>
    );
}

export default TwitterPage;