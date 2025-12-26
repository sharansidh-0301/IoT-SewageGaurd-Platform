import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SensorData } from '@/types/sensor';

const POLLING_INTERVAL = 5000; // 5 seconds

export function useSensorData() {
  const [latestData, setLatestData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLatestData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setLatestData(data as SensorData);
        setLastUpdated(new Date());
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching latest data:', err);
      setError('Failed to fetch latest sensor data');
    }
  }, []);

  const fetchHistory = useCallback(async (limit: number = 50) => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      
      setHistory((data || []) as SensorData[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to fetch sensor history');
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

  // Polling for updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestData();
      fetchHistory();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
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
