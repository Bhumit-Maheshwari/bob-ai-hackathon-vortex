import { useState, useCallback } from 'react';
import { getRecommendations } from '../api/aiApi.js';
import { MOCK_RECOMMENDATIONS } from '../api/mockData.js';

export function useAiRecommendations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetch = useCallback(async (context = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecommendations(context);
      setData(result.recommendations || result);
      setFetched(true);
    } catch {
      setData(MOCK_RECOMMENDATIONS);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetched, fetch };
}
