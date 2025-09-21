// src/features/Auth/authApi.ts
import { baseApi } from '../api/baseApi';
import { LOGIN_API, REGISTER_API } from '../api/api_urls';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            { token: string; userName: string; message: string; status: boolean },
            { userName: string; password: string }
        >({
            query: (body) => ({
                url: LOGIN_API,
                method: 'POST',
                body,
            }),
        }),
        register: builder.mutation<
            { status: boolean; message: string },
            {
                userId: number;
                firstName: string;
                lastName: string;
                userName: string;
                email: string;
                phoneNumber: string;
                loginPassword: string;
                profileImage: string;
                country: string;
            }
        >({
            query: (body) => ({
                url: REGISTER_API,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
