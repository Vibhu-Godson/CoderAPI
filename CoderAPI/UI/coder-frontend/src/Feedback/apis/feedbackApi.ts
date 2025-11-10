import { baseApi } from "../../api/baseApi";
import { API_URLS } from "../../api/api_urls";

/* ---------------------------------------------
   Interfaces: Response & Request models
----------------------------------------------*/

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
    feedbackImages?: string | null;
    deviceInfo?: string | null;
    browserInfo?: string | null;
    appVersion?: string | null;
    status: string;
    createdOn: string;
}

export interface AddFeedbackRequest {
    feedbackType: string;
    feedbackText?: string;
    feedbackImages?: string | null;
    deviceInfo?: string | null;
    browserInfo?: string | null;
    appVersion?: string | null;
}

export interface AddFeedbackResponse {
    status: boolean;
    message: string;
}

/* ---------------------------------------------
   RTK Query API
----------------------------------------------*/

export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/UserFeedback/List
        getFeedbackList: builder.query<FeedbackListResponse, void>({
            query: () => ({
                url: API_URLS.feedback.list,
                method: "GET",
            }),
        }),

        // GET /api/UserFeedback?UserFeedbackId=x
        getFeedbackDetail: builder.query<
            FeedbackDetailResponse,
            number
        >({
            query: (feedbackId) => ({
                url: API_URLS.feedback.get,
                method: "GET",
                params: { UserFeedbackId: feedbackId },
            }),
        }),

        // POST /api/UserFeedback/Add
        addFeedback: builder.mutation<
            AddFeedbackResponse,
            AddFeedbackRequest
        >({
            query: (body) => ({
                url: API_URLS.feedback.add,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetFeedbackListQuery,
    useGetFeedbackDetailQuery,
    useAddFeedbackMutation,
} = feedbackApi;
