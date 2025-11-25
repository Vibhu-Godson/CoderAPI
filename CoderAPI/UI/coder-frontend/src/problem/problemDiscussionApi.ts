import { baseApi } from "../api/baseApi";
import { API_URLS } from "../api/api_urls";

export const problemDiscussionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDiscussionList: builder.query({
            query: ({ problemId, pageNumber, pageSize }) => ({
                url: `${API_URLS.problemDiscussion.getAll}?ProblemId=${problemId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
                method: "GET",
            }),
            providesTags: ["Discussion"],
        }),

        getDiscussionById: builder.query({
            query: (discussionId) => ({
                url: `${API_URLS.problemDiscussion.open}?ProblemDiscussionId=${discussionId}`,
                method: "GET",
            }),
            providesTags: ["Discussion"],
        }),

        addDiscussion: builder.mutation({
            query: (data) => ({
                url: API_URLS.problemDiscussion.add,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Discussion"],
        }),

        updateDiscussion: builder.mutation({
            query: ({ discussionId, data }) => ({
                url: `${API_URLS.problemDiscussion.update}?ProblemDiscussionId=${discussionId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Discussion"],
        }),
    }),
});

export const {
    useGetDiscussionListQuery,
    useAddDiscussionMutation,
    useGetDiscussionByIdQuery,
    useUpdateDiscussionMutation
} = problemDiscussionApi;
