const UserModel = require("../models/User");
const axios = require("axios");

// Fetch all transactions (Plaid API + User transactions)
const getAllTransactions = async (req, res) => {
    const { _id } = req.user; // Get logged-in user
    try {
        // Fetch user transactions from MongoDB
        const userData = await UserModel.findById(_id).select('expenses');

        // Fetch Plaid transactions
        const accessToken = req.headers.authorization; 
        if (!accessToken) {
            return res.status(401).json({ message: "No access token found", success: false });
        }

        const plaidResponse = await axios.post("http://localhost:8080/plaid/transactions", { access_token: accessToken });
        const plaidTransactions = plaidResponse.data.transactions || [];

        // Merge Plaid transactions with user-added transactions
        const allTransactions = [...(userData?.expenses || []), ...plaidTransactions];

        res.status(200).json({
            message: "Fetched transactions successfully",
            success: true,
            transactions: allTransactions
        });
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

// Add a cash transaction
const addTransaction = async (req, res) => {
    const { _id } = req.user;
    try {
        const newTransaction = {
            text: req.body.text,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            paymentMethod: req.body.paymentMethod
        };

        // Save in MongoDB
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: newTransaction } },
            { new: true }
        );

        res.status(200).json({
            message: "Transaction added successfully",
            success: true,
            transactions: userData.expenses
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true }
        );
        res.status(200).json({
            message: "Transaction deleted successfully",
            success: true,
            transactions: userData.expenses
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

// Admin: Fetch all users' transactions
const getAllUsersAndExpenses = async (req, res) => {
    try {
        const usersData = await UserModel.find({}, 'name email expenses');
        res.status(200).json({ message: "Fetched all users and expenses successfully", success: true, data: usersData });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err, success: false });
    }
};

module.exports = { getAllTransactions, addTransaction, deleteTransaction, getAllUsersAndExpenses };
