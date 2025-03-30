import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTable, FaTh, FaPlusCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [cashTransactions, setCashTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("card"); // "card" or "table"
    const [showModal, setShowModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        name: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        fetchTransactions();
        fetchCashTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) throw new Error("No access token found");

            const response = await axios.post("http://localhost:8080/plaid/transactions", { access_token: accessToken });
            setTransactions(response.data.transactions || []);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCashTransactions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/transactions/cash");
            setCashTransactions(response.data);
        } catch (err) {
            console.error("Error fetching cash transactions:", err);
        }
    };

    const addCashTransaction = async () => {
        if (!newTransaction.name || !newTransaction.amount || !newTransaction.category) {
            alert("Please fill all fields.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/transactions/add", newTransaction);
            fetchCashTransactions();
            setShowModal(false);
            setNewTransaction({ name: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] });
        } catch (err) {
            console.error("Error adding cash transaction:", err);
        }
    };

    const allTransactions = transactions.concat(cashTransactions);

    const totalIncome = allTransactions.filter((txn) => txn.amount > 0).reduce((acc, txn) => acc + txn.amount, 0);
    const totalExpenses = allTransactions.filter((txn) => txn.amount < 0).reduce((acc, txn) => acc + txn.amount, 0);
    const netBalance = totalIncome + totalExpenses;

    const categoryTotals = allTransactions.reduce((acc, txn) => {
        const category = txn.category?.[0] || "Uncategorized";
        acc[category] = (acc[category] || 0) + Math.abs(txn.amount);
        return acc;
    }, {});

    const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return (
        <div className="p-8 bg-gray-900 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Transaction History
            </h1>

            {/* Mini Components */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
                <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-green-500 via-green-400 to-green-700">
                    <h2 className="text-lg font-bold mb-4">Transaction Summary</h2>
                    <p className="text-green-200 text-xl font-bold">Income: ${totalIncome.toFixed(2)}</p>
                    <p className="text-red-300 text-xl font-bold">Expenses: ${Math.abs(totalExpenses).toFixed(2)}</p>
                    <p className="text-blue-200 text-xl font-bold">Net Balance: ${netBalance.toFixed(2)}</p>
                </div>

                <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-purple-500 via-purple-400 to-purple-700">
                    <h2 className="text-lg font-bold mb-4">Top Spending Categories</h2>
                    {topCategories.map(([category, amount], index) => (
                        <p key={index} className="text-gray-200">
                            {index + 1}. {category} - <span className="text-red-300">${amount.toFixed(2)}</span>
                        </p>
                    ))}
                </div>

                <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-blue-500 via-blue-400 to-blue-700">
                    <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
                    {allTransactions.slice(0, 5).map((txn, index) => (
                        <p key={index} className="text-gray-200">
                            {txn.date} - {txn.name} -{" "}
                            <span className={txn.amount < 0 ? "text-red-300" : "text-green-300"}>
                                ${txn.amount.toFixed(2)}
                            </span>
                        </p>
                    ))}
                </div>
            </div>

            {/* Toggle View & Add Cash Transaction */}
            <div className="flex justify-between w-full max-w-6xl mb-4">
                <button
                    onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600"
                >
                    {viewMode === "card" ? <FaTable /> : <FaTh />}
                    {viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-500"
                >
                    <FaPlusCircle />
                    Add Cash Transaction
                </button>
            </div>

            {/* Transactions View */}
            {viewMode === "table" ? (
                <table className="w-full max-w-6xl bg-gray-800 text-white rounded-lg shadow-md p-4">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Merchant</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTransactions.map((txn, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-600">
                                <td className="p-3">{txn.date}</td>
                                <td className="p-3">{txn.name}</td>
                                <td className="p-3">{txn.category}</td>
                                <td className={`p-3 font-bold ${txn.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                                    ${txn.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {allTransactions.map((txn, index) => (
                        <motion.div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
                            <p className="text-white font-bold">{txn.name}</p>
                            <p className="text-gray-400">{txn.date}</p>
                            <p className={`text-lg font-semibold ${txn.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                                ${txn.amount.toFixed(2)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Transactions;
