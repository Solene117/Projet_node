import express from 'express';
import cors from 'cors';
import reservationsRoutes from './routes/reservations.routes';
import lockerRoutes from './routes/locker.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationsRoutes);
app.use('/api/lockers', lockerRoutes);

export default app;
