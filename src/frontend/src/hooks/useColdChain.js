import { useState, useEffect, useCallback } from 'react';
import { getColdChainAlerts, getAllColdChainReadings, getColdChainReadings } from '../api/coldChainApi.js';
import { MOCK_COLD_CHAIN } from '../api/mockData.js';

export function useColdChainByShipment(shipmentId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!shipmentId) { setLoading(false); return; }
    setLoading(true);
    try {
      const result = await getColdChainReadings(shipmentId);
      setData(result);
    } catch {
      setData(MOCK_COLD_CHAIN.filter((r) => r.shipmentId === shipmentId));
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useColdChain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllColdChainReadings();
      setData(result);
    } catch {
      setData(MOCK_COLD_CHAIN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}

export function useColdChainAlerts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getColdChainAlerts();
      setData(result);
    } catch {
      setData(MOCK_COLD_CHAIN.filter((r) => r.status === 'breach'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}
