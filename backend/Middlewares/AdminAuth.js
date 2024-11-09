const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken && decodedToken.isAdmin) {
            req.user = decodedToken;
            next();
        } else {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                success: false
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed!",
            success: false
        });
    }
};

module.exports = adminAuthMiddleware;