// const jwt = require('jsonwebtoken');
// const UserModel = require('../Models/User');

// // Authentication Middleware: Verifies JWT Token
// const authMiddleware = (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Assuming the token contains user data like id and isAdmin
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Authentication failed' });
//     }
// };

// // Admin Authorization Middleware: Verifies User is an Admin
// const adminAuthMiddleware = (req, res, next) => {
//     if (req.user && req.user.isAdmin === true) {
//         next();
//     } else {
//         res.status(403).json({ message: 'Access denied: Not an admin' });
//     }
// };

// module.exports = {
//     authMiddleware,
//     adminAuthMiddleware
// };
