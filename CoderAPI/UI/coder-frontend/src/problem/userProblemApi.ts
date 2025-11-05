// src/features/userProblemApi.ts
import { baseApi } from '../api/baseApi';
import { API_URLS } from '../api/api_urls';

export const userProblemApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        listSolutions: builder.query<
            {
                items: {
                    userSolutionId: number;
                    submissionDate: string;
                    result: string;
                    selectedLanguage: string;
                    totalExecutionTime: number;
                    totalMemoryUser: number;
                }[];
                totalCount: number;
            },
            number
        >({
            query: (problemId) => `${API_URLS.userProblem.listSolutions}?ProblemId=${problemId}`,
        }),

        listChats: builder.query<
            {
                items: {
                    userProblemSessionId: number;
                    date: string;
                    sessionStatus: string;
                    totalDiscussionTime: string;
                }[];
                totalCount: number;
            },
            number
        >({
            query: (problemId) => `${API_URLS.userProblem.listChats}?ProblemId=${problemId}`,
        }),

        getSolution: builder.query<
            {
                userSolutionId: number;
                userProblemSessionId: number;
                problemId: number;
                userSolutionCode: string;
                selectedLanguage: string;
                submissionDate: string;
                result: string;
                accuracy: number;
                testCases: {
                    userTestCaseResultId: number;
                    input: string;
                    expectedOutput: string;
                    actualOutput: string;
                    status: string;
                    executionTime: number;
                    memoryUsed: number;
                }[];
            },
            number
        >({
            query: (userSolutionId) => `${API_URLS.userProblem.solution}?UserSolutionId=${userSolutionId}`,
        }),

        getChat: builder.query<
            {
                messages: {
                    messageBy: string;
                    messageContent: string;
                }[];
            },
            number
        >({
            query: (userSessionId) => `${API_URLS.userProblem.chat}?userSessionId=${userSessionId}`,
        }),
    }),
});

export const {
    useListSolutionsQuery,
    useListChatsQuery,
    useGetSolutionQuery,
    useGetChatQuery,
} = userProblemApi;
