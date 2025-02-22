import axios from "axios";


export const addRemark = async (remarkData) => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/remarks/save`, remarkData);
        return response.data;
    } catch (error) {
        console.error('Error adding remark:', error);
        throw error.response ? error.response.data : error.message;
    }
};


export const getAllRemarks = async (page = 1, token) => {
    try {
        if (!token) {
            throw new Error("Authorization token is missing. Please log in.");
        }

        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/remarks/all?page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error getting remarks data:", error);
        throw error.response ? error.response.data : error.message;
    }
};
