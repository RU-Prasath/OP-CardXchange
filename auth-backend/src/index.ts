// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import cardRoutes from "./routes/cardRoutes/opCardRoutes/opCardRoutes.js"
import userRoutes from "./routes/userRoutes/user.routes.js"

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// connect DB
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/users", userRoutes);


// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
