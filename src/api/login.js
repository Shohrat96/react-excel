import axios from 'axios';

// API call to login
const loginApi = async (credentials) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, credentials);
        return response.data; // return user data and token on success
    } catch (error) {
        throw error.response?.data || 'An error occurred';
    }
};

export default loginApi