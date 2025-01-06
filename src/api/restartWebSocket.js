import axios from 'axios';

// API call to restartWebsocket
const restartWebsocket = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/restart-websocket`);
        return response.data; // return user data and token on success
    } catch (error) {
        throw error.response?.data || 'An error occurred';
    }
};

export default restartWebsocket