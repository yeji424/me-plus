/**
 * Generated for Basic Services
 * Collection: basicServices
 * Language: JavaScript
 * Template: Mongoose
 */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

export const basicServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  { collection: 'basicServices', timestamps: true },
);

export const BasicService = model('BasicService', basicServiceSchema);
