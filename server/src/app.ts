import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import documentRoutes from "./routes/documentRoutes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" })); // limiting the request body size to 10kb


// Rate limiting on auth routes to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false
});

// General limiter for all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", generalLimiter, documentRoutes);

app.get("/", (req, res) => {
  res.send("Secure AI Assistant API is running successfully!");
});

//Handle unknown routes (prevent stack trace leakage)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler - OWASP A05: never leak stack traces
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;