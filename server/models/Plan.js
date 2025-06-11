import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  id: String,
  name: String,
  data: String,
  call: String,
  price: String,
  url: String,
  tags: [String],
});

export const Plan = mongoose.model('Plan', PlanSchema);
