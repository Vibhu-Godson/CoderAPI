import { baseApi } from "../api/baseApi";
import { API_URLS } from "../api/api_urls";

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userName: string;
    message: string;
    status: boolean;
    profileImageBase64?: string | null;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    loginPassword: string;
    country: string;
    //timezone: string;
    profileImageBase64?: string | null; // optional base64 string
    googleId?: string | null;
    facebookId?: string | null;
}

export interface RegisterResponse {
    status: boolean;
    message: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: API_URLS.auth.login,
                method: "POST",
                body,
            }),
        }),

        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (body) => ({
                url: API_URLS.auth.register,
                method: "POST",
                body,
            }),
        }),

        // Optional: kick off social auth on backend and receive a short-lived code or token
        socialLogin: builder.mutation<
            LoginResponse,
            { provider: "google" | "facebook"; credential: string }
        >({
            query: ({ provider, credential }) => ({
                url: `${API_URLS.auth.socialLogin}/${provider}`,
                method: "POST",
                body: { credential },
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useSocialLoginMutation } = authApi;
