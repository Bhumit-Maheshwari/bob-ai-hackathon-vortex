import { useState, useEffect, useCallback } from 'react';
import { getShipments, getShipmentById } from '../api/shipmentsApi.js';
import { MOCK_SHIPMENTS } from '../api/mockData.js';

export function useShipments(params) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getShipments(params);
      setData(result);
    } catch {
      // Fall back to mock data
      setData(MOCK_SHIPMENTS);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);  // eslint-disable-line

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useShipmentDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getShipmentById(id);
      setData(result);
    } catch {
      const found = MOCK_SHIPMENTS.find((s) => s.id === id);
      if (found) setData(found);
      else setError('Shipment not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
