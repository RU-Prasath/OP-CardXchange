import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies first
        if (req.cookies.token) {
            token = req.cookies.token;
        }

        // Fallback to Authorization header
        else if (
            req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({
            success: false,
            message: "Not authorized, token invalid or expired",
        });
    }
};