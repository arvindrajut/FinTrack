import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    return (
        <div className="balance-card">
            <h2>Your Balance</h2>
            <div className="balance-amount"> ${incomeAmt - expenseAmt}</div>
            <div className="amounts-container">
                <div className="amount-section">
                    Income
                    <span className="income-amount"> ${incomeAmt}</span>
                </div>
                <div className="amount-section">
                    Expense
                    <span className="expense-amount"> ${expenseAmt}</span>
                </div>
            </div>
        </div>
    );
}

export default ExpenseDetails;
