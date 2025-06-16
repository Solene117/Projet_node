import express from 'express';
import cors from 'cors';
import testRoutes from './routes/test.routes'
import lockerRoutes from './routes/locker.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/lockers', lockerRoutes);

export default app;
