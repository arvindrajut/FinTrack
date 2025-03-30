import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyD9ZkBEa7v2MHHSrs3_hRVWxHUAtnSWY0A");

function SavingsTracker({ income = 0, expenses = 0 }) {
    const [savingsStreak, setSavingsStreak] = useState(5); // Days in a row user saved
    const [aiChallenges, setAIChallenges] = useState([]);
    const [aiSavingsAnalysis, setAISavingsAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [dummyDataMode, setDummyDataMode] = useState(false);

    const savings = income - expenses;

    const fetchAISuggestions = async () => {
        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // AI-generated challenges
            const challengesPrompt = `Based on a savings of $${savings}, income of $${income}, and expenses of $${expenses}, create weekly savings challenges to help the user save more effectively.`;
            const challengesResponse = await model.generateContent(challengesPrompt);
            const challengesData = JSON.parse(challengesResponse.response.text());
            setAIChallenges(challengesData.challenges || [
                "Save an extra $20 this week by skipping dining out.",
                "Cut your grocery expenses by 10% this week.",
                "Avoid spending on subscriptions for one month.",
            ]);

            // AI Savings Analysis
            const analysisPrompt = `Analyze the user's savings pattern given a savings of $${savings}, income of $${income}, and expenses of $${expenses}. Provide a one-sentence summary of their habits and a suggestion to improve savings.`;
            const analysisResponse = await model.generateContent(analysisPrompt);
            const analysisData = analysisResponse.response.text();
            setAISavingsAnalysis(analysisData || "You are saving consistently, but reducing discretionary expenses can accelerate your progress.");
        } catch (error) {
            console.error("Error fetching AI suggestions:", error);
            setAIChallenges([
                "Save an extra $20 this week by skipping dining out.",
                "Cut your grocery expenses by 10% this week.",
                "Avoid spending on subscriptions for one month.",
            ]);
            setAISavingsAnalysis("You are saving consistently, but reducing discretionary expenses can accelerate your progress.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!dummyDataMode) fetchAISuggestions();
    }, [income, expenses, dummyDataMode]);

    const populateWithDummyData = () => {
        setDummyDataMode(true);
        setSavingsStreak(30); // Longer savings streak for testing
        setAIChallenges([
            "Save $30 this week by walking or carpooling instead of using your car.",
            "Avoid eating out for the next 7 days to save $50.",
            "Set aside $15 daily for an emergency fund.",
        ]);
        setAISavingsAnalysis(
            "Your saving habits are improving, but discretionary spending on entertainment and dining out can still be reduced."
        );
    };

    const getStreakChartOptions = () => ({
        tooltip: {
            trigger: "item",
        },
        legend: {
            top: "5%",
            left: "center",
        },
        series: [
            {
                name: "Savings Streak",
                type: "gauge",
                detail: { formatter: "{value} days" },
                data: [{ value: savingsStreak, name: "Current Streak" }],
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-purple-800 via-gray-800 to-black p-6 rounded-lg shadow-md text-white"
        >
            <h2 className="text-2xl font-bold mb-4 text-center">Savings Tracker</h2>

            {/* Populate with Dummy Data Button */}
            <div className="mb-6 text-center">
                <button
                    onClick={populateWithDummyData}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    Populate with Dummy Data
                </button>
            </div>

            {/* AI Savings Analysis */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
                <h3 className="text-lg font-bold text-center mb-4">AI Savings Insights</h3>
                {loading && !dummyDataMode ? (
                    <p className="text-gray-400 text-center">Analyzing savings...</p>
                ) : (
                    <p className="text-gray-300 text-center">{aiSavingsAnalysis}</p>
                )}
            </div>

            {/* Savings Streak Tracker */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
                <h3 className="text-lg font-bold text-center mb-4">Savings Streak</h3>
                {loading && !dummyDataMode ? (
                    <p className="text-gray-400 text-center">Loading streak...</p>
                ) : (
                    <ReactECharts option={getStreakChartOptions()} style={{ height: "300px" }} />
                )}
            </div>

            {/* AI-Powered Challenges */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-bold text-center mb-4">Savings Challenges</h3>
                {loading && !dummyDataMode ? (
                    <p className="text-gray-400 text-center">Generating challenges...</p>
                ) : (
                    <ul className="space-y-2">
                        {aiChallenges.map((challenge, index) => (
                            <li
                                key={index}
                                className="bg-gray-700 text-gray-300 p-3 rounded hover:shadow-xl transition-shadow"
                            >
                                {challenge}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.div>
    );
}

export default SavingsTracker;
