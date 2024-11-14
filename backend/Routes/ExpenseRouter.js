// const express = require('express');
// const { getAllTransactions, addTransaction, deleteTransaction} = require('../Controllers/ExpenseController');
//     // const { adminAuthMiddleware} = require('../Middlewares/AdminAuth')
// const router = express.Router();

// router.get('/', getAllTransactions);
// router.post('/', addTransaction);
// router.delete('/:expenseId', deleteTransaction);

// // router.get('/admin/all', getAllUsersAndExpenses, ); // Only admins can access all transactions

// // router.get('/admin/all', adminAuthMiddleware, getAllUsersAndExpenses); // Admins can access all user transactions
// module.exports = router;

const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction, getAllUsersAndExpenses } = require('../Controllers/ExpenseController');
const adminAuthMiddleware = require('../Middlewares/AdminAuth');
const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', addTransaction);
router.delete('/:expenseId', deleteTransaction);

router.get('/admin/all', adminAuthMiddleware, getAllUsersAndExpenses);

module.exports = router;