/** 스키마를 유연하게 수정할 때 사용합니다 */

import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export const updateData = async () => {
  const database = client.db('meplus');
  const collection = database.collection('plansAddons');
  const addonsCollection = database.collection('addons');

  const result = await collection.find({}).toArray();

  for (const addon of result) {
    const addonDetails = await addonsCollection.findOne({ _id: addon.addon });

    const updatedAddon = {
      _id: addon.addon,
      name: addonDetails.name,
      description: addonDetails.description,
    };

    await collection.updateOne(
      { _id: addon._id },
      { $set: { addon: updatedAddon } },
    );
  }
};
