import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { restClient } from "@polygon.io/client-js";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("YOUR_GOOGLE_AI_API_KEY");

const InvestmentTracker = () => {
    const polygonAPIKey = "AIzaSyD9ZkBEa7v2MHHSrs3_hRVWxHUAtnSWY0A";
    const rest = restClient(polygonAPIKey);

    const [portfolio, setPortfolio] = useState([
        { type: "stock", ticker: "AAPL", shares: 10, avgPrice: 150 },
        { type: "crypto", symbol: "BTC", units: 0.5, avgPrice: 30000 },
    ]);
    const [allocation, setAllocation] = useState({ stocks: 0, crypto: 0 });
    const [historicalStocks, setHistoricalStocks] = useState([]);
    const [historicalCryptos, setHistoricalCryptos] = useState([]);
    const [aiInsights, setAIInsights] = useState([]);
    const [rebalancingTips, setRebalancingTips] = useState([]);
    const [growthForecast, setGrowthForecast] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [dividends, setDividends] = useState(0);
    const [riskLevel, setRiskLevel] = useState("Moderate");
    const [taxEstimation, setTaxEstimation] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        calculateAllocation();
        fetchHistoricalData();
        fetchAIInsights();
        calculateDividends();
        estimateTaxes();
        assessRiskLevel();
    }, [portfolio]);

    const calculateAllocation = () => {
        const stockValue = portfolio.filter(item => item.type === "stock")
            .reduce((acc, item) => acc + item.shares * item.avgPrice, 0);
        const cryptoValue = portfolio.filter(item => item.type === "crypto")
            .reduce((acc, item) => acc + item.units * item.avgPrice, 0);
        setAllocation({ stocks: stockValue, crypto: cryptoValue });
    };

    const fetchHistoricalData = async () => {
        try {
            const stockData = await rest.stocks.aggregates("AAPL", 1, "day", "2023-01-01", "2023-12-31");
            const stocks = stockData.results.map(point => ({ date: new Date(point.t).toLocaleDateString(), price: point.c }));
            setHistoricalStocks(stocks);
        } catch (err) {
            setError("Failed to fetch historical data.");
        }
    };

    const fetchAIInsights = async () => {
        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const aiPrompt = `Analyze the portfolio: ${JSON.stringify(portfolio)}`;
            const aiResponse = await model.generateContent(aiPrompt);
            const aiData = JSON.parse(aiResponse.response.text());
            setAIInsights(aiData.insights || []);
        } catch (error) {
            setAIInsights([{ insight: "Diversify your portfolio for better risk management." }]);
        } finally {
            setLoading(false);
        }
    };

    const calculateDividends = () => {
        const dividendStocks = { "AAPL": 0.6 };
        const totalDividends = portfolio.filter(item => item.type === "stock")
            .reduce((acc, item) => acc + (dividendStocks[item.ticker] || 0) * item.shares, 0);
        setDividends(totalDividends);
    };

    const estimateTaxes = () => {
        const capitalGainsTaxRate = 0.15;
        const estimatedTax = (allocation.stocks + allocation.crypto) * capitalGainsTaxRate;
        setTaxEstimation(estimatedTax);
    };

    const assessRiskLevel = () => {
        setRiskLevel(allocation.crypto / (allocation.stocks + allocation.crypto) > 0.3 ? "High" : "Moderate");
    };

    const renderAllocationChart = () => (
        <ReactECharts option={{
            tooltip: { trigger: "item" },
            legend: { top: "5%", left: "center" },
            series: [{
                name: "Portfolio Allocation",
                type: "pie",
                radius: ["40%", "70%"],
                data: [
                    { value: allocation.stocks, name: "Stocks" },
                    { value: allocation.crypto, name: "Crypto" },
                ],
            }],
        }} />
    );

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-10">
                Investment Tracker
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl bg-gray-800 shadow-lg p-6">
                    <h2 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">Portfolio Allocation</h2>
                    {renderAllocationChart()}
                </div>
                <div className="rounded-xl bg-gray-800 shadow-lg p-6">
                    <h2 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">Dividend Income</h2>
                    <p className="text-lg">Estimated Annual Dividends: ${dividends.toFixed(2)}</p>
                </div>
            </div>

            <div className="rounded-xl bg-gray-800 shadow-lg p-6 mt-6">
                <h2 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">Risk Assessment</h2>
                <p className={`text-lg ${riskLevel === "High" ? "text-red-500" : "text-green-400"}`}>Risk Level: {riskLevel}</p>
            </div>

            <div className="rounded-xl bg-gray-800 shadow-lg p-6 mt-6">
                <h2 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">Tax Implication Estimator</h2>
                <p className="text-lg">Estimated Capital Gains Tax: ${taxEstimation.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default InvestmentTracker;
