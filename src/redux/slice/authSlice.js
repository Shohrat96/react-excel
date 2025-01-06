import { createSlice } from '@reduxjs/toolkit';
import loginApi from '../../api/login'; // Import the API function

const initialState = {
    user: null,
    token: null,
    error: null,
    loading: false,
    email: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.loading = false;
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.email = null;
            state.error = null;
            state.loading = false;
        },
    },
});

// Async action to handle login
export const login = (credentials) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const data = await loginApi(credentials); // Call the API function

        dispatch(loginSuccess({ email: data.email, token: data.token }));
    } catch (error) {
        dispatch(loginFailure(error));
    }
};

export const logoutAsync = () => (dispatch) => {
    localStorage.clear();

    dispatch(logout());
};

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;