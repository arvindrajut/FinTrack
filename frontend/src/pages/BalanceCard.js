import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { motion } from 'framer-motion';
import axios from 'axios';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

function BalanceChart({ account }) {
    const data = {
        labels: ['Available Balance', 'Current Balance'],
        datasets: [
            {
                label: account.name,
                data: [account.balances.available, account.balances.current],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                fill: true,
                tension: 0.1,
            }
        ],
    };

    return (
        <div className="w-full bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-8 max-w-2xl mx-auto" style={{ height: '400px' }}>
            <h3 className="text-2xl font-bold text-center mb-4">{account.name} Balance Overview</h3>
            <Line data={data} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: 'white' } } },
                scales: {
                    x: { ticks: { color: 'white' } },
                    y: { ticks: { color: 'white' }, beginAtZero: true }
                }
            }} />
        </div>
    );
}

function BalanceCard() {
    const [accounts, setAccounts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await axios.post('http://localhost:8080/plaid/transactions', {
                    access_token: localStorage.getItem('access_token')
                });
                setAccounts(response.data.accounts);
            } catch (err) {
                setError("Failed to fetch balance data");
            }
        };
        fetchBalances();
    }, []);

    const nextAccount = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % accounts.length);
    };

    const prevAccount = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + accounts.length) % accounts.length);
    };

    return (
        <div className="relative flex flex-col items-center">
            <div className="w-full max-w-lg relative mx-auto flex items-center justify-between">
                <button onClick={prevAccount} className="text-white text-2xl opacity-50 hover:opacity-100 transition">&#8592;</button>
                <motion.div className="relative w-[350px] h-[200px] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-xl p-6 text-white"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}>
                    {accounts.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold">{accounts[currentIndex].name} ({accounts[currentIndex].subtype})</h3>
                            <p className="text-sm font-light">Available: {accounts[currentIndex].balances.available} {accounts[currentIndex].balances.iso_currency_code}</p>
                            <p className="text-sm font-light">Current: {accounts[currentIndex].balances.current} {accounts[currentIndex].balances.iso_currency_code}</p>
                        </>
                    )}
                </motion.div>
                <button onClick={nextAccount} className="text-white text-2xl opacity-50 hover:opacity-100 transition">&#8594;</button>
            </div>
            {accounts.length > 0 && <BalanceChart account={accounts[currentIndex]} />}
        </div>
    );
}

export default BalanceCard;
