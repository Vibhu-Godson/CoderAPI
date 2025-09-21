// src/api/api_urls.ts
export const LOGIN_API = '/api/Auth/login';
export const REGISTER_API = '/api/Auth/register';

export const PROBLEM_LIST_API = '/api/Problem';
export const PROBLEM_DETAIL_API = (id: number) => `/api/Problem/${id}`;
export const PROBLEM_NEW_SESSION_API = '/api/Problem/NewSession';
export const PROBLEM_PROMPT_API = '/api/Problem/Promt';
export const PROBLEM_USER_SOLUTION_API = '/api/Problem/UserSolution';

export const MASTER_TOPICS_API = '/api/Master/Topics';
