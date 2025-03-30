import React, { useRef, useState, useEffect } from 'react';
import { Parallax } from 'react-parallax';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';

function PlaidConnect() {
    const [linkToken, setLinkToken] = useState(null);
    const [connected, setConnected] = useState(() => {
        return localStorage.getItem('plaid_connected') === 'true';
    });
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
    const [updateMode, setUpdateMode] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!connected) {
            axios.post('http://localhost:8080/plaid/create_link_token').then((response) => {
                setLinkToken(response.data.link_token);
            }).catch(() => setError('Failed to generate link token'));
        }
    }, [connected]);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token) => {
            axios.post('http://localhost:8080/plaid/set_access_token', { public_token }).then((response) => {
                localStorage.setItem('plaid_connected', 'true');
                localStorage.setItem('access_token', response.data.access_token);
                setAccessToken(response.data.access_token);
                setConnected(true);
                setUpdateMode(false);
                setError(null);
            }).catch((err) => {
                if (err.response?.data?.error === 'ITEM_LOGIN_REQUIRED') {
                    setUpdateMode(true);
                    setError('Authentication required. Please reconnect.');
                } else {
                    setError('Error exchanging public token, try again.');
                }
            });
        },
        onExit: (err) => {
            if (err) setError('Plaid connection closed unexpectedly.');
        },
    });

    const handleLogout = () => {
        localStorage.removeItem('plaid_connected');
        localStorage.removeItem('access_token');
        setAccessToken(null);
        setConnected(false);
    };

    return (
        <div className="text-center mt-6">
            {!connected ? (
                <button 
                    onClick={() => open()} 
                    disabled={!ready} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
                >
                    {updateMode ? 'Reconnect to Bank' : 'Connect to Bank'}
                </button>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">Connected to Bank</div>
                    <button onClick={handleLogout} className="mt-4 text-red-500">Logout</button>
                </div>
            )}
            {error && (
                <div className="text-red-500 mt-4">{error}</div>
            )}
        </div>
    );
}

function Home() {
    return (
        <motion.div 
            className="relative min-h-screen flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Navbar />
            <Parallax
                bgImage="https://source.unsplash.com/1600x900/?finance,technology"
                strength={500}
                className="min-h-screen flex items-center justify-center text-center bg-cover bg-center"
            >
                <motion.div 
                    className="relative bg-black bg-opacity-50 p-10 rounded-lg z-10 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <h1 className="text-6xl font-bold text-purple-400">
                        Welcome to <span className="text-white">Finaura</span>
                    </h1>
                    <Typewriter
                        words={["Your Financial Companion.", "Manage Your Expenses.", "Plan Your Savings.", "Achieve Your Financial Goals."]}
                        loop
                        cursor
                        cursorStyle="_"
                        typeSpeed={40}
                        deleteSpeed={50}
                    />
                    <PlaidConnect />
                </motion.div>
            </Parallax>
        </motion.div>
    );
}

export default Home;
