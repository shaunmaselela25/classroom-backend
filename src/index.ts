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

// ---------- ENV CHECK ----------
if (!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set in .env file');
if (!process.env.BETTER_AUTH_BASE_URL) console.warn('BETTER_AUTH_BASE_URL is not set. Better Auth may fail.');

// ---------- CORS ----------
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // fixed wildcard

// ---------- Middleware ----------
app.use(express.json());

// Better-auth handler (fixed wildcard)
app.all("/api/auth/:splat(*)", toNodeHandler(auth));

// ---------- API ROUTES ----------
app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);

// Security middleware
app.use(securityMiddleware);

// ---------- Health / Root ----------
app.get(["/api", "/api/"], (req, res) => {
  res.json({ message: "Classroom API is running", version: "1.0.0" });
});

app.get('/', (req, res) => {
  res.send('Hello, welcome to the Classroom API!');
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
