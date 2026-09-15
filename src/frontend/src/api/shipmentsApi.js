import axiosClient from './axiosClient.js';

export const getShipments = (params) =>
  axiosClient.get('/shipments', { params }).then((r) => r.data);

export const getShipmentById = (id) =>
  axiosClient.get(`/shipments/${id}`).then((r) => r.data);
