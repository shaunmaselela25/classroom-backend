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

// ===== Check environment =====
if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not set in .env file');
}

// ===== Middleware =====

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,        // Must match frontend exactly
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle OPTIONS preflight globally
app.options('*', cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Parse JSON
app.use(express.json());

// ===== Authentication =====
app.all('/api/auth/*splat', toNodeHandler(auth));

// ===== Routes =====
app.use('/api/subjects.js', subjectsRouter);
app.use('/api/users.js', usersRouter);
app.use('/api/classes.js', classesRouter);

// ===== Security Middleware =====
app.use(securityMiddleware);

// ===== Default API route =====
// Makes GET /api return a JSON status instead of "Cannot GET /api"
app.get('/api', (req, res) => {
    res.json({ message: 'Classroom API is running', version: '1.0.0' });
});

// ===== Root =====
app.get('/', (req, res) => {
    res.send('Hello, welcome to the Classroom API!');
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
