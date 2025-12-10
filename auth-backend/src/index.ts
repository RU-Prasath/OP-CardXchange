// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/database/db.js";
import authRoutes from "./routes/authRoutes.js"
import cardRoutes from "./routes/cardRoutes/one-piece/card.routes.js"
import userRoutes from "./routes/userRoutes/user.routes.js"

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// connect DB
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://tcg-marketplace-gilt.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

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

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import path from "path";
// import connectDB from "./config/database/db.js";

// // Import routes
// import authRoutes from "./routes/authRoutes.js";
// import cardRoutes from "./routes/cardRoutes/one-piece/card.routes.js";
// import userRoutes from "./routes/userRoutes/user.routes.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// // Serve static files
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/cards/one-piece", cardRoutes);
// app.use("/api/users", userRoutes);

// // Health check
// app.get("/api/health", (_req, res) => {
//   res.json({ 
//     status: "ok", 
//     timestamp: new Date().toISOString(),
//     service: "Card Trading Platform API"
//   });
// });

// // 404 handler
// app.use("*", (_req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Error handler
// app.use((err: any, _req: any, res: any, _next: any) => {
//   console.error("Server error:", err);
//   res.status(500).json({ 
//     message: "Internal server error",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
//   console.log(`📁 Uploads directory: ${path.join(process.cwd(), "uploads")}`);
//   console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
// });

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import path from "path";
// import connectDB from "./config/database/db.js";

// // Import routes
// import authRoutes from "./routes/authRoutes.js"
// import cardRoutes from "./routes/cardRoutes/one-piece/card.routes.js"
// import userRoutes from "./routes/userRoutes/user.routes.js"

// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// // Serve static files
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // Health check
// app.get("/api/health", (_req, res) => {
//   res.json({ 
//     status: "ok", 
//     timestamp: new Date().toISOString(),
//     service: "Card Trading Platform API"
//   });
// });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/cards/one-piece", cardRoutes);
// app.use("/api/users", userRoutes);

// // 404 Handler for API routes only
// app.use("/api/*", (_req, res) => {
//   res.status(404).json({ 
//     success: false,
//     message: "API endpoint not found" 
//   });
// });

// // Root route
// app.get("/", (_req, res) => {
//   res.json({ 
//     message: "Card Trading Platform API",
//     version: "1.0.0",
//     endpoints: {
//       auth: "/api/auth",
//       cards: "/api/cards/one-piece",
//       users: "/api/users",
//       health: "/api/health"
//     }
//   });
// });

// // Global 404 handler (for non-API routes)
// app.use("*", (_req, res) => {
//   res.status(404).json({ 
//     success: false,
//     message: "Route not found" 
//   });
// });

// // Error handler
// app.use((err: any, _req: any, res: any, _next: any) => {
//   console.error("Server error:", err);
  
//   // Handle specific error types
//   if (err.type === 'entity.parse.failed') {
//     return res.status(400).json({ 
//       success: false,
//       message: "Invalid JSON payload" 
//     });
//   }
  
//   res.status(500).json({ 
//     success: false,
//     message: "Internal server error",
//     ...(process.env.NODE_ENV === "development" && { error: err.message })
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
//   console.log(`📁 Uploads directory: ${path.join(process.cwd(), "uploads")}`);
//   console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
//   console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
// });