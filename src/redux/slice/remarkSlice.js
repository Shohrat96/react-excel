import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    remarks: [],
    loading: false,
    error: null,
};

const flightsSlice = createSlice({
    name: 'remarks',
    initialState,
    reducers: {
        // Action to set the flight list
        setRemarksRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        setRemarksSuccess: (state, action) => {
            state.remarks = action.payload;
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
    setRemarksRequest,
    setRemarksSuccess,
    setRemarksFailure,
} = flightsSlice.actions;


// Async action to handle setRemarks
export const setRemarksAsync = (credentials) => async (dispatch) => {
    dispatch(setRemarksRequest());
    try {
        const data = await loginApi(credentials); // Call the API function

        dispatch(loginSuccess({ email: data.email, token: data.token }));
    } catch (error) {
        console.log('Error in login:', error);

        dispatch(loginFailure(error?.message));
    }
};

export const selectFlights = (state) => state.root.flights;

// Export the reducer to be used in the store
export default flightsSlice.reducer;
