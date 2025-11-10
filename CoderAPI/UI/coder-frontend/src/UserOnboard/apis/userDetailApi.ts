import { baseApi } from "../../api/baseApi";
import { API_URLS } from "../../api/api_urls";

// -------------------------
// ✅ Request + Response Types
// -------------------------

export interface ApiResponse {
    status: boolean;
    message: string;
}

// ✅ Step 1: Current Role
export interface CurrentRoleRequest {
    value: string; // "student" | "professional_0_2" | etc.
}

// ✅ Step 2: Experience
export interface ExperienceRequest {
    company: string;
    role: string;
    startDate: string; // yyyy-mm-dd
    enddate: string;   // yyyy-mm-dd
    description?: string;
}

// ✅ Step 3: Education
export interface EducationRequest {
    institute: string;
    degree: string;
    fieldOfStudy: string;
    completionYear: string;
}

// ✅ Step 4: Project
export interface ProjectRequest {
    title: string;
    description: string;
    techStacks: string;   // comma separated string
    projectLink: string;
}

// ✅ Step 5: Motivation
export interface MotivationRequest {
    value: string;
}

export interface SkillsRequest {
    value: string;
}
// -------------------------
// ✅ RTK Query Endpoints
// -------------------------

export const userDetailApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ 1. Set Current Role
        setCurrentRole: builder.mutation<ApiResponse, CurrentRoleRequest>({
            query: (body) => ({
                url: API_URLS.userDetails.currentRole,
                method: "POST",
                body,
            }),
        }),

        // ✅ 2. Add Experience
        setExperience: builder.mutation<ApiResponse, ExperienceRequest>({
            query: (body) => ({
                url: API_URLS.userDetails.experience,
                method: "POST",
                body,
            }),
        }),

        // ✅ 3. Add Education
        setEducation: builder.mutation<ApiResponse, EducationRequest>({
            query: (body) => ({
                url: API_URLS.userDetails.education,
                method: "POST",
                body,
            }),
        }),

        // ✅ 4. Add Project
        setProject: builder.mutation<ApiResponse, ProjectRequest>({
            query: (body) => ({
                url: API_URLS.userDetails.project,
                method: "POST",
                body,
            }),
        }),

        // ✅ 5. Motivation
        setMotivation: builder.mutation<ApiResponse, MotivationRequest>({
            query: (body) => ({
                url: API_URLS.userDetails.motivation,
                method: "POST",
                body,
            }),
        }),
        setSkills: builder.mutation<ApiResponse, SkillsRequest>({
            query: (body) => ({
                url: API_URLS.userDetails.skills,
                method: "POST",
                body,
            }),
        }),

    }),
});

// Export hooks
export const {
    useSetCurrentRoleMutation,
    useSetExperienceMutation,
    useSetEducationMutation,
    useSetProjectMutation,
    useSetMotivationMutation,
    useSetSkillsMutation,
} = userDetailApi;
