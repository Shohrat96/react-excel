import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectFlights } from './redux/slice/flightsSlice';

const useWebSocket = (updateFlightsUI, setLastUpdatedWeather) => {
  const { monitoringStarted } = useSelector(selectFlights);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);           // WebSocket instance
  const retryInterval = useRef(null);   // Retry interval ID
  const monitoringRef = useRef(monitoringStarted); // Ref to track latest monitoring state

  // Keep monitoringRef updated with the latest state
  useEffect(() => {
    monitoringRef.current = monitoringStarted;
  }, [monitoringStarted]);

  const connectWebSocket = () => {
    if (!monitoringRef.current) return;  // Use ref instead of state

    setIsLoading(true);
    wsRef.current = new WebSocket('ws://localhost:8081');

    wsRef.current.onopen = () => {
      setIsLoading(false);
      console.log('WebSocket connected');
      setError(null);
      clearInterval(retryInterval.current);  // Clear retry logic on successful connection
    };

    wsRef.current.onmessage = (event) => {
      console.log("monitoring in line 28 websocket: ", monitoringRef.current);  // Use ref

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
      console.log("monitoringStarted (onclose): ", monitoringRef.current);  // Use ref

      console.log('WebSocket disconnected');
      setError('WebSocket disconnected');
      retryConnection();
    };
  };

  const retryConnection = () => {
    clearInterval(retryInterval.current);  // Ensure no multiple intervals

    retryInterval.current = setInterval(() => {
      if (monitoringRef.current) {  // Check the latest value
        console.log('Attempting to reconnect WebSocket...');
        connectWebSocket();
      } else {
        console.log('Monitoring stopped. No reconnection.');
        clearInterval(retryInterval.current);
      }
    }, 5000);  // Retry every 5 seconds
  };

  useEffect(() => {
    if (monitoringStarted) {
      connectWebSocket();
    }
    console.log("monitoring started (effect): ", monitoringStarted);

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(retryInterval.current);
    };
  }, [monitoringStarted]);

  return { isLoading, error };
};

export default useWebSocket;
