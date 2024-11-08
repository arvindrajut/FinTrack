import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        date: '',
        category: '',
        paymentMethod: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, date, category, paymentMethod } = expenseInfo;
        if (!amount || !text || !date || !category || !paymentMethod) {
            handleError('Please fill in all expense details');
            return;
        }
        addTransaction(expenseInfo);
        setExpenseInfo({
            amount: '',
            text: '',
            date: '',
            category: '',
            paymentMethod: ''
        });
    };

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter expense detail...'
                        value={expenseInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <div>
                    <label htmlFor='date'>Date</label>
                    <input
                        onChange={handleChange}
                        type='date'
                        name='date'
                        value={expenseInfo.date}
                    />
                </div>
                <div>
                    <label htmlFor='category'>Category</label>
                    <select
                        onChange={handleChange}
                        name='category'
                        value={expenseInfo.category}
                    >
                        <option value=''>Select category</option>
                        <option value='Food'>Food</option>
                        <option value='Transport'>Transport</option>
                        <option value='Entertainment'>Entertainment</option>
                        <option value='Utilities'>Utilities</option>
                        <option value='Healthcare'>Healthcare</option>
                        <option value='Other'>Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='paymentMethod'>Payment Method</label>
                    <select
                        onChange={handleChange}
                        name='paymentMethod'
                        value={expenseInfo.paymentMethod}
                    >
                        <option value=''>Select payment method</option>
                        <option value='Cash'>Cash</option>
                        <option value='Credit Card'>Credit Card</option>
                        <option value='Debit Card'>Debit Card</option>
                        <option value='Bank Transfer'>Bank Transfer</option>
                        <option value='Other'>Other</option>
                    </select>
                </div>
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    );
}

export default ExpenseForm;
