// import type  { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//     user?: any;
// }

// export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         let token: any = "";

//         if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//             token = req.headers.authorization.split(" ")[1];
//         } else if (req.cookies && req.cookies.token) {
//             token = req.cookies.token;
//         }

//         if (!token) return res.status(401).json({ message: "Not authorized, no token"});

//         const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
//         req.user = payload;
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Not authorized" });
//     }
// }

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: any = "";
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.error("protect error:", err);
    res.status(401).json({ message: "Not authorized" });
  }
};

export const adminProtect = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin required" });
  next();
};
