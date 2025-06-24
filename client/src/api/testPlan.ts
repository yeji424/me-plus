import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getAllPlans = async () => {
  const response = await axios.get(`${baseURL}/api/plan/explore`);
  return response.data;
};
