import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function AccountDetails({ accounts, onAccountClick }) {
    useEffect(() => {
        const linkButton = document.getElementById('link-button');
        if (linkButton) {
            linkButton.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    }, []);

    if (!accounts || accounts.length === 0) {
        return <div className="text-white text-center">No accounts available.</div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-3xl shadow-lg max-w-4xl w-full text-white space-y-6"
        >
            <h2 className="text-3xl font-semibold text-center mb-6 text-purple-400">Account Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account, index) => (
                    <motion.div
                        key={index}
                        onClick={() => onAccountClick && onAccountClick(account)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-6 bg-gradient-to-tr from-purple-600 to-indigo-700 rounded-2xl shadow-md cursor-pointer transform transition-transform hover:shadow-lg"
                    >
                        <h3 className="text-2xl font-bold mb-2">{account.name || 'Unnamed Account'}</h3>
                        <p className="text-lg">Type: {account.type}</p>
                        <p className="text-lg">Balance: ${account.balances.available ? account.balances.available.toFixed(2) : '0.00'}</p>
                        <p className="text-sm text-gray-300 mt-2">Institution: {account.institution || 'Unknown'}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default AccountDetails;
