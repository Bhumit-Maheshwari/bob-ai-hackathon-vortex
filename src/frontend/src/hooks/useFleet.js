import { useState, useEffect, useCallback } from 'react';
import { getFleet, getFleetUtilisation } from '../api/fleetApi.js';
import { MOCK_FLEET, MOCK_FLEET_UTIL } from '../api/mockData.js';

export function useFleet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFleet();
      setData(result);
    } catch {
      setData(MOCK_FLEET);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
}

export function useFleetUtilisation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFleetUtilisation();
      setData(result);
    } catch {
      setData(MOCK_FLEET_UTIL);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, refetch: fetch };
}
