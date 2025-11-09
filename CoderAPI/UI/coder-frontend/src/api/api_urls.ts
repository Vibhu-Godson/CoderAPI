// src/api/api_urls.ts

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_URLS = {
    base: {
        root: BASE_URL,
    },
    auth: {
        login: `${BASE_URL}/api/Auth/login`,
        register: `${BASE_URL}/api/Auth/register`,
        socialLogin: ``,
    },
    problem: {
        list: `${BASE_URL}/api/Problem`,
        detail: (id: number) => `${BASE_URL}/api/Problem/${id}`,
        newSession: `${BASE_URL}/api/Problem/NewSession`,
        prompt: `${BASE_URL}/api/Problem/Promt`,
        userSolution: `${BASE_URL}/api/Problem/UserSolution`,
        completeSession: (id: number) => `${BASE_URL}/api/Problem/CompleteSession?userSessionId=${id}`,
    },
    master: {
        topics: `${BASE_URL}/api/Master/Topics`,
    },
    hub: {
        submission: `${BASE_URL}/hubs/codeExecution`
    },
    plans: {
        list: `${BASE_URL}/api/Plan`,
        subscribe: `${BASE_URL}/api/Plan/subscribe`,
    },
    home: {
        dashboard: "/home/dashboard",
    },
    payment: {
        createPayment: (planId: number) => `${BASE_URL}/api/Payment/Plan/create-order?PlanId=${ planId }`,
        verifyPayment: `${BASE_URL}/api/Payment/Plan/verify-payment`,
        createCoursePayment: (courseId: number) => `${BASE_URL}/api/Payment/Course/create-order?CourseId=${courseId}`,
        verifyCoursePayment: `${BASE_URL}/api/Payment/Course/verify-payment`,
        createBundlePayment: (bundleId: number) => `${BASE_URL}/api/Payment/Bundle/create-order?BundleId=${bundleId}`,
        verifyBundlePayment: `${BASE_URL}/api/Payment/Bundle/verify-payment`,
    },
    course: {
        getPopularCourses: '/api/Course/Popular',
        getPopularBundles: '/api/Course/PopularBundles',
        getCategories: '/api/Course/Categories',
        getCoursesByCategory: (id: number) => `/api/Course/categories/${id}/courses`,
        getCourseById: (id: number) => `/api/Course/${id}`,
        getBundleById: (id: number) => `/api/Course/Bundles/${id}`,
        searchCourses: '/api/Course/Search',
    },
    userCourse: {
        getMyCourses: '/api/UserCourse/All',
        getDetail: (userCourseId: number) => `/api/UserCourse/detail?UserCourseId=${userCourseId}`,
        getTopic: '/api/UserCourse/Topic', 
        updateTopicStatus: '/api/UserCourse/UpdateTopicStatus', 
        updateTopicAssetStatus: '/api/UserCourse/UpdateTopicAssetStatus', 

    },
    problemDetail: {
        getLanguages: `${BASE_URL}/api/ProblemDetail/Languages`,
        getStarterCode: `${BASE_URL}/api/ProblemDetail/StarterCode`,
    },
    userProblem: {
        listSolutions: '/api/UserProblem/ListSolutions',
        listChats: '/api/UserProblem/ListChats',
        solution: '/api/UserProblem/Solution',
        chat: '/api/UserProblem/Chat',
    },
    userDetails: {
        currentRole: `${BASE_URL}/api/UserDetails/CurrentRole`,
        experience: `${BASE_URL}/api/UserDetails/Experience`,
        education: `${BASE_URL}/api/UserDetails/Education`,
        project: `${BASE_URL}/api/UserDetails/Project`,
        motivation: `${BASE_URL}/api/UserDetails/Motivation`,
        chat: `${BASE_URL}/api/UserDetails/Chat`
    },
};
