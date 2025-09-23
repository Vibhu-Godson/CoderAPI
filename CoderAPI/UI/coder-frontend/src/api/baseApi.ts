// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
