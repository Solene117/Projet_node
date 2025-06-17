import express from 'express';
import cors from 'cors';
import testRoutes from './routes/test.routes'
import lockerRoutes from './routes/locker.routes';
import emailRoutes from './routes/email.routes'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/lockers', lockerRoutes);
app.use('/api/email', emailRoutes)

export default app;
