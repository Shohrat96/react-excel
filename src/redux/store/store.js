import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "../slice/authSlice";
import { thunk } from "redux-thunk";
import flightsReducer from '../slice/flightsSlice';
import filterFlightsReducer from '../slice/workload';
import remarksReducer from '../slice/remarkSlice';

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    flights: flightsReducer,
    filteredFlights: filterFlightsReducer,
    remarks: remarksReducer
    // flight: flightReducer,
    // notes: notesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: {
        root: persistedReducer, // Add your persisted reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable checks for redux-persist
        }).concat(thunk),
});

export const persistor = persistStore(store);

export default store;
