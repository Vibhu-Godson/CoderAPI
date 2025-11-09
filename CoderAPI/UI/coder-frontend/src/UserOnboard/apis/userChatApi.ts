import { baseApi } from "../../api/baseApi";
import { API_URLS } from "../../api/api_urls";

export interface UserChatRequest {
    value: string;
}

export interface UserChatResponse {
    currentRole: string | null;
    experience: {
        company: string | null;
        role: string | null;
        startDate: string | null;
        enddate: string | null;
        description: string | null;
    } | null;
    education: {
        institute: string | null;
        degree: string | null;
        fieldOfStudy: string | null;
        completionYear: string | null;
    } | null;
    project: {
        title: string | null;
        description: string | null;
        techStacks: string | null;
        projectLink: string | null;
    } | null;
    motivation: string | null;
}

export const userChatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendChatMessage: builder.mutation<UserChatResponse, UserChatRequest>({
            query: (body) => ({
                url: "/api/UserDetails/Chat",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useSendChatMessageMutation } = userChatApi;
