// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { baseApi, handleResponseMiddleware } from './api/baseApi';
import authReducer from './auth/authSlice';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(handleResponseMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
