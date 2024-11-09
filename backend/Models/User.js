// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     expenses: [
//         {
//             text: {
//                 type: String,
//                 required: true
//             },
//             amount: {
//                 type: Number,
//                 required: true
//             },
//             date: {
//                 type: Date,
//                 required: true
//             },
//             category: {
//                 type: String,
//                 required: true
//             },
//             paymentMethod: {
//                 type: String,
//                 required: true
//             },
//             createdAt: {
//                 type: Date,
//                 default: Date.now
//             }
//         }
//     ]
// });

// const UserModel = mongoose.model('users', UserSchema);
// module.exports = UserModel;
// Models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        default: false // Add this field to determine if the user is an admin
    },
    expenses: [
        {
            text: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            paymentMethod: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;