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

        checkUserName: builder.mutation<{ status: boolean, message: string }, { value: string }>({
            query: (body) => ({
                url: API_URLS.auth.checkUserName,
                method: "POST",
                body
            }),
        }),

        generateOtp: builder.mutation<{ status: boolean, message: string, otp?: string }, { value: string }>({
            query: (body) => ({
                url: API_URLS.auth.generateOtp,
                method: "POST",
                body
            }),
        }),

        validateOtp: builder.mutation<{ status: boolean, message: string }, { otp: string, phone: string }>({
            query: (body) => ({
                url: API_URLS.auth.validateOtp,
                method: "POST",
                body
            }),
        }),
        userOnboardDone: builder.query({
            query: () => ({
                url: API_URLS.postlogin.isOnboarded,
                method: "GET",
            }),
        }),
        userOnboardDoneLazy: builder.query<{ status: boolean; message: string }, void>({
            query: () => ({
                url: API_URLS.postlogin.isOnboarded,
                method: "GET",
            }),
        }),

    }),
});

export const { useLoginMutation,
    useRegisterMutation,
    useCheckUserNameMutation,
    useGenerateOtpMutation,
    useValidateOtpMutation,
    useUserOnboardDoneQuery,
    useLazyUserOnboardDoneQuery,
} = authApi;
