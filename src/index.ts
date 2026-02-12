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

// Enable CORS for all routes
app.use(cors({
    origin: process.env.FRONTEND_URL,        // Must exactly match frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle OPTIONS preflight globally
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// ===== Authentication =====
// Fixed PathError: use :splat(*) instead of *splat
app.all('/api/auth/:splat(*)', toNodeHandler(auth));

// ===== Routes =====
// Remove ".js" from route mounting — Express uses paths, not filenames
app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes', classesRouter);

// ===== Security Middleware =====
app.use(securityMiddleware);

// ===== Default API status route =====
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
