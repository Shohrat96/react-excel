import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    flightListToFilter: [],
    filteredFlightList: [],
    searchTerm: "",
    selectedDestinations: []
};

const filterFlightsSlice = createSlice({
    name: 'filteredFlights',
    initialState,
    reducers: {
        // Action to set the flight list
        setFlightListToFilter: (state, action) => {
            state.flightListToFilter = action.payload;
        },
        // Action to set the flight list
        setFilteredFlightList: (state, action) => {
            state.filteredFlightList = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSelectedDestinations: (state, action) => {
            state.selectedDestinations = action.payload;
        },
    },
});

// Export actions to be dispatched
export const {
    setFlightListToFilter,
    setFilteredFlightList,
    setSearchTerm,
    setSelectedDestinations
} = filterFlightsSlice.actions;


export const selectFlightsFilter = (state) => state.root.filteredFlights;

// Export the reducer to be used in the store
export default filterFlightsSlice.reducer;
