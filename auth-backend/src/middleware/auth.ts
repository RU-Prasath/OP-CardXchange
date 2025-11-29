import type  { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token: any = "";

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) return res.status(401).json({ message: "Not authorized, no token"});

        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized" });
    }
}