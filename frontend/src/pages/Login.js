import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { motion } from 'framer-motion';

function Login({ setIsAuthenticated, setIsAdmin }) {
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) return handleError('Email and password are required');
        
        try {
            const response = await fetch(`${APIUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            const { success, message, jwtToken, name, isAdmin, error } = result;

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('isAdmin', isAdmin);
                setIsAuthenticated(true);
                setIsAdmin(isAdmin);
                setTimeout(() => navigate('/home'), 1000);
            } else {
                handleError(error?.details[0].message || message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-tl from-indigo-500 via-blue-500 to-teal-400 rounded-xl blur-lg"></div>
                
                <h1 className="text-4xl font-bold text-center text-blue-300 mb-8">Login to Finaura</h1>
                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 font-medium mb-1">Email Address</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginInfo.email}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300 font-medium mb-1">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginInfo.password}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-400 to-indigo-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-teal-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transform transition-all hover:scale-105"
                    >
                        Login
                    </button>
                    <div className="text-center text-gray-400 mt-4">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="text-teal-300 font-medium hover:text-teal-500">
                            Signup
                        </Link>
                    </div>
                </form>
                <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 opacity-40 blur-xl"
                />
            </motion.div>
            <ToastContainer />
        </div>
    );
}

export default Login;
