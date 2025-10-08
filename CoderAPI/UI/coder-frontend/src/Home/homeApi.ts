// src/features/Home/homeApi.ts
import { baseApi } from "../api/baseApi";
import { API_URLS } from "../api/api_urls";

export interface DashboardResponse {
    progress: {
        problemsSolved: number;
        coursesCompleted: number;
        badges: number;
    };
    mentorSuggestions: {
        problems: { id: number; title: string; difficulty: string }[];
        courses: { id: number; title: string }[];
    };
    communityHighlights: { id: number; title: string; author: string }[];
    announcements: { id: number; message: string }[];
}

export const homeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardResponse, void>({
            query: () => ({
                url: API_URLS.home.dashboard, // e.g. /api/home/dashboard
                method: "GET",
            }),
        }),
    }),
});

export const { useGetDashboardQuery } = homeApi;


/*
{
  "progress": { "problemsSolved": 128, "coursesCompleted": 2, "badges": 5 },
  "mentorSuggestions": {
    "problems": [
      { "id": 1, "title": "Resume DFS problem", "difficulty": "Medium" },
      { "id": 2, "title": "Try a new Binary Search challenge", "difficulty": "Hard" }
    ],
    "courses": [{ "id": 10, "title": "Dynamic Programming Basics" }]
  },
  "communityHighlights": [
    { "id": 101, "title": "Understanding Graph Traversal", "author": "Priya" },
    { "id": 102, "title": "5 Tips to Master Recursion", "author": "Aman" }
  ],
  "announcements": [
    { "id": 1, "message": "🚀 New Course: System Design Deep Dive" }
  ]
}

*/