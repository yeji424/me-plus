import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { getInputExamples } from './controllers/chatController.js';
import {
  getAffordablePlanList,
  getBundlePlanList,
  getOTTPlanList,
  getPlanDetail,
  getPlanList,
  getPopularPlanList,
  getUnlimitedDataPlanList,
} from './controllers/planController.js';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'meplus' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(console.error);

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/chat/inputs', getInputExamples);
apiRouter.get('/plans/:planId', getPlanDetail);
apiRouter.get('/unlimited-plans', getUnlimitedDataPlanList);
apiRouter.get('/ott-plans', getOTTPlanList);
apiRouter.get('/affordable-plans', getAffordablePlanList);
apiRouter.get('/bundle-plans', getBundlePlanList);
apiRouter.get('/popular-plans', getPopularPlanList);
apiRouter.get('/plans', getPlanList);

export default app;
