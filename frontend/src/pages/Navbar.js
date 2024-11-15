import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="w-full bg-black text-white p-4 flex justify-between items-center">
            {/* Logo and Hamburger Menu */}
            <h2 className="text-purple-400 text-2xl font-bold">Finaura</h2>
            <div className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FaBars className="text-white text-2xl cursor-pointer transition-transform transform hover:scale-110" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-8 items-center">
                <Link className="text-white text-lg transition hover:text-purple-400" to="/home">Home</Link>
                <Link className="text-white text-lg transition hover:text-purple-400" to="/expenses">Expenses</Link>
                <Link className="text-white text-lg transition hover:text-purple-400" to="/reports">Reports</Link>
                <Link className="text-white text-lg transition hover:text-purple-400" to="/admin">Admin Portal</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md transition hover:bg-red-600">Logout</button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 70 }}
                        className="absolute top-0 right-0 bg-black w-full h-full flex flex-col items-center justify-center z-20 p-8">
                        <div className="flex justify-between w-full mb-6">
                            <h2 className="text-purple-400 text-2xl font-bold">Finaura</h2>
                            <FaTimes 
                                onClick={() => setIsMenuOpen(false)} 
                                className="text-white text-2xl cursor-pointer transition-transform transform hover:scale-110" 
                            />
                        </div>
                        <Link className="text-white text-2xl py-4 transition hover:text-purple-400" to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link className="text-white text-2xl py-4 transition hover:text-purple-400" to="/expenses" onClick={() => setIsMenuOpen(false)}>Expenses</Link>
                        <Link className="text-white text-2xl py-4 transition hover:text-purple-400" to="/reports" onClick={() => setIsMenuOpen(false)}>Reports</Link>
                        <Link className="text-white text-2xl py-4 transition hover:text-purple-400" to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="mt-8 bg-red-500 text-white text-2xl px-6 py-3 rounded-md transition hover:bg-red-600">
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
