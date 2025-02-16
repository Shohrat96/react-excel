import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    flightListToFilter: [],
    filteredFlightList: [],
    searchTerm: "",
    selectedDestinations: [],
    selectedShift: "all"
};

const filterFlightsSlice = createSlice({
    name: 'filteredFlights',
    initialState,
    reducers: {
        // Action to set the flight list
        setFlightListToFilter: (state, action) => {
            state.flightListToFilter = action.payload;
        },
        resetState: () => {
            state = initialState
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
        setSelectedShift: (state, action) => {
            state.selectedShift = action.payload;
            state.selectedDestinations = [];
            state.searchTerm = "";

            let departures = [];
            // Determine the earliest date in the list (assuming "YYYY-MM-DD" format)
            const minDate = state.flightListToFilter.reduce((min, flight) => {
                if (!min || flight.date < min) return flight.date;
                return min;
            }, null);
            if (action.payload === "day") {
                departures = state.flightListToFilter.filter(flight => {
                    if (flight.origin !== "GYD") return false;
                    const [hours, minutes] = flight.ETD.split(":").map(Number);
                    const etdTime = hours + minutes / 60;
                    return etdTime >= 8 && etdTime < 20 && flight.date === minDate;
                });
            } else if (action.payload === "night") {


                departures = state.flightListToFilter.filter(flight => {
                    if (flight.origin !== "GYD") return false;
                    const [hours, minutes] = flight.ETD.split(":").map(Number);
                    const etdTime = hours + minutes / 60;

                    if (flight.date === minDate) {
                        // For the first day, only include flights with ETD >= 20:00
                        return etdTime >= 20;
                    } else {
                        // For subsequent days, include only flights with ETD < 8:00
                        return etdTime < 8;
                    }
                });
            } else {
                departures = [...state.flightListToFilter];
            }
            const groupedFlights = departures.map(departure => {
                // Preserve original flight number string to get its length for padding.
                const depFlightStr = departure.flight_number;
                const departureNum = Number(depFlightStr);
                if (isNaN(departureNum)) return [departure]; // if invalid, just return the departure

                // Compute the return flight number preserving leading zeros.
                const returnFlightNumber = String(departureNum + 1).padStart(depFlightStr.length, '0');

                const returnFlight = state.flightListToFilter.find(f =>
                    f.flight_number === returnFlightNumber && f.date === departure.date
                );

                return returnFlight ? [departure, returnFlight] : [departure];
            });

            const union = groupedFlights.flat();

            state.filteredFlightList = union;
        }
    },
});

// Export actions to be dispatched
export const {
    setFlightListToFilter,
    setFilteredFlightList,
    setSearchTerm,
    setSelectedDestinations,
    setSelectedShift
} = filterFlightsSlice.actions;


export const selectFlightsFilter = (state) => state.root.filteredFlights;

// Export the reducer to be used in the store
export default filterFlightsSlice.reducer;
