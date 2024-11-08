// src/components/ExpenseTable.js
import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {
    return (
        <div className="expense-table-container">
            <table className="expense-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Payment Method</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={index}>
                            <td className="expense-description">{expense.text}</td>
                            <td
                                className="expense-amount"
                                style={{ color: expense.amount > 0 ? '#27ae60' : '#c0392b' }}
                            >
                                ${expense.amount}
                            </td>
                            <td className="expense-date">{expense.date || 'N/A'}</td>
                            <td className="expense-category">{expense.category || 'N/A'}</td>
                            <td className="expense-payment-method">{expense.paymentMethod || 'N/A'}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteExpens(expense._id)}
                                >
                                    ×
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseTable;
