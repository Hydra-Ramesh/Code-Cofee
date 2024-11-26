require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error"; // Assuming this handles errors globally
import userRouter from './routes/user.route';  // Importing your user route

export const app = express();

// Middleware
app.use(express.json({ limit: "50mb" })); // Handle large JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: process.env.ORIGIN || "*",  // Fallback to '*' if ORIGIN is not set in .env
    credentials: true,  // Allow sending cookies with cross-origin requests
  })
);

// Routes
app.use("/api/v1", userRouter);

// Test route for health check
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Handle favicon.ico requests explicitly
app.all("/favicon.ico", (req: Request, res: Response) => {
  res.status(204).end(); // Return a 204 No Content status for favicon requests
});

// Handle undefined routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} does not exist`) as any;
  err.statusCode = 404;  // Use `statusCode` consistently with your error handling
  next(err);
});

// Global error handler middleware
app.use(ErrorMiddleware);

