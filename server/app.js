import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'meplus' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(console.error);

export default app;
