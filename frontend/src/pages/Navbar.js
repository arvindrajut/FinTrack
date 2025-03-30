import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="w-full bg-black text-white p-4 flex justify-between items-center fixed top-0 z-50">
            <h2 className="text-purple-400 text-2xl font-bold">Finaura</h2>
            <div className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FaBars className="text-white text-2xl cursor-pointer transition-transform transform hover:scale-110" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-8 items-center">
                <Link to="/balance" className="text-white text-lg transition hover:text-purple-400">
                    Balance
                </Link>
                <Link to="/timeline" className="text-white text-lg transition hover:text-purple-400">
                    Timeline
                </Link>
                <Link to="/savings" className="text-white text-lg transition hover:text-purple-400">
                    Savings
                </Link>
                <Link to="/reports" className="text-white text-lg transition hover:text-purple-400">
                    Reports
                </Link>
                <Link to="/transactions" className="text-white text-lg transition hover:text-purple-400">
                    Transactions
                </Link>
                <Link to="/budget" className="text-white text-lg transition hover:text-purple-400">
                    Budget
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md transition hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 70 }}
                        className="absolute top-0 right-0 bg-black w-full h-full flex flex-col items-center justify-center z-20 p-8"
                    >
                        <div className="flex justify-between w-full mb-6">
                            <h2 className="text-purple-400 text-2xl font-bold">Finaura</h2>
                            <FaTimes
                                onClick={() => setIsMenuOpen(false)}
                                className="text-white text-2xl cursor-pointer transition-transform transform hover:scale-110"
                            />
                        </div>
                        <Link to="/balance" className="text-white text-2xl py-4 transition hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                            Balance
                        </Link>
                        <Link to="/timeline" className="text-white text-2xl py-4 transition hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                            Timeline
                        </Link>
                        <Link to="/savings" className="text-white text-2xl py-4 transition hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                            Savings
                        </Link>
                        <Link to="/reports" className="text-white text-2xl py-4 transition hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                            Reports
                        </Link>
                        <Link to="/transactions" className="text-white text-2xl py-4 transition hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                            Transactions
                        </Link>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="mt-8 bg-red-500 text-white text-2xl px-6 py-3 rounded-md transition hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
