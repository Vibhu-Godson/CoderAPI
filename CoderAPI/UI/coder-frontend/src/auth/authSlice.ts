// src/features/Auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    userName: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem("authToken"),
    userName: null,
    isAuthenticated: !!localStorage.getItem("authToken"),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; userName: string }>) => {
            state.token = action.payload.token;
            state.userName = action.payload.userName;
            state.isAuthenticated = true;
            localStorage.setItem("authToken", action.payload.token); 
        },
        logout: (state) => {
            state.token = null;
            state.userName = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
