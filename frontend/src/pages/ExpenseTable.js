import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

const categoryIcons = {
    "Food and Drink": "🍔",
    Transportation: "🚗",
    Travel: "✈️",
    Payment: "💳",
    Entertainment: "🎮",
    Shopping: "🛍️",
    Income: "💵",
    Uncategorized: "❓",
};

function ExpenseTable({ transactions, deleteTransaction, startEdit }) {
    const [isAdvancedView, setIsAdvancedView] = useState(false);

    const toggleView = () => setIsAdvancedView((prev) => !prev);

    return (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Transactions</h2>
                <button
                    className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    onClick={toggleView}
                >
                    {isAdvancedView ? (
                        <>
                            <FiToggleRight className="text-blue-500" />
                            <span>Switch to Simple View</span>
                        </>
                    ) : (
                        <>
                            <FiToggleLeft className="text-gray-500" />
                            <span>Switch to Advanced View</span>
                        </>
                    )}
                </button>
            </div>
            {isAdvancedView ? (
                <AdvancedView transactions={transactions} deleteTransaction={deleteTransaction} startEdit={startEdit} />
            ) : (
                <SimpleView transactions={transactions} deleteTransaction={deleteTransaction} startEdit={startEdit} />
            )}
        </div>
    );
}

function SimpleView({ transactions, deleteTransaction, startEdit }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <table className="min-w-full bg-gray-900 rounded-lg">
                <thead className="bg-gray-800">
                    <tr>
                        <th>Date</th>
                        <th>Merchant/Name</th>
                        <th>Amount</th>
                        <th>Source</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn) => (
                        <tr key={txn._id || txn.transaction_id} className="border-b border-gray-700 hover:bg-gray-800">
                            <td>{txn.date || "N/A"}</td>
                            <td>{txn.merchant_name || txn.name || "Unknown"}</td>
                            <td>
                                {txn.amount < 0 ? "-" : "+"}${Math.abs(txn.amount).toFixed(2)}
                            </td>
                            <td>{txn.isManual ? "Manual" : "Plaid"}</td>
                            <td>
                                {txn.isManual && (
                                    <>
                                        <button onClick={() => startEdit(txn)} className="text-blue-500 mr-2">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteTransaction(txn._id)} className="text-red-500">
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
}

function AdvancedView({ transactions, deleteTransaction, startEdit }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {transactions.map((txn) => (
                <motion.div
                    key={txn._id || txn.transaction_id}
                    className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold truncate">
                            {txn.merchant_name || txn.name || "Unknown"}
                        </h3>
                        <span className={`px-3 py-1 rounded-lg ${txn.amount < 0 ? "bg-red-500" : "bg-green-500"}`}>
                            {txn.amount < 0 ? "-" : "+"}${Math.abs(txn.amount).toFixed(2)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">{txn.date || "N/A"}</p>
                    {txn.isManual && (
                        <div className="mt-2 flex justify-end space-x-2">
                            <button onClick={() => startEdit(txn)} className="text-blue-500">
                                Edit
                            </button>
                            <button onClick={() => deleteTransaction(txn._id)} className="text-red-500">
                                Delete
                            </button>
                        </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
}

export default ExpenseTable;
