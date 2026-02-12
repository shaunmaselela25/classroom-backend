import AgentAPI from "apminsight";
AgentAPI.config();

import express from 'express';
import cors from "cors";

import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import { securityMiddleware } from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Make sure FRONTEND_URL is set
if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set in .env file');

// ---------- CORS SETUP ----------
const corsOptions = {
  origin: process.env.FRONTEND_URL, // exact frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,                // allow cookies / credentials
  allowedHeaders: ['Content-Type', 'Authorization'], // headers allowed
  preflightContinue: false,         // stop OPTIONS here
  optionsSuccessStatus: 204,        // success status for OPTIONS
};

// Apply CORS globally
app.use(cors(corsOptions));
// Handle preflight for all routes
app.options('*', cors(corsOptions));

// ---------- Middleware ----------
app.use(express.json()); // parse JSON body

// Better-auth handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// ---------- API ROUTES ----------
app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);

// Security middleware (after routes)
app.use(securityMiddleware);

// ---------- Health / Root Routes ----------
app.get(["/api", "/api/"], (req, res) => {
  res.json({ message: "Classroom API is running", version: "1.0.0" });
});

app.get('/', (req, res) => {
  res.send('Hello, welcome to the Classroom API!');
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
