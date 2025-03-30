import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { saveAs } from "file-saver";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyD9ZkBEa7v2MHHSrs3_hRVWxHUAtnSWY0A");

function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [aiRecommendations, setAIRecommendations] = useState([]);
    const [actualData, setActualData] = useState({ monthly: {}, categories: {}, incomeVsExpense: {}, savings: {} });
    const [idealData, setIdealData] = useState({ monthly: {}, categories: {}, incomeVsExpense: {}, savings: {} });
    const [loading, setLoading] = useState(false);
    const [currentGraph, setCurrentGraph] = useState(0);

    const graphTitles = [
        "Monthly Spending Trends",
        "Spending Categories",
        "Income vs. Expenses",
        "Savings Growth"
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    throw new Error("No access token found");
                }
                
                const transactionsResponse = await axios.post('http://localhost:8080/plaid/transactions', { access_token: accessToken });
                setTransactions(transactionsResponse.data.transactions);
                await fetchAIInsights(transactionsResponse.data.transactions);
            } catch (error) {
                console.error("Error fetching financial data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchAIInsights = async (transactions) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Analyze these transactions and generate ideal financial trends for:
                1. Monthly Spending Trends
                2. Spending Categories
                3. Income vs. Expenses
                4. Savings Growth
                Return a JSON object with properties 'actualData' and 'idealData' where each property contains data for 'monthly', 'categories', 'incomeVsExpense', and 'savings'.`;
            const response = await model.generateContent(prompt);
            const insights = JSON.parse(response.response.text());
            setAIRecommendations(insights.recommendations || []);
            setActualData(insights.actualData || { monthly: {}, categories: {}, incomeVsExpense: {}, savings: {} });
            setIdealData(insights.idealData || { monthly: {}, categories: {}, incomeVsExpense: {}, savings: {} });
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            setAIRecommendations([{ suggestion: "Optimize spending to align with ideal financial goals." }]);
        }
    };

    const exportToCSV = () => {
        const csvData = transactions.map(txn => [txn.date, txn.amount, txn.personal_finance_category?.primary || "Other"].join(",")).join("\n");
        const blob = new Blob(["Date,Amount,Category\n" + csvData], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "financial_report.csv");
    };

    const getChartOptions = (title, actual = {}, ideal = {}, chartType) => ({
        tooltip: { trigger: "axis" },
        legend: { top: "5%", left: "center" },
        xAxis: { type: "category", data: Object.keys(actual || {}) },
        yAxis: { type: "value" },
        series: [
            {
                name: `Actual ${title}`,
                type: chartType,
                data: Object.values(actual || {}),
                color: "#FF6384",
            },
            {
                name: `Ideal ${title}`,
                type: chartType,
                data: Object.values(ideal || {}),
                color: "#36A2EB",
            }
        ],
    });

    const graphTypes = ["bar", "pie", "line", "bar"];

    return (
        <div className="p-8 bg-gray-900 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-10">
                Financial Reports
            </h1>

            <button onClick={exportToCSV} className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-700">
                Download CSV Report
            </button>

            {loading ? (
                <div className="text-gray-400">Loading reports...</div>
            ) : (
                <div className="relative w-full flex items-center justify-center">
                    <button
                        className="absolute left-0 text-white text-2xl bg-gray-700 px-3 py-2 rounded-full hover:bg-gray-600"
                        onClick={() => setCurrentGraph((prev) => (prev === 0 ? 3 : prev - 1))}
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="w-[600px] bg-gray-800 shadow-lg p-6 rounded-xl text-center">
                        <h2 className="text-xl font-semibold text-gray-200 pb-2 mb-4">{graphTitles[currentGraph]}</h2>
                        <ReactECharts option={getChartOptions(graphTitles[currentGraph], actualData[graphTypes[currentGraph]], idealData[graphTypes[currentGraph]], graphTypes[currentGraph])} style={{ height: "400px" }} />
                    </div>

                    <button
                        className="absolute right-0 text-white text-2xl bg-gray-700 px-3 py-2 rounded-full hover:bg-gray-600"
                        onClick={() => setCurrentGraph((prev) => (prev === 3 ? 0 : prev + 1))}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            )}

            <div className="mt-10 bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-3xl">
                <h2 className="text-xl font-semibold text-gray-200 pb-2 mb-4">AI Recommendations</h2>
                <ul className="space-y-4">
                    {aiRecommendations.map((rec, index) => (
                        <li key={index} className="bg-gray-700 text-gray-300 p-4 rounded-lg">
                            <span className="text-blue-400 font-semibold">Tip {index + 1}:</span> {rec.suggestion}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Reports;