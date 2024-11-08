import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

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
        if (expenses.length === 0 && typeof fetchExpenses === 'function') { // Verify fetchExpenses is a function
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
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
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
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.3)',
                    fill: true,
                },
            ],
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Reports</h1>

            <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px' }}>
                <h3>Monthly Expenses (Bar Chart)</h3>
                <Bar data={monthlyData} />
            </div>

            <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
                <h3>Category-wise Expenses (Pie Chart)</h3>
                <Pie data={categoryData} />
            </div>

            <div style={{ maxWidth: '700px', margin: 'auto', padding: '20px' }}>
                <h3>Weekly Expenses Trend (Line Chart)</h3>
                <Line data={weeklyTrendData} />
            </div>
        </div>
    );
};

export default Reports;
