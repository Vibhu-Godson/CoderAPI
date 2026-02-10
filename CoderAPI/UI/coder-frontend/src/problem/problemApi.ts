// src/features/problemApi.ts
import { baseApi } from '../api/baseApi';
import { API_URLS } from '../api/api_urls';

export const problemApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProblems: builder.mutation<
            {
                items: {
                    problemId: number;
                    problemName: string;
                    url: string;
                    tags: string[];
                    userStatus: string;
                    isLocked: boolean; 
                    acceptance: number;
                    difficultyLevel: string;
                }[];
                totalCount: number;
                pageNumber: number;
                pageSize: number;
                totalPages: number;
            },
            { pageNumber: number; pageSize: number; difficulty?: string; tags?: number[]; status?: string }
        >({
            query: ({ pageNumber, pageSize, ...body }) => ({
                url: `${API_URLS.problem.list}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
                isLocked: boolean;
                tags: { value: string; topicId: number }[];
                testCases: {
                    testCaseId: number;
                    input: string;
                    expectedOutput: string;
                    explaination: string;
                }[];
            },
            number
        >({
            query: (id) => API_URLS.problem.detail(id),
        }),

        newSession: builder.mutation<
            { status: boolean; message: string; userProblemSessionId: number },
            number
        >({
            query: (problemId) => ({
                url: `${API_URLS.problem.newSession}?ProblemId=${problemId}`,
                method: 'POST',
            }),
        }),

        sendPrompt: builder.mutation<
            { message: string; accuracy: number },
            {
                problemId: number;
                userProblemSessionId: number;
                userText: string;
                userSolutionId?: number;
                isAfterSubmit?: boolean; 
                includeCode?: boolean;
                includeBoard?: boolean;
                codeContent?: string;
                boardData?: string;
            }
        >({
            query: (body) => ({
                url: API_URLS.problem.prompt,
                method: 'POST',
                body,
            }),
        }),

        completeSession: builder.mutation <
            { status: boolean; message: string },
            { userSessionId: number }
        >({
            query: ({ userSessionId }) => ({
                url: API_URLS.problem.completeSession(userSessionId),
                method: 'POST'
            })
        }),

        runOrSubmitSolution: builder.mutation<
            { 
                status: boolean; 
                message: string; 
                userSolutionId : number;
                testCaseResults?: Array<{
                    userTestCaseResultId: number;
                    testCaseId: number;
                    input: string;
                    expectedOutput: string;
                    actualOutput?: string;
                    status: string;
                    executionTime?: number;
                    memoryUsed?: number;
                    stderr?: string;
                    compileOutput?: string;
                }>;
            },
            {
                userSolutionId: number;
                userProblemSessionId: number;
                problemId: number;
                code: string;
                language: string;
                isSubmit: boolean;
                testcases?: {
                    items: Array<{
                        testCaseId: number;
                        input: string;
                        expectedOutput: string;
                        explaination: string;
                    }>;
                    totalCount: number;
                };
            }
        >({
            query: (body) => ({
                url: API_URLS.problem.runCode,
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
    useCompleteSessionMutation,
    useRunOrSubmitSolutionMutation,
} = problemApi;
