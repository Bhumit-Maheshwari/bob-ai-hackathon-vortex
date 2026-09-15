import axiosClient from './axiosClient.js';

export const getFleet = () =>
  axiosClient.get('/fleet').then((r) => r.data);

export const getFleetUtilisation = () =>
  axiosClient.get('/fleet/utilisation').then((r) => r.data);
