// src/api/api_urls.ts

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_URLS = {
    base: {
        root: BASE_URL,
    },
    auth: {
        login: `${BASE_URL}/api/Auth/login`,
        register: `${BASE_URL}/api/Auth/register`,
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
        createPayment: (planId: number) => `${BASE_URL}/api/Payment/create-order?PlanId=${ planId }`,
        verifyPayment: `${BASE_URL}/api/Payment/verify-payment`
    }
};
