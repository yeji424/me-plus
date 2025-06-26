import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import {
  getAffordablePlanList,
  getBundlePlanList,
  getOTTPlanList,
  getPlanDetail,
  getPlanList,
  getPopularPlanList,
  getUnlimitedDataPlanList,
  getPlanExploreList,
} from './controllers/planController.js';
import { getUrlMetadata } from './controllers/metadataController.js';

dotenv.config();

const app = express();
// CORS 허용 도메인을 환경변수에서 가져오기
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174']; // 기본값

app.use(
  cors({
    origin: allowedOrigins,
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

apiRouter.get('/metadata', getUrlMetadata);
apiRouter.get('/plans/:planId', getPlanDetail);
apiRouter.get('/unlimited-plans', getUnlimitedDataPlanList);
apiRouter.get('/ott-plans', getOTTPlanList);
apiRouter.get('/affordable-plans', getAffordablePlanList);
apiRouter.get('/bundle-plans', getBundlePlanList);
apiRouter.get('/popular-plans', getPopularPlanList);
apiRouter.get('/plans', getPlanList);
apiRouter.get('/plan/explore', getPlanExploreList);

export default app;
