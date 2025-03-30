import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction, editTransaction, transactionToEdit, cancelEdit }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        date: '',
        category: '',
        paymentMethod: '',
    });

    useEffect(() => {
        if (transactionToEdit) {
            setExpenseInfo(transactionToEdit); // Populate fields for editing
        } else {
            setExpenseInfo({
                amount: '',
                text: '',
                date: '',
                category: '',
                paymentMethod: '',
            });
        }
    }, [transactionToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { amount, text, date, category, paymentMethod } = expenseInfo;

        // Validation: Check if all fields are filled
        if (!amount || !text || !date || !category || !paymentMethod) {
            handleError('Please fill in all expense details.');
            return;
        }

        if (transactionToEdit) {
            editTransaction(expenseInfo); // Update transaction
        } else {
            addTransaction(expenseInfo); // Add new transaction
        }

        setExpenseInfo({
            amount: '',
            text: '',
            date: '',
            category: '',
            paymentMethod: '',
        });

        cancelEdit(); // Close form after submission
    };

    return (
        <div className="max-w-lg mx-auto mt-12">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-3xl shadow-2xl text-white"
                >
                    <h1 className="text-3xl font-bold text-red-500 mb-8 text-center">
                        {transactionToEdit ? 'Edit Expense' : 'Add Cash Expense'}
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="text" className="block text-gray-400 font-medium mb-2">
                                Expense Detail
                            </label>
                            <input
                                type="text"
                                name="text"
                                value={expenseInfo.text}
                                onChange={handleChange}
                                placeholder="Enter expense detail"
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-gray-400 font-medium mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={expenseInfo.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-gray-400 font-medium mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={expenseInfo.date}
                                onChange={handleChange}
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-gray-400 font-medium mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={expenseInfo.category}
                                onChange={handleChange}
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
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
                            <label htmlFor="paymentMethod" className="block text-gray-400 font-medium mb-2">
                                Payment Method
                            </label>
                            <select
                                name="paymentMethod"
                                value={expenseInfo.paymentMethod}
                                onChange={handleChange}
                                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500"
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
                            className="w-full bg-purple-500 text-white font-semibold p-4 rounded-lg shadow-md hover:bg-purple-600 transition"
                        >
                            {transactionToEdit ? 'Update Expense' : 'Add Expense'}
                        </button>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default ExpenseForm;
