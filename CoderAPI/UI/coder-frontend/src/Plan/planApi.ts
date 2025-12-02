// src/features/Plans/planApi.ts
import { baseApi } from "../api/baseApi";
import { API_URLS } from "../api/api_urls";

export interface Feature {
    feature: string;
    included: boolean;
}

export interface Plan {
    planId: number;
    name: string;
    price: number;
    description: string;
    features: Feature[];
    isPopular: boolean;
    isCurrentPlan: boolean;
}

export interface GetPlansResponse {
    items: Plan[];
    totalCount: number;
}

export const planApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlans: builder.query<GetPlansResponse, void>({
            query: () => ({
                url: API_URLS.plans.list,
                method: "GET",
            }),
        }),

        // ✅ POST for creating Razorpay order
        createOrder: builder.mutation<
            {
                price: number;
                razorPayOrderId: string;
                key: string;
                userPlanId: number;
                currency: string;
            },
            number
        >({
            query: (planId) => ({
                url: API_URLS.payment.createPayment(planId),
                method: "POST",
            }),
        }),

        // ✅ POST for verifying Razorpay payment
        verifyPayment: builder.mutation<
            { status: boolean; message: string },
            {
                paymentId: string;
                rayzorpayOrderId: string;
                signature: string;
                userPlanId: number;
            }
        >({
            query: (body) => ({
                url: API_URLS.payment.verifyPayment,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetPlansQuery,
    useCreateOrderMutation,
    useVerifyPaymentMutation,
} = planApi;
