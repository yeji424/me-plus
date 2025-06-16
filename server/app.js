import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import {
  getOTTPlanList,
  getPlanDetail,
  getUnlimitedDataPlanList,
} from './controllers/planController.js';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5174'],
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'meplus' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(console.error);

// changeSchema();

// Routers
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/plans/:planId', getPlanDetail);
apiRouter.get('/unlimited-plans', getUnlimitedDataPlanList);
apiRouter.get('/ott-plans', getOTTPlanList);

export default app;
