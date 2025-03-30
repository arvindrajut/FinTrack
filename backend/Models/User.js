const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Check if the model already exists to avoid re-compiling
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    expenses: [
        {
            text: { type: String, required: true },
            amount: { type: Number, required: true },
            date: { type: Date, required: true },
            category: { type: String, required: true },
            paymentMethod: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);

module.exports = UserModel;
