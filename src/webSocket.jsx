import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useWebSocket = (updateFlightsUI, monitoringStarted, setLastUpdatedWeather) => {
  const [isLoading, setIsLoading] = useState(false); // Initialize as loading
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize the WebSocket connection
    let ws;
    if (monitoringStarted) {
      setIsLoading(true)
      ws = new WebSocket('ws://localhost:8081');
      // When the WebSocket connection is established
      ws.onopen = () => {
        setIsLoading(false)
        console.log('WebSocket connected');
      };

      // When a message is received from the WebSocket server
      ws.onmessage = (event) => {
        try {
          const updatedFlights = JSON.parse(event.data);
          updateFlightsUI(updatedFlights);  // Update the state with new data
          setLastUpdatedWeather(dayjs().utc().format("YYYY-MM-DD HH:mm:ss")); // Update timestamp after successful data fetch
          setError(null); // Clear any previous errors
          setIsLoading(false)

        } catch (error) {
          setError("Error parsing WebSocket data");
          console.error(error);
        }
      };

      // When the WebSocket connection is closed
      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    }

    // Cleanup WebSocket connection when the component is unmounted
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [updateFlightsUI, monitoringStarted]); // The effect depends on `updateFlightsUI` and monitoringStarted
  return { isLoading }
};

export default useWebSocket;
