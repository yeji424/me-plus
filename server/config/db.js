/** 스키마를 유연하게 수정할 때 사용합니다 */

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export const changeSchema = async () => {
  const database = client.db('meplus');
  const collection = database.collection('plans');
  const refCollection = database.collection('bundleBenefits');

  const result = await collection.find({}).toArray();

  for (const item of result) {
    const target = await refCollection.findOne({ _id: item.bundleBenefit });

    const updated = target
      ? {
          _id: item.bundleBenefit,
          name: target.name,
          description: target.description,
        }
      : null;

    await collection.updateOne(
      { _id: item._id },
      { $set: { bundleBenefit: updated } },
    );
  }
};
