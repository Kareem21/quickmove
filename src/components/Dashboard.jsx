// src/components/Dashboard.jsx
import React from 'react';
import "./Dashboard.css";
import StatsCards from "./StatsCards";

function Dashboard() {
    return (
        <div className="dashboard-container">

            <h1 className="dashboard-title">Finscraper</h1>
            <div className="search-container">
                <input type="text" placeholder="Search any ticker" className="search-input" />
            </div>
            <div className="suggestions">
                <button className="suggestion-button">Twitter overall sentiment </button>
                <button className="suggestion-button">Reddit r/WSB most mentioned ticker in the past 3 days</button>
                <button className="suggestion-button">Reddit r/options most mentioned ticker</button>
                <button className="suggestion-button">Trending topics on twitter</button>
            </div>
        </div>
    );
}

export default Dashboard;