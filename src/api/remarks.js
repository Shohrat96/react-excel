export const addRemark = async (remarkData) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/remarks`, remarkData);
        return response.data;
    } catch (error) {
        console.error('Error adding remark:', error);
        throw error.response ? error.response.data : error.message;
    }
};