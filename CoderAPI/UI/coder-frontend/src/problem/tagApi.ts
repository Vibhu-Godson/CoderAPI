import { baseApi } from "../api/baseApi";
import { API_URLS } from "../api/api_urls";

export const tagApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTags: builder.query<
            {
                items: { tagId: number; tagName: string; totalQuestions:number }[];
                totalCount: number;
            },
            void
        >({
            query: () => API_URLS.problemTag.allTags, // "/api/ProblemTag/AllTags"
        }),
    }),
});

export const { useGetAllTagsQuery } = tagApi;
