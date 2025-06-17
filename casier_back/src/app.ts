import express from 'express';
import cors from 'cors';
import testRoutes from './routes/test.routes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

export default app;
