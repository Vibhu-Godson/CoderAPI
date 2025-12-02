import { baseApi } from '../api/baseApi';
import { API_URLS } from '../api/api_urls';

export const problemDetailApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // === GET LANGUAGES BY PROBLEM ID ===
        getLanguagesByProblemId: builder.query<
            {
                items: {
                    value: string;
                    problemDetailId: number;
                }[];
                totalCount: number;
            },
            number
        >({
            query: (problemId) => ({
                url: `${API_URLS.problemDetail.getLanguages}?ProblemId=${problemId}`,
                method: 'GET',
            }),
        }),

        // === GET STARTER CODE BY PROBLEM DETAIL ID ===
        getStarterCodeByDetailId: builder.query<
            { value: string },
            number
        >({
            query: (problemDetailId) => ({
                url: `${API_URLS.problemDetail.getStarterCode}?ProblemDetailId=${problemDetailId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetLanguagesByProblemIdQuery,
    useGetStarterCodeByDetailIdQuery,
} = problemDetailApi;
