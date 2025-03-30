import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { FaPlusCircle, FaTrash } from "react-icons/fa";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD9ZkBEa7v2MHHSrs3_hRVWxHUAtnSWY0A");

function Budget() {
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [allocatedBudget, setAllocatedBudget] = useState(0);
    const [envelopes, setEnvelopes] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [aiInsights, setAIInsights] = useState("");
    const [loading, setLoading] = useState(true);
    const [showEnvelopeModal, setShowEnvelopeModal] = useState(false);
    const [newEnvelope, setNewEnvelope] = useState({ name: "", amount: "" });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) throw new Error("No access token found");

            const response = await axios.post("http://localhost:8080/plaid/transactions", { access_token: accessToken });
            const transactions = response.data.transactions || [];
            setTransactions(transactions);

            const income = transactions.filter(txn => txn.amount > 0).reduce((acc, txn) => acc + txn.amount, 0);
            setTotalIncome(income);

            generateAIInsights(transactions, income);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    const generateAIInsights = async (transactions, income) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Based on the following transactions and income ($${income}), provide ideal budgeting suggestions:
            ${JSON.stringify(transactions)}. Return insights in a brief summary.`;

            const response = await model.generateContent(prompt);
            setAIInsights(response.response.text() || "AI insights unavailable.");
        } catch (error) {
            console.error("AI Insights Error:", error);
        }
    };

    const categorizedExpenses = useMemo(() => {
        const categories = {};
        transactions.forEach((txn) => {
            if (txn.amount < 0) {
                const category = txn.category?.[0] || "Uncategorized";
                categories[category] = (categories[category] || 0) + Math.abs(txn.amount);
            }
        });
        return categories;
    }, [transactions]);

    // Update allocated budget whenever envelopes change
    useEffect(() => {
        setAllocatedBudget(envelopes.reduce((acc, env) => acc + parseFloat(env.amount || 0), 0));
    }, [envelopes]);

    const remainingBalance = totalIncome - allocatedBudget;

    const getBudgetChartOptions = () => ({
        tooltip: { trigger: "item" },
        legend: { top: "5%", left: "center", textStyle: { color: "#fff" } },
        series: [{
            name: "Budget Allocation",
            type: "pie",
            radius: ["40%", "70%"],
            label: { show: true, color: "#fff" },
            data: [
                ...envelopes.map(env => ({ value: env.amount, name: env.name })),
                { value: remainingBalance, name: "Unallocated", itemStyle: { color: "#555" } }
            ],
        }],
    });

    const addEnvelope = () => {
        if (!newEnvelope.name || !newEnvelope.amount) return;
        setEnvelopes([...envelopes, { ...newEnvelope, spent: 0 }]);
        setShowEnvelopeModal(false);
        setNewEnvelope({ name: "", amount: "" });
    };

    const deleteEnvelope = (index) => {
        const updatedEnvelopes = envelopes.filter((_, i) => i !== index);
        setEnvelopes(updatedEnvelopes);
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
                Budgeting & Expense Planning
            </h1>

            {/* Balance Status Bar */}
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-200 mb-2">Total Balance Overview</h2>
                <p className="text-xl font-bold text-green-400">${totalIncome.toFixed(2)}</p>
                <div className="w-full bg-gray-600 rounded-lg h-6 overflow-hidden mt-2">
                    <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(allocatedBudget / totalIncome) * 100}%` }}></div>
                </div>
                <p className="text-gray-300 mt-2">
                    <span className="text-yellow-300">Allocated:</span> ${allocatedBudget.toFixed(2)} | 
                    <span className="text-blue-300"> Remaining:</span> ${remainingBalance.toFixed(2)}
                </p>
            </div>

            {/* Budget Pie Chart */}
            <div className="w-full max-w-4xl bg-gray-800 shadow-lg p-6 rounded-xl text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-200 pb-2 mb-4">Budget Allocation</h2>
                <ReactECharts option={getBudgetChartOptions()} style={{ height: "400px" }} />
            </div>

            {/* Envelope Budgeting */}
            <div className="w-full max-w-4xl bg-gray-800 shadow-lg p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-200 pb-2 mb-4">Envelope Budgeting</h2>

                <button
                    onClick={() => setShowEnvelopeModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 mb-4"
                >
                    <FaPlusCircle /> Add Custom Envelope
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {envelopes.map((env, index) => (
                        <motion.div key={index} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{env.name}</h3>
                                <p className="text-sm text-gray-300">Allocated: ${env.amount}</p>
                            </div>
                            <button onClick={() => deleteEnvelope(index)} className="text-red-400 hover:text-red-600">
                                <FaTrash />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal for Adding Custom Envelope */}
            {showEnvelopeModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Create Budget Envelope</h2>
                        <input type="text" placeholder="Name" className="p-2 bg-gray-700 text-white rounded w-full mb-2" value={newEnvelope.name} onChange={(e) => setNewEnvelope({ ...newEnvelope, name: e.target.value })} />
                        <input type="number" placeholder="Amount" className="p-2 bg-gray-700 text-white rounded w-full mb-4" value={newEnvelope.amount} onChange={(e) => setNewEnvelope({ ...newEnvelope, amount: e.target.value })} />
                        <button onClick={addEnvelope} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">Add Envelope</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Budget;
