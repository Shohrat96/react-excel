import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';

const useWebSocket = (updateFlightsUI, monitoringStarted, setLastUpdatedWeather) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null); // Ref to persist WebSocket instance
  const retryInterval = useRef(null); // Ref to store retry interval ID

  const connectWebSocket = () => {
    if (!monitoringStarted) return;

    setIsLoading(true);
    wsRef.current = new WebSocket('ws://localhost:8081');

    wsRef.current.onopen = () => {
      setIsLoading(false);
      console.log('WebSocket connected');
      setError(null);
      clearInterval(retryInterval.current); // Clear retry logic on successful connection
    };

    wsRef.current.onmessage = (event) => {
      try {
        const updatedFlights = JSON.parse(event.data);
        updateFlightsUI(updatedFlights);

        setLastUpdatedWeather(dayjs().utc().format('YYYY-MM-DD HH:mm:ss'));
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error('Error parsing WebSocket data', err);
        setError('Error parsing WebSocket data');
      }
    };

    wsRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket connection error');
      setIsLoading(false);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setError('WebSocket disconnected');
      retryConnection();
    };
  };

  const retryConnection = () => {
    clearInterval(retryInterval.current); // Ensure no multiple intervals
    retryInterval.current = setInterval(() => {
      console.log('Attempting to reconnect WebSocket...');
      connectWebSocket();
    }, 5000); // Retry every 5 seconds
  };

  useEffect(() => {
    if (monitoringStarted) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(retryInterval.current);
    };
  }, [monitoringStarted]); // Re-run on `monitoringStarted` changes

  return { isLoading, error };
};

export default useWebSocket;
