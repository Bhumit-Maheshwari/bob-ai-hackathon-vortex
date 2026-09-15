import axiosClient from './axiosClient.js';

export const getDisruptions = (params) =>
  axiosClient.get('/disruptions', { params }).then((r) => r.data);
