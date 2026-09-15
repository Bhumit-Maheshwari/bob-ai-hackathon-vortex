import { useState, useEffect, useCallback } from 'react';
import { getDisruptions } from '../api/disruptionsApi.js';
import { MOCK_DISRUPTIONS } from '../api/mockData.js';

export function useDisruptions(params) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDisruptions(params);
      setData(result);
    } catch {
      setData(MOCK_DISRUPTIONS);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);  // eslint-disable-line

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
