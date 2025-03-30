const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction, getAllUsersAndExpenses } = require('../Controllers/ExpenseController');
const adminAuthMiddleware = require('../middlewares/AdminAuth');
const router = express.Router();

// Fetch all transactions (Plaid API + User-added transactions)
router.get('/', getAllTransactions);

// Add a cash transaction manually
router.post('/add', addTransaction);

// Delete a specific transaction by ID
router.delete('/:expenseId', deleteTransaction);

// Admin route: Fetch all users and expenses
router.get('/admin/all', adminAuthMiddleware, getAllUsersAndExpenses);

module.exports = router;
