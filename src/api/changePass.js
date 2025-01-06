import axios from 'axios';

// API call to change pass
export const changePassword = async (token, oldPassword, newPassword) => {

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/auth/change-password`,
            { oldPassword, newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "An error occurred";
    }
};