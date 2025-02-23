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


export const getAllRemarks = async (page = 1, { sortColumn, sortOrder }) => {
    try {

        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/remarks/all?page=${page}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
        );

        return response.data;
    } catch (error) {
        console.error("Error getting remarks data:", error);
        throw error.response ? error.response.data : error.message;
    }
};

export const getAllRemarksFiltered = async (page = 1, filter = {}, { sortColumn, sortOrder }) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/remarks/all?page=${page}`, { ...filter, sortColumn, sortOrder });
        return response.data;
    } catch (error) {
        console.error('Error getting filtered remarks:', error);
        throw error.response ? error.response.data : error.message;
    }

};

export const getAllRemarkCategories = async () => {
    try {

        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/remarks/categories`
        );

        return response.data;
    } catch (error) {
        console.error("Error getting remarks categories:", error);
        throw error.response ? error.response.data : error.message;
    }
};