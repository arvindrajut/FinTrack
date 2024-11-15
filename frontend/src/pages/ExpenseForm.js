import React, { useState } from 'react';
import { handleError } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        date: '',
        category: '',
        paymentMethod: ''
    });
    const [isFormVisible, setIsFormVisible] = useState(false);

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
        setIsFormVisible(false); // Collapse the form after submission
    };

    return (
        <div className="max-w-lg mx-auto mt-12">
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold p-4 rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-200 transform transition-all hover:scale-105"
            >
                {isFormVisible ? 'Close' : 'Add Cash Expenses'}
            </button>
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-3xl shadow-2xl mt-4 text-white overflow-hidden"
                    >
                        <h1 className="text-3xl font-bold text-red-500 mb-8 text-center">Add Cash Expense</h1>
                        <form onSubmit={addExpenses} className="space-y-6">
                            <div>
                                <label htmlFor="text" className="block text-gray-400 font-medium mb-2">Expense Detail</label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="text"
                                    placeholder="Enter expense detail..."
                                    value={expenseInfo.text}
                                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-gray-400 font-medium mb-2">Amount</label>
                                <input
                                    onChange={handleChange}
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount..."
                                    value={expenseInfo.amount}
                                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-gray-400 font-medium mb-2">Date</label>
                                <input
                                    onChange={handleChange}
                                    type="date"
                                    name="date"
                                    value={expenseInfo.date}
                                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-gray-400 font-medium mb-2">Category</label>
                                <select
                                    onChange={handleChange}
                                    name="category"
                                    value={expenseInfo.category}
                                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                <label htmlFor="paymentMethod" className="block text-gray-400 font-medium mb-2">Payment Method</label>
                                <select
                                    onChange={handleChange}
                                    name="paymentMethod"
                                    value={expenseInfo.paymentMethod}
                                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold p-4 rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transform transition-all hover:scale-105"
                            >
                                Add Expense
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ExpenseForm;
