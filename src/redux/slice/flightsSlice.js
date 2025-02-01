import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    flightList: [],
    filteredFlights: [],
    monitoringStarted: false,
    lastUpdate: '',
    showAlertsOnly: false,
    remarks: [],
    searchTerm: ""
};


const flightsSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        // Action to set the flight list
        setFlightList: (state, action) => {
            state.flightList = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setFilteredFlightList: (state, action) => {
            state.filteredFlights = action.payload;
        },
        // Action to start or stop flight monitoring
        toggleMonitoring: (state, action) => {
            state.monitoringStarted = action.payload;
        },
        // Action to set the last update timestamp
        setLastUpdate: (state, action) => {
            state.lastUpdate = action.payload;
        },
        // Action to toggle showing alerts only
        toggleShowAlertsOnly: (state, action) => {
            state.showAlertsOnly = action.payload;
        },
        setRemarks(state, action) {
            const { flightId, remark } = action.payload;
            state.remarks[flightId] = remark;
        },
        resetFlights: (state) => {
            state.flightList = [];
            state.filteredFlights = []
            state.monitoringStarted = false;
            state.lastUpdate = '';
            state.showAlertsOnly = false;
            state.remarks = [];
            state.searchTerm = ""
        }
    },
});

// Export actions to be dispatched
export const {
    setFlightList,
    toggleMonitoring,
    setLastUpdate,
    toggleShowAlertsOnly,
    setRemarks,
    resetFlights,
    setFilteredFlightList,
    setSearchTerm
} = flightsSlice.actions;


export const selectFlights = (state) => state.root.flights;

// Export the reducer to be used in the store
export default flightsSlice.reducer;
