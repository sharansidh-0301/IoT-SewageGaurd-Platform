import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SensorData } from '@/types/sensor';

const BASE_POLL_INTERVAL = 5000;
const MAX_POLL_INTERVAL = 30000;
const FETCH_TIMEOUT = 10000;

function fetchWithTimeout<T>(promiseLike: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    ),
  ]);
}

export function useSensorData() {
  const [latestData, setLatestData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollIntervalRef = useRef(BASE_POLL_INTERVAL);
  const consecutiveErrorsRef = useRef(0);

  const fetchLatestData = useCallback(async () => {
    try {
      const result = await fetchWithTimeout(
        supabase
          .from('sensor_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        FETCH_TIMEOUT
      );

      if (result.error) throw result.error;

      if (result.data) {
        setLatestData(result.data as SensorData);
        setLastUpdated(new Date());
      }
      setError(null);
      consecutiveErrorsRef.current = 0;
      pollIntervalRef.current = BASE_POLL_INTERVAL;
      return true;
    } catch (err) {
      console.error('Error fetching latest data:', err);
      consecutiveErrorsRef.current++;
      // Exponential backoff: 5s, 10s, 20s, 30s max
      pollIntervalRef.current = Math.min(
        BASE_POLL_INTERVAL * Math.pow(2, consecutiveErrorsRef.current - 1),
        MAX_POLL_INTERVAL
      );
      setError('Failed to fetch latest sensor data');
      return false;
    }
  }, []);

  const fetchHistory = useCallback(async (limit: number = 50) => {
    try {
      const result = await fetchWithTimeout(
        supabase
          .from('sensor_data')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(limit),
        FETCH_TIMEOUT
      );

      if (result.error) throw result.error;

      setHistory((result.data || []) as SensorData[]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch sensor history');
      return false;
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchLatestData(), fetchHistory()]);
    setIsLoading(false);
  }, [fetchLatestData, fetchHistory]);

  // Initial fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Adaptive polling with backoff
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      await Promise.all([fetchLatestData(), fetchHistory()]);
      timeoutId = setTimeout(poll, pollIntervalRef.current);
    };

    timeoutId = setTimeout(poll, pollIntervalRef.current);

    return () => clearTimeout(timeoutId);
  }, [fetchLatestData, fetchHistory]);

  // Real-time subscription for instant updates
  useEffect(() => {
    const channel = supabase
      .channel('sensor-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data',
        },
        (payload) => {
          console.log('New sensor data received:', payload);
          setLatestData(payload.new as SensorData);
          setLastUpdated(new Date());
          consecutiveErrorsRef.current = 0;
          pollIntervalRef.current = BASE_POLL_INTERVAL;
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHistory]);

  return {
    latestData,
    history,
    isLoading,
    error,
    lastUpdated,
    refreshData,
  };
}
