import { createSlice } from '@reduxjs/toolkit';
import { addRemark, getAllRemarks } from '../../api/remarks';
import { toast } from 'react-toastify';

const initialState = {
    remarks: [],
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    loading: false,
    error: null,
};

const remarksSlice = createSlice({
    name: 'remarks',
    initialState,
    reducers: {
        // Action to set the flight list
        setRemarksRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        addNewRemark: (state, action) => {
            state.remarks = [...state.remarks, action.payload];
            state.error = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setRemarksSuccess: (state, action) => {
            state.remarks = [...action.payload?.remarks];
            state.currentPage = action.payload?.currentPage;
            state.totalItems = action.payload?.totalItems;
            state.totalPages = action.payload?.totalPages;
            state.loading = false;
        },
        setRemarksFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

// Export actions to be dispatched
export const {
    setRemarks,
    addNewRemark,
    setRemarksRequest,
    setRemarksSuccess,
    setRemarksFailure,
    setCurrentPage
} = remarksSlice.actions;


// Async action to handle setRemarks
export const addRemarksAsync = (remark) => async (dispatch) => {
    dispatch(setRemarksRequest());
    try {
        const data = await addRemark(remark); // Call the API function

        dispatch(addNewRemark(remark));
        toast.success('Remark added successfully!');
    } catch (error) {
        console.log('Error in set remarks:', error);
        dispatch(setRemarksFailure(error?.message));
        toast.error('Could not add a new remark')
    }
};

export const getRemarksAsync = (page) => async (dispatch, getState) => {

    dispatch(setRemarksRequest());
    try {
        const data = await getAllRemarks(page);
        // console.log("data in remark: ", data);

        dispatch(setRemarksSuccess(data));
    } catch (error) {
        console.log("Error in set remarks:", error);
        dispatch(setRemarksFailure(error?.message));
        toast.error("Could not get remarks data");
    }
};


export const selectRemarks = (state) => state.root.remarks;

// Export the reducer to be used in the store
export default remarksSlice.reducer;
