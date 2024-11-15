import React from 'react';
import { motion } from 'framer-motion';

function AccountOverview({ account, onClose }) {
    if (!account) return null;

    const { name, official_name, persistent_account_id, subtype, type, balances } = account;
    const { available = 0, current = 0, iso_currency_code = 'USD' } = balances || {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-xl p-10 max-w-lg w-full text-white overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ backdropFilter: 'blur(10px)' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 text-3xl focus:outline-none"
                >
                    ✕
                </button>
                <h2 className="text-4xl font-bold text-purple-500 mb-8 text-center">Account Overview</h2>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-semibold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-xl font-semibold">{name}</div>
                            <div className="text-sm text-gray-400">{official_name || 'N/A'}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                            <span className="block text-gray-400 text-sm">Account Type</span>
                            <span className="block text-lg font-medium">{type}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">Subtype</span>
                            <span className="block text-lg font-medium">{subtype}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">Available Balance</span>
                            <span className="block text-2xl font-bold">{iso_currency_code} {available.toFixed(2)}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-sm">Current Balance</span>
                            <span className="block text-2xl font-bold">{iso_currency_code} {current.toFixed(2)}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-gray-400 text-sm">Persistent Account ID</span>
                            <span className="block text-lg font-medium break-all">{persistent_account_id}</span>
                        </div>
                    </div>
                </div>

                {/* Animated Accent Elements */}
                <motion.div 
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-60"
                />
                <motion.div 
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 opacity-60"
                />
            </motion.div>
        </div>
    );
}

export default AccountOverview;
