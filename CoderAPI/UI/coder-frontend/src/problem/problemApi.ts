import { baseApi } from '../api/baseApi';
import {
    PROBLEM_LIST_API,
    PROBLEM_DETAIL_API,
    PROBLEM_NEW_SESSION_API,
    PROBLEM_PROMPT_API,
    PROBLEM_USER_SOLUTION_API,
} from '../api/api_urls';

export const problemApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProblems: builder.mutation<
            {
                items: { problemId: number; problemName: string; url: string; tags: string[]; userStatus: string }[];
                totalCount: number;
                pageNumber: number;
                pageSize: number;
                totalPages: number;
            },
            { pageNumber: number; pageSize: number; difficulty?: string; tags?: number[]; status?: string }
        >({
            query: ({ pageNumber, pageSize, ...body }) => ({
                url: `${PROBLEM_LIST_API}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
                method: 'POST',
                body,
            }),
        }),

        getProblemById: builder.query<
            {
                problemId: number;
                problemName: string;
                problemDetail: string;
                difficultyLevel: string;
                constraints: string;
                tags: { value: string; topicId: number }[];
            },
            number
        >({
            query: (id) => PROBLEM_DETAIL_API(id),
        }),

        newSession: builder.mutation<
            { status: boolean; message: string; userProblemSessionId: number },
            number
        >({
            query: (problemId) => ({
                url: `${PROBLEM_NEW_SESSION_API}?ProblemId=${problemId}`,
                method: 'POST',
            }),
        }),

        sendPrompt: builder.mutation<
            { message: string; accuracy: number },
            { problemId: number; userProblemSessionId: number; userText: string }
        >({
            query: (body) => ({
                url: PROBLEM_PROMPT_API,
                method: 'POST',
                body,
            }),
        }),

        runOrSubmitSolution: builder.mutation<
            { status: boolean; message: string },
            {
                userSolutionId: number;
                userProblemSessionId: number;
                problemId: number;
                code: string;
                language: string;
                isSubmit: boolean;
            }
        >({
            query: (body) => ({
                url: PROBLEM_USER_SOLUTION_API,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetProblemsMutation,
    useGetProblemByIdQuery,
    useNewSessionMutation,
    useSendPromptMutation,
    useRunOrSubmitSolutionMutation,
} = problemApi;