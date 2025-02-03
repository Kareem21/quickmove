import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';

function Navbar() {
    const navStyle = {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
    };

    const ulStyle = {
        display: 'flex',
        listStyleType: 'none',
        margin: 0,
        padding: 0,
    };

    const liStyle = {
        marginRight: '20px',
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1.1em',
    };

    return (
        <nav style={navStyle}>
            <ul style={ulStyle}>
                <li style={liStyle}>
                    <Link to="/" style={linkStyle}>Home</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/reddit" style={linkStyle}>Reddit</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/twitter" style={linkStyle}>Twitter</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/" style={linkStyle}>LLM news pattern recognition (Soon)</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
