import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt, availableBalance, currentBalance, currencyCode }) {
    return (
        <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6 rounded-3xl shadow-lg max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Your Balance</h2>
            <div className="text-4xl font-bold text-gray-800 mb-6 text-center">
                ${incomeAmt - expenseAmt}
            </div>
            <div className="flex justify-around mb-6">
                <div className="text-center">
                    <p className="text-lg font-medium text-green-600">Income</p>
                    <span className="text-2xl font-semibold text-gray-800">${incomeAmt}</span>
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600">Expense</p>
                    <span className="text-2xl font-semibold text-gray-800">${expenseAmt}</span>
                </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
                <p className="text-gray-700 mb-2">
                    <strong>Available Balance:</strong> ${availableBalance} {currencyCode}
                </p>
                <p className="text-gray-700">
                    <strong>Current Balance:</strong> ${currentBalance} {currencyCode}
                </p>
            </div>
        </div>
    );
}

export default ExpenseDetails;
