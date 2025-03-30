import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyD9ZkBEa7v2MHHSrs3_hRVWxHUAtnSWY0A");

function Savings() {
    const [savingsData, setSavingsData] = useState({ income: 0, expenses: 0, savings: 0 });
    const [loading, setLoading] = useState(false);
    const [savingsGoal, setSavingsGoal] = useState(5000);
    const [aiInsights, setAiInsights] = useState("");
    const [aiChallenges, setAiChallenges] = useState([]);
    const [growthForecast, setGrowthForecast] = useState([]);
    const [savingsStreak, setSavingsStreak] = useState(5);
    const [missedSavingsAlert, setMissedSavingsAlert] = useState(false);
    const [nationalSavingsAverage, setNationalSavingsAverage] = useState(10000);

    useEffect(() => {
        fetchSavingsData();
    }, []);

    useEffect(() => {
        if (savingsData.savings > 0) {
            calculateSavingsGrowthForecast();
            fetchAISuggestions();
            checkMissedSavings();
        }
    }, [savingsGoal, savingsData]);

    const fetchSavingsData = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) throw new Error("No access token found");

            const response = await axios.post("http://localhost:8080/plaid/transactions", { access_token: accessToken });
            const transactions = response.data.transactions;

            setSavingsData(calculateSavings(transactions));
        } catch (error) {
            console.error("Error fetching savings data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSavings = (transactions) => {
        let income = 0, expenses = 0;

        transactions.forEach((txn) => {
            if (txn.amount > 0) income += txn.amount;
            else expenses += Math.abs(txn.amount);
        });

        return { income, expenses, savings: income - expenses };
    };

    const calculateSavingsGrowthForecast = () => {
        let projectedSavings = savingsData.savings;
        const forecast = [];

        for (let i = 1; i <= 12; i++) {
            projectedSavings += savingsGoal / 12;
            forecast.push({ month: `Month ${i}`, value: projectedSavings });
        }

        setGrowthForecast(forecast);
    };

    const fetchAISuggestions = async () => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Analyze the following savings details:
                - Income: ${savingsData.income}
                - Expenses: ${savingsData.expenses}
                - Current Savings: ${savingsData.savings}
                Generate personalized savings insights and three actionable savings challenges.
                Response format: { insights: "summary", challenges: ["challenge 1", "challenge 2", "challenge 3"] }
            `;

            const response = await model.generateContent(prompt);
            const aiResponse = JSON.parse(response.response.text());

            setAiInsights(aiResponse.insights || "AI analysis unavailable.");
            setAiChallenges(aiResponse.challenges || ["Save an extra $50 this week.", "Limit takeout meals.", "Automate monthly savings."]);
        } catch (error) {
            console.error("Error fetching AI insights:", error);
        }
    };

    const checkMissedSavings = () => {
        setMissedSavingsAlert(savingsData.savings < savingsGoal * 0.5);
    };

    const getSavingsGoalOptions = () => ({
        tooltip: { trigger: "item" },
        series: [
            {
                name: "Savings Goal",
                type: "gauge",
                detail: { formatter: "{value}%" },
                data: [{ value: ((savingsData?.savings || 0) / savingsGoal) * 100, name: "Goal Progress" }],
                axisLine: {
                    lineStyle: {
                        width: 15,
                        color: [
                            [0.3, "#FF6B6B"],
                            [0.7, "#FFD93D"],
                            [1, "#1DD1A1"],
                        ],
                    },
                },
            },
        ],
    });

    return (
        <motion.div className="p-8 bg-gray-900 min-h-screen flex flex-col items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-10">
                Savings Dashboard
            </h1>

            {loading ? <div className="text-gray-400">Loading savings data...</div> : (
                <>
                    {/* Savings Goal Adjustment */}
                    <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Set Your Savings Goal</h2>
                        <input type="range" min="1000" max="20000" step="500" value={savingsGoal}
                            onChange={(e) => setSavingsGoal(Number(e.target.value))} className="w-full" />
                        <p className="text-gray-300 mt-2">Goal: ${savingsGoal}</p>
                    </div>

                    {/* Savings Goal Progress Gauge */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Savings Goal Progress</h2>
                        <ReactECharts option={getSavingsGoalOptions()} style={{ height: "300px" }} />
                    </div>

                    {/* AI Insights & Challenges */}
                    <div className="mt-10 bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-3xl">
                        <h2 className="text-xl font-semibold text-gray-200">AI Savings Insights</h2>
                        <p className="text-gray-300">{aiInsights}</p>
                    </div>

                    <div className="mt-10 bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-3xl">
                        <h2 className="text-xl font-semibold text-gray-200">AI Savings Challenges</h2>
                        <ul className="space-y-4">
                            {aiChallenges.map((challenge, index) => (
                                <li key={index} className="bg-gray-700 text-gray-300 p-4 rounded-lg">{challenge}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Missed Savings Alert */}
                    {missedSavingsAlert && (
                        <div className="mt-6 bg-red-600 p-4 rounded-lg text-white text-center">
                            Warning: You are falling behind your savings goal!
                        </div>
                    )}
                </>
            )}
        </motion.div>
    );
}

export default Savings;
