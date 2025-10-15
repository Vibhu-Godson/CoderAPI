// src/features/course/courseApi.ts
import { baseApi } from '../api/baseApi';
import { API_URLS } from '../api/api_urls';
import type { Course, Bundle, Category, PaymentResponse, MyCourseResponse, MyCourseDetail, UpdateStatusResponse, TopicDetail } from './types/course';

interface PagedResponse<T> {
    items: T[];
    totalCount: number;
}

export const courseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPopularBundles: builder.query<Bundle[], void>({
            query: () => ({ url: API_URLS.course.getPopularBundles }),
            transformResponse: (response: PagedResponse<Bundle>) => response.items,
        }),

        getPopularCourses: builder.query<Course[], void>({
            query: () => ({ url: API_URLS.course.getPopularCourses }),
            transformResponse: (response: PagedResponse<Course>) => response.items,
        }),

        getCategories: builder.query<Category[], void>({
            query: () => ({ url: API_URLS.course.getCategories }),
            transformResponse: (response: PagedResponse<Category>) => response.items,
        }),

        getCoursesByCategory: builder.query<Course[], number>({
            query: (id) => ({ url: API_URLS.course.getCoursesByCategory(id) }),
            transformResponse: (response: PagedResponse<Course>) => response.items,
        }),

        getCourseById: builder.query<Course, number>({
            query: (id) => ({ url: API_URLS.course.getCourseById(id) }),
        }),

        getBundleById: builder.query<Bundle, number>({
            query: (id) => ({ url: API_URLS.course.getBundleById(id) }),
        }),

        searchCourses: builder.query<Course[], string>({
            query: (keyword) => ({
                url: API_URLS.course.searchCourses,
                params: { keyword },
            }),
            transformResponse: (response: PagedResponse<Course>) => response.items,
        }),
        createCourseOrder: builder.mutation<PaymentResponse, number>({
            query: (courseId) => ({
                url: API_URLS.payment.createCoursePayment(courseId),
                method: 'POST',
            }),
        }),
        verifyCoursePayment: builder.mutation<{ status: boolean; message: string }, any>({
            query: (body) => ({
                url: API_URLS.payment.verifyCoursePayment,
                method: 'POST',
                body,
            }),
        }),

        createBundleOrder: builder.mutation<PaymentResponse, number>({
            query: (bundleId) => ({
                url: API_URLS.payment.createBundlePayment(bundleId),
                method: 'POST',
            }),
        }),
        verifyBundlePayment: builder.mutation<{ status: boolean; message: string }, any>({
            query: (body) => ({
                url: API_URLS.payment.verifyBundlePayment,
                method: 'POST',
                body,
            }),
        }),
        getMyCourses: builder.query<MyCourseResponse, void>({
            query: () => API_URLS.userCourse.getMyCourses,
        }),
        getMyCourseDetail: builder.query<MyCourseDetail, number>({
            query: (userCourseId) => ({
                url: API_URLS.userCourse.getDetail(userCourseId), 
            }),
        }),
        getTopicDetails: builder.query<TopicDetail, { userCourseId: number; topicId: number }>({
            query: ({ userCourseId, topicId }) => ({
                url: API_URLS.userCourse.getTopic,
                params: { userCourseId, TopicId: topicId }, 
            }),
        }),

        updateTopicStatus: builder.mutation<
            UpdateStatusResponse,
            { userTopicId: number; status: string } 
        >({
            query: ({ userTopicId, status }) => ({
                url: API_URLS.userCourse.updateTopicStatus,
                method: 'POST',
                params: { userTopicId, Status: status }, 
            }),
        }),

        updateTopicAssetStatus: builder.mutation<
            UpdateStatusResponse,
            { userTopicAssetId: number; status: string } 
        >({
            query: ({ userTopicAssetId, status }) => ({
                url: API_URLS.userCourse.updateTopicAssetStatus,
                method: 'POST',
                params: { userTopicAssetId, Status: status }, 
            }),
        }),
    }),
});

export const {
    useGetPopularBundlesQuery,
    useGetPopularCoursesQuery,
    useGetCategoriesQuery,
    useGetCoursesByCategoryQuery,
    useGetCourseByIdQuery,
    useGetBundleByIdQuery,
    useSearchCoursesQuery,
    useCreateCourseOrderMutation,
    useVerifyCoursePaymentMutation,
    useCreateBundleOrderMutation,
    useVerifyBundlePaymentMutation,
    useGetMyCoursesQuery,
    useGetMyCourseDetailQuery,
    useGetTopicDetailsQuery,
    useUpdateTopicStatusMutation,
    useUpdateTopicAssetStatusMutation,
} = courseApi;
