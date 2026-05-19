import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/audit", auditRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SecureVault API is running",
        timestamp: new Date().toISOString(),
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
});