import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import Navbar from './Navbar';
import axios from 'axios';
import AccountDetails from './AccountDetails';
import AccountOverview from './AccountOverview';
import BalanceCard from './BalanceCard';

function Home() {
    const [showAccountOverview, setShowAccountOverview] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [linkToken, setLinkToken] = useState(null);
    const [accountDetails, setAccountDetails] = useState([]);
    const navigate = useNavigate();

    // Fetch expenses data and update the state
    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    // Effect to set logged-in user and fetch initial data
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchExpenses();
        fetchLinkToken();
    }, [fetchExpenses]);

    // Fetch Plaid link token for connecting bank accounts
    const fetchLinkToken = async () => {
        try {
            const response = await axios.post(`${APIUrl}/plaid/create_link_token`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setLinkToken(response.data.link_token);
        } catch (error) {
            console.error('Error fetching link token:', error.message);
        }
    };

    // Handle success after Plaid connection is completed
    const handleOnSuccess = useCallback(async (publicToken) => {
        try {
            const response = await axios.post(`${APIUrl}/plaid/set_access_token`, {
                public_token: publicToken,
            });
            fetchAccounts(response.data.access_token);
        } catch (error) {
            console.error('Error exchanging public token:', error.message);
        }
    }, []);

    // Fetch account details after Plaid connection
    const fetchAccounts = async (accessToken) => {
        try {
            const response = await axios.post(`${APIUrl}/plaid/accounts`, {
                access_token: accessToken,
            });
            setAccountDetails(response.data.accounts || []);
        } catch (error) {
            console.error('Error fetching accounts:', error.message);
        }
    };

    // Effect to handle Plaid link button initialization
    useEffect(() => {
        if (linkToken) {
            const interval = setInterval(() => {
                if (window.Plaid) {
                    const handler = window.Plaid.create({
                        token: linkToken,
                        onSuccess: (publicToken) => {
                            handleOnSuccess(publicToken);
                        },
                    });

                    const linkButton = document.getElementById('link-button');
                    if (linkButton) {
                        linkButton.addEventListener('click', (e) => {
                            handler.open();
                        });
                        clearInterval(interval);
                    }
                }
            }, 500);
        }
    }, [linkToken, handleOnSuccess]);

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('Logged out successfully');
        setTimeout(() => navigate('/login'), 1000);
    };

    // Effect to calculate income and expense amounts
    useEffect(() => {
        const amounts = expenses.map((item) => item.amount);
        const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0);
        const exp = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    // Handle expense deletion
    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`${APIUrl}/expenses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: localStorage.getItem('token') },
            });
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    // Handle adding a new transaction
    const addTransaction = async (data) => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                method: 'POST',
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const totalBankBalance = accountDetails.reduce((acc, account) => acc + (account.balances.available || 0), 0);

    return (
        <div className="min-h-screen flex flex-col overflow-y-auto bg-gradient-to-br from-indigo-900 via-gray-900 to-black">
            <Navbar onLogout={handleLogout} />
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-around space-y-10 lg:space-y-0 lg:space-x-10 p-10">
                <div className="flex flex-col items-center lg:items-start space-y-8 w-full max-w-4xl">
                    <motion.h1 
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-bold text-pink-400 tracking-wide"
                    >
                        Welcome, {loggedInUser}
                    </motion.h1>
                    <BalanceCard
                        availableBalance={incomeAmt - expenseAmt + totalBankBalance}
                        currentBalance={incomeAmt}
                        currencyCode="USD"
                    />
                    {accountDetails.length > 0 ? (
                        <AccountDetails accounts={accountDetails} onAccountClick={(account) => { setSelectedAccount(account); setShowAccountOverview(true); }} />
                    ) : (
                        <button
                            id="link-button"
                            className="w-full lg:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold p-4 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transform transition hover:scale-105"
                            disabled={!linkToken}
                        >
                            Connect to Bank
                        </button>
                    )}
                    <ExpenseForm addTransaction={addTransaction} />
                </div>
                <div className="flex flex-col items-center lg:items-start space-y-8 w-full max-w-4xl">
                    <ExpenseTable expenses={expenses} deleteExpense={deleteExpense} />
                </div>
            </div>
            {showAccountOverview && selectedAccount && (
                <AccountOverview account={selectedAccount} onClose={() => setShowAccountOverview(false)} />
            )}
            {/* Custom Animated Glow Elements */}
            <motion.div 
                animate={{ opacity: [0.1, 0.4, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10 blur-2xl"
            />
            {/* <motion.div 
                animate={{ opacity: [0.1, 0.4, 0.4], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-blue-400 to-teal-400 opacity-10 blur-3xl"
            /> */}
            <ToastContainer />
        </div>
    );
}

export default Home;
