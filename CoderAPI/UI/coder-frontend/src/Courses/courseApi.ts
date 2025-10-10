// src/features/course/courseApi.ts
import { baseApi } from '../api/baseApi';
import { API_URLS } from '../api/api_urls';
import type { Course, Bundle, Category } from './types/course';

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
} = courseApi;
