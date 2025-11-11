import { baseApi } from "../../api/baseApi";
import { API_URLS } from "../../api/api_urls";

/* ----------------------------------------------------
   Interfaces
-----------------------------------------------------*/

export interface FeedbackListItem {
    userFeedbackId: number;
    feedbackType: string;
    status: string;
    createdOn: string;
}

export interface FeedbackListResponse {
    items: FeedbackListItem[];
    totalCount: number;
}

export interface FeedbackDetailResponse {
    userFeedbackId: number;
    feedbackType: string;
    feedbackText: string;
    feedbackImages: string[] | null;
    deviceInfo?: string | null;
    browserInfo?: string | null;
    appVersion?: string | null;
    rating?: number | null;
    status: string;
    createdOn: string;
}

export interface AddFeedbackRequest {
    feedbackType: string;
    feedbackText?: string;
    feedbackImages: string[] | null;
    deviceInfo?: string | null;
    browserInfo?: string | null;
    appVersion?: string | null;
    rating?: number | null;
}

export interface AddFeedbackResponse {
    status: boolean;
    message: string;
}

export interface ReviewItem {
    name: string;
    image: string;
    text: string;
    rating: number;
}

export interface ReviewListResponse {
    items: ReviewItem[];
    totalCount: number;
}

/* ----------------------------------------------------
   RTK Query
-----------------------------------------------------*/

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFeedbackList: builder.query<FeedbackListResponse, void>({
            query: () => ({
                url: API_URLS.feedback.list,
                method: "GET",
            }),
        }),

        getFeedbackDetail: builder.query<FeedbackDetailResponse, number>({
            query: (feedbackId) => ({
                url: API_URLS.feedback.get,
                method: "GET",
                params: { UserFeedbackId: feedbackId },
            }),
        }),

        addFeedback: builder.mutation<AddFeedbackResponse, any>({
            query: (body) => ({
                url: API_URLS.feedback.add,
                method: "POST",
                body
            }),
        }),

        getReviews: builder.query<ReviewListResponse, void>({
            query: () => ({
                url: API_URLS.feedback.reviews,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetFeedbackListQuery,
    useGetFeedbackDetailQuery,
    useAddFeedbackMutation,
    useGetReviewsQuery,
} = feedbackApi;
