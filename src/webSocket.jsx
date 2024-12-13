import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useWebSocket = (updateFlightsUI, monitoringStarted) => {
  const [isLoading, setIsLoading] = useState(false); // Initialize as loading
  const [lastUpdatedWeatherFromSocket, setLastUpdatedWeatherFromSocket] = useState(null); // State to store the timestamp
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
          console.log('Received updated flights:', updatedFlights);
          updateFlightsUI(updatedFlights);  // Update the state with new data
          setLastUpdatedWeatherFromSocket(dayjs().format('YYYY-MM-DD HH:mm:ss')); // Update timestamp after successful data fetch
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
  return { isLoading, lastUpdatedWeatherFromSocket }
};

export default useWebSocket;
