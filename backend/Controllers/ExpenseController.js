const UserModel = require("../Models/User");

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: req.body } },
            { new: true } // For Returning the updated documents
        )
        console.log("request body -->",req.body)
        res.status(200)
            .json({
                message: "Expense added successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findById(_id).select('expenses');
        res.status(200)
            .json({
                message: "Fetched Expenses successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense Deleted successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
}
// const UserModel = require("../Models/User");

// // Add Transaction (for logged-in user)
// const addTransaction = async (req, res) => {
//     const { _id } = req.user;
//     console.log(_id, req.body);
//     try {
//         const userData = await UserModel.findByIdAndUpdate(
//             _id,
//             { $push: { expenses: req.body } },
//             { new: true } // For Returning the updated document
//         );
//         console.log("request body -->", req.body);
//         res.status(200).json({
//             message: "Expense added successfully",
//             success: true,
//             data: userData?.expenses
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: err,
//             success: false
//         });
//     }
// };

// // Get All Transactions (for logged-in user)
// const getAllTransactions = async (req, res) => {
//     const { _id } = req.user;
//     console.log(_id, req.body);
//     try {
//         const userData = await UserModel.findById(_id).select('expenses');
//         res.status(200).json({
//             message: "Fetched Expenses successfully",
//             success: true,
//             data: userData?.expenses
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: err,
//             success: false
//         });
//     }
// };

// // Delete Transaction (for logged-in user)
// const deleteTransaction = async (req, res) => {
//     const { _id } = req.user;
//     const expenseId = req.params.expenseId;
//     try {
//         const userData = await UserModel.findByIdAndUpdate(
//             _id,
//             { $pull: { expenses: { _id: expenseId } } },
//             { new: true } // For Returning the updated document
//         );
//         res.status(200).json({
//             message: "Expense Deleted successfully",
//             success: true,
//             data: userData?.expenses
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: err,
//             success: false
//         });
//     }
// };

// // Get All Users and Their Expenses (for admin only)
// const getAllUsersAndExpenses = async (req, res) => {
//     try {
//         // Fetch all users along with their expenses
//         const usersData = await UserModel.find({}, 'name email expenses');
//         res.status(200).json({
//             message: "Fetched all users and expenses successfully",
//             success: true,
//             data: usersData
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: "Something went wrong",
//             error: err,
//             success: false
//         });
//     }
// };

// module.exports = {
//     addTransaction,
//     getAllTransactions,
//     deleteTransaction,
//     getAllUsersAndExpenses // Export the new function
// };
