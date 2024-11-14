import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import Navbar from './Navbar';
import Reports from './Reports';
import axios from 'axios';
import AccountDetails from './AccountDetails';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [linkToken, setLinkToken] = useState(null);
    const [accountDetails, setAccountDetails] = useState(null);
    const navigate = useNavigate();

    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                headers: { 'Authorization': localStorage.getItem('token') }
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

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        fetchExpenses();
        fetchLinkToken();
    }, [fetchExpenses]);

    const fetchLinkToken = async () => {
        try {
            const response = await axios.post(`${APIUrl}/plaid/create_link_token`, null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setLinkToken(response.data.link_token);
        } catch (error) {
            console.error('Error fetching link token:', error.message);
        }
    };

    useEffect(() => {
        const scriptId = 'plaid-link-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
            script.async = true;
            script.id = scriptId;
            document.body.appendChild(script);
        }
    }, []);

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

    const fetchAccounts = async (accessToken) => {
        try {
            const response = await axios.post(`${APIUrl}/plaid/accounts`, {
                access_token: accessToken,
            });
            setAccountDetails(response.data.accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error.message);
        }
    };

    const account = accountDetails && accountDetails.length > 0 ? accountDetails[0] : null;
    const accountName = account ? account.name : '';
    const officialName = account ? account.official_name : '';
    const persistentAccountId = account ? account.persistent_account_id : '';
    const subtype = account ? account.subtype : '';
    const type = account ? account.type : '';

    const balances = account ? account.balances : {};
    const availableBalance = balances.available || 0;
    const currentBalance = balances.current || 0;
    const currencyCode = balances.iso_currency_code || 'USD';

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

                    document.getElementById('link-button').addEventListener('click', (e) => {
                        handler.open();
                    });
                    clearInterval(interval);
                }
            }, 500);
        }
    }, [linkToken, handleOnSuccess]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('Logged out successfully');
        setTimeout(() => navigate('/login'), 1000);
    };

    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
        const exp = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const response = await fetch(`${APIUrl}/expenses/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': localStorage.getItem('token') }
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

    const addTransaction = async (data) => {
        try {
            const response = await fetch(`${APIUrl}/expenses`, {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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

    return (
        <div className="min-h-screen flex flex-col overflow-y-auto bg-gray-50">
            <Navbar onLogout={handleLogout} />
            <div className="flex flex-col items-center space-y-8 p-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {loggedInUser}</h1>
                <div className="flex flex-col items-center space-y-6 w-full max-w-lg">
                    <ExpenseDetails 
                        incomeAmt={incomeAmt} 
                        expenseAmt={expenseAmt} 
                        availableBalance={availableBalance} 
                        currentBalance={currentBalance} 
                        currencyCode={currencyCode} 
                    />
                    {/* Conditionally render AccountDetails only if accountDetails is available */}
                    {accountDetails && accountDetails.length > 0 && (
                        <AccountDetails 
                            accountName={accountName} 
                            officialName={officialName}
                            persistentAccountId={persistentAccountId}
                            subtype={subtype}
                            type={type}
                        />
                    )}
                    <ExpenseForm addTransaction={addTransaction} />
                    <button
                        id="link-button"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        disabled={!linkToken}
                    >
                        Connect to Bank
                    </button>
                    <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />
                    <Reports expenses={expenses} fetchExpenses={fetchExpenses} />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
