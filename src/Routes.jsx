import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import RedditPage from './components/RedditPage';
import TwitterPage from './components/TwitterPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reddit" element={<RedditPage />} />
            <Route path="/twitter" element={<TwitterPage />} />
        </Routes>
    );
}

export default AppRoutes;
