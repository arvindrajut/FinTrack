// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h2>Expense Tracker</h2>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/expenses">Expenses</Link>
                <Link to="/reports">Reports</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
