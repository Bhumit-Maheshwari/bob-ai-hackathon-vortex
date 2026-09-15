import axiosClient from './axiosClient.js';

export const getRecommendations = (context) =>
  axiosClient.post('/ai/recommend', context).then((r) => r.data);
