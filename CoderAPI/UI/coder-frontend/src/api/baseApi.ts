import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '../auth/authSlice';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:7198',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth?.token || localStorage.getItem("authToken");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth', 'Problem'],
    endpoints: () => ({}),
});

// ✅ Add a middleware to handle 401 responses globally
export const handleResponseMiddleware = (store: any) => (next: any) => (action: any) => {
    const response = action?.payload;
    
    // Check if it's a fulfilled query action with 401 status
    if (action.type.includes('fulfilled') && response?.status === 401) {
        // Dispatch logout to clear auth state
        store.dispatch(logout());
        // Redirect to login
        window.location.href = '/login';
    }
    
    return next(action);
};
