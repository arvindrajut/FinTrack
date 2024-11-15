import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Reports = ({ expenses = [], fetchExpenses }) => {  
    const [monthlyData, setMonthlyData] = useState({
        labels: [],
        datasets: [{ label: 'Monthly Expenses', data: [] }],
    });
    const [categoryData, setCategoryData] = useState({
        labels: [],
        datasets: [{ label: 'Category-wise Expenses', data: [] }],
    });
    const [weeklyTrendData, setWeeklyTrendData] = useState({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ label: 'Weekly Expenses Trend', data: [] }],
    });

    useEffect(() => {
        if (expenses.length === 0 && typeof fetchExpenses === 'function') {
            fetchExpenses();
        } else if (expenses.length > 0) {
            processData(expenses);
        }
    }, [expenses, fetchExpenses]);

    const processData = (expenses) => {
        if (!expenses || expenses.length === 0) return;

        const monthlyTotals = {};
        const categoryTotals = {};
        const weeklyTrends = [0, 0, 0, 0];

        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const month = date.toLocaleString('default', { month: 'short' });
            const week = Math.floor((date.getDate() - 1) / 7);

            monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            if (week >= 0 && week < 4) {
                weeklyTrends[week] += expense.amount;
            }
        });

        setMonthlyData({
            labels: Object.keys(monthlyTotals),
            datasets: [
                {
                    label: 'Monthly Expenses',
                    data: Object.values(monthlyTotals),
                    backgroundColor: 'rgba(138, 43, 226, 0.7)',
                },
            ],
        });

        setCategoryData({
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    label: 'Category-wise Expenses',
                    data: Object.values(categoryTotals),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                },
            ],
        });

        setWeeklyTrendData({
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Weekly Expenses Trend',
                    data: weeklyTrends,
                    borderColor: 'rgba(138, 43, 226, 1)',
                    backgroundColor: 'rgba(138, 43, 226, 0.3)',
                    fill: true,
                },
            ],
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-3xl shadow-2xl max-w-5xl mx-auto mt-12 text-white"
        >
            <h1 className="text-3xl font-bold text-purple-400 mb-8 text-center">Expense Reports</h1>
            <div className="space-y-12">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-purple-300 mb-4">Monthly Expenses</h3>
                    <Bar data={monthlyData} />
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-purple-300 mb-4">Category-wise Expenses</h3>
                    <Pie data={categoryData} />
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-purple-300 mb-4">Weekly Expenses Trend</h3>
                    <Line data={weeklyTrendData} />
                </div>
            </div>
        </motion.div>
    );
};

export default Reports;
