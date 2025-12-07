import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../repositories/UserRepository.js";

const userRepository = new UserRepository();

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined = "";
    
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await userRepository.findById(payload.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    res.status(401).json({ message: "Not authorized" });
  }
};

export const adminProtect = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};