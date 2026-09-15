import axiosClient from './axiosClient.js';

export const getColdChainReadings = (shipmentId) =>
  axiosClient.get(`/cold-chain/${shipmentId}`).then((r) => r.data);

export const getColdChainAlerts = () =>
  axiosClient.get('/cold-chain/alerts').then((r) => r.data);

export const getAllColdChainReadings = () =>
  axiosClient.get('/cold-chain').then((r) => r.data);
