import React from 'react';
import { motion } from 'framer-motion';

const BalanceCard = ({ availableBalance, currentBalance, currencyCode }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-sm p-6 rounded-xl shadow-lg bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden"
        >
            {/* Background Overlay for Apple Card Aesthetic */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col space-y-4">
                <h3 className="text-2xl font-semibold">Balance</h3>
                <div className="flex flex-col">
                    <span className="text-sm text-gray-300">Available Balance</span>
                    <span className="text-3xl font-bold tracking-wide">{currencyCode} {availableBalance.toFixed(2)}</span>
                </div>
                <div className="flex flex-col mt-4">
                    <span className="text-sm text-gray-300">Current Balance</span>
                    <span className="text-2xl font-medium tracking-wide">{currencyCode} {currentBalance.toFixed(2)}</span>
                </div>
            </div>

            {/* Animated Glow Effect */}
            <motion.div 
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-50"
            />
        </motion.div>
    );
};

export default BalanceCard;
