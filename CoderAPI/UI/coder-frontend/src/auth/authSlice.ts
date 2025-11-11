import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    userName: string | null;
    profileImageBase64?: string | null;
    isAuthenticated: boolean;
}

const storedToken = localStorage.getItem("authToken");
const storedUserName = localStorage.getItem("authUserName");
const storedAvatar = localStorage.getItem("authAvatarBase64");

const initialState: AuthState = {
    token: storedToken,
    userName: storedUserName,
    profileImageBase64: storedAvatar,
    isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; userName: string; profileImageBase64?: string | null }>
        ) => {
            state.token = action.payload.token;
            state.userName = action.payload.userName;
            state.profileImageBase64 = action.payload.profileImageBase64 ?? null;
            state.isAuthenticated = true;
            localStorage.setItem("authToken", action.payload.token);
            localStorage.setItem("authUserName", action.payload.userName);
            if (action.payload.profileImageBase64) {
                localStorage.setItem("authAvatarBase64", action.payload.profileImageBase64);
            }
        },
        logout: (state) => {
            state.token = null;
            state.userName = null;
            state.profileImageBase64 = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUserName");
            localStorage.removeItem("authAvatarBase64");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
