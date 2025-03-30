import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { FaCalendarAlt, FaChartLine, FaDollarSign, FaPiggyBank } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD9ZkBEa7v2MHHSrs3_hRVWxHUAtnSWY0A");

function SpendTimeline() {
    const [transactions, setTransactions] = useState([]);
    const [spendingCategories, setSpendingCategories] = useState([]);
    const [frequentMerchants, setFrequentMerchants] = useState([]);
    const [aiInsights, setAIInsights] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [savingsSuggestion, setSavingsSuggestion] = useState(0);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) throw new Error("No access token found");

            const response = await axios.post('http://localhost:8080/plaid/transactions', { access_token: accessToken });
            setTransactions(response.data.transactions);
            processTransactionData(response.data.transactions);
            fetchAIInsights(response.data.transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const processTransactionData = (transactions) => {
        let totalSpent = 0;
        const categoryTotals = {};
        const merchantTotals = {};
        transactions.forEach(txn => {
            if (txn.amount > 0) return;
            const category = txn.category?.[0] || "Uncategorized";
            categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(txn.amount);
            totalSpent += Math.abs(txn.amount);
            
            const merchant = txn.merchant_name || txn.name;
            merchantTotals[merchant] = (merchantTotals[merchant] || 0) + Math.abs(txn.amount);
        });
        
        setTotalSpent(totalSpent);
        setSpendingCategories(Object.entries(categoryTotals).map(([name, amount]) => ({ name, amount })));
        setFrequentMerchants(Object.entries(merchantTotals).sort((a, b) => b[1] - a[1]).slice(0, 5));
    };

    const fetchAIInsights = async (transactions) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Analyze these transactions and provide financial optimization strategies: ${JSON.stringify(transactions)}`;
            const response = await model.generateContent(prompt);
            const insights = JSON.parse(response.response.text());
            setAIInsights(insights || []);
            
            const savingsTip = totalSpent * 0.2;
            setSavingsSuggestion(savingsTip);
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            setAIInsights([{ suggestion: "Consider budgeting strategies to optimize spending." }]);
        }
    };

    const getSpendingCategoryOptions = () => ({
        tooltip: { trigger: "item" },
        legend: { top: "5%", left: "center", textStyle: { color: "#fff" } },
        series: [{
            name: "Spending Breakdown",
            type: "pie",
            radius: ["40%", "70%"],
            label: { show: true, color: "#fff" },
            data: spendingCategories.map(category => ({ value: category.amount, name: category.name })),
        }],
    });

    return (
        <div className="p-8 bg-gray-900 min-h-screen">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-10">
                Spend Timeline
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-blue-500 to-blue-800 flex items-center">
                    <FaDollarSign className="text-4xl mr-4" />
                    <div>
                        <h2 className="text-lg font-bold">Total Spent</h2>
                        <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
                    </div>
                </div>

                <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-green-500 to-green-800 flex items-center">
                    <FaPiggyBank className="text-4xl mr-4" />
                    <div>
                        <h2 className="text-lg font-bold">AI Suggested Savings</h2>
                        <p className="text-xl font-bold">Save ${savingsSuggestion.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-white">Date Range:</h2>
                <div className="flex items-center gap-4">
                    <label className="text-white flex items-center gap-2">
                        <FaCalendarAlt /> Start Date:
                    </label>
                    <DatePicker selected={startDate} onChange={setStartDate} className="p-2 rounded-lg" />
                    <label className="text-white flex items-center gap-2">
                        <FaCalendarAlt /> End Date:
                    </label>
                    <DatePicker selected={endDate} onChange={setEndDate} className="p-2 rounded-lg" />
                </div>
            </div>

            {loading ? (
                <div className="text-gray-400">Loading transactions...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="rounded-xl bg-gray-800 shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Spending Breakdown</h2>
                        <ReactECharts option={getSpendingCategoryOptions()} style={{ height: "400px" }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SpendTimeline;
