import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { motion } from 'framer-motion';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email, and password are required');
        }
        try {
            const url = `${APIUrl}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                handleError(result.message || result.error?.details[0]?.message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-black">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden"
            >
                {/* Custom Background Overlay for Creative Glow Effect */}
                <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-tl from-purple-600 via-pink-500 to-red-400 rounded-xl blur-lg"></div>
                
                <h1 className="text-4xl font-bold text-center text-white opacity-100 mb-8">Create an Account</h1>
                <form onSubmit={handleSignup} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="name" className="block text-gray-300 font-medium mb-1">Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={signupInfo.name}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-300 font-medium mb-1">Email Address</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={signupInfo.email}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300 font-medium mb-1">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={signupInfo.password}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transform transition-all hover:scale-105"
                    >
                        Signup
                    </button>
                    <div className="text-center text-gray-400 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-pink-400 font-medium hover:text-pink-600">
                            Login
                        </Link>
                    </div>
                </form>
                {/* Custom Animated Glow Element */}
                <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 opacity-40 blur-xl"
                />
            </motion.div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
