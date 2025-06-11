import { Plan } from '../models/Plan.js';

let cachedPlans = [];
let lastUpdated = 0;
const TTL = 1000 * 60 * 60;

export const getPlansWithCache = async () => {
  const now = Date.now();
  if (now - lastUpdated > TTL || cachedPlans.length === 0) {
    cachedPlans = await Plan.find({});
    lastUpdated = now;
  }
  return cachedPlans;
};
