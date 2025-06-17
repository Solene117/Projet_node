import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import reservationsRoutes from './routes/reservations.routes';
import lockerRoutes from './routes/locker.routes';
import emailRoutes from './routes/email.routes'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/lockers', lockerRoutes);
app.use('/api/email', emailRoutes)

export default app;
