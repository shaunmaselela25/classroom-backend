import express from 'express';
import cors from 'cors';

import router from './routes/subjects.js';

const app = express();
const PORT = 8000;

const frontendOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(
  cors({
    origin: frontendOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

//either router or subjectsRouter
app.use('/api/subjects', router);

app.get('/', (req, res) => {
  res.send('Hello, welcome to the Classroom API');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
