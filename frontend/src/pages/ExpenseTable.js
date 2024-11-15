import React from 'react';
import { motion } from 'framer-motion';

const ExpenseTable = ({ expenses, deleteExpens }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-3xl shadow-2xl max-w-full mx-auto mt-12 text-white lg:max-w-4xl"
        >
            <h1 className="text-3xl font-bold text-purple-400 mb-8 text-center">Expense List</h1>
            <div className="overflow-x-auto w-full">
                <table className="min-w-full text-left table-auto">
                    <thead>
                        <tr className="bg-gray-800 text-purple-300">
                            <th className="p-4 whitespace-nowrap">Description</th>
                            <th className="p-4 whitespace-nowrap">Amount</th>
                            <th className="p-4 whitespace-nowrap">Date</th>
                            <th className="p-4 whitespace-nowrap">Category</th>
                            <th className="p-4 whitespace-nowrap">Payment Method</th>
                            <th className="p-4 whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="odd:bg-gray-800 even:bg-gray-700 hover:bg-gray-600 transition-colors"
                            >
                                <td className="p-4 whitespace-nowrap">{expense.text}</td>
                                <td
                                    className="p-4 font-bold whitespace-nowrap"
                                    style={{ color: expense.amount > 0 ? '#27ae60' : '#c0392b' }}
                                >
                                    ${expense.amount}
                                </td>
                                <td className="p-4 whitespace-nowrap">{expense.date || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">{expense.category || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">{expense.paymentMethod || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <button
                                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                                        onClick={() => deleteExpens(expense._id)}
                                    >
                                        ×
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ExpenseTable;
