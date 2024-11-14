import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        date: '',
        category: '',
        paymentMethod: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, date, category, paymentMethod } = expenseInfo;
        if (!amount || !text || !date || !category || !paymentMethod) {
            handleError('Please fill in all expense details');
            return;
        }
        addTransaction(expenseInfo);
        setExpenseInfo({
            amount: '',
            text: '',
            date: '',
            category: '',
            paymentMethod: ''
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 rounded-3xl shadow-lg max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Expense Tracker</h1>
            <form onSubmit={addExpenses} className="space-y-4">
                <div>
                    <label htmlFor="text" className="block text-gray-600 font-medium mb-1">Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="text"
                        placeholder="Enter expense detail..."
                        value={expenseInfo.text}
                        className="w-full p-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-gray-600 font-medium mb-1">Amount</label>
                    <input
                        onChange={handleChange}
                        type="number"
                        name="amount"
                        placeholder="Enter amount..."
                        value={expenseInfo.amount}
                        className="w-full p-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="date" className="block text-gray-600 font-medium mb-1">Date</label>
                    <input
                        onChange={handleChange}
                        type="date"
                        name="date"
                        value={expenseInfo.date}
                        className="w-full p-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-600 font-medium mb-1">Category</label>
                    <select
                        onChange={handleChange}
                        name="category"
                        value={expenseInfo.category}
                        className="w-full p-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="">Select category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="paymentMethod" className="block text-gray-600 font-medium mb-1">Payment Method</label>
                    <select
                        onChange={handleChange}
                        name="paymentMethod"
                        value={expenseInfo.paymentMethod}
                        className="w-full p-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="">Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold p-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Add Expense
                </button>
            </form>
        </div>
    );
}

export default ExpenseForm;
