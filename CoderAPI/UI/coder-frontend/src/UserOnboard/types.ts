export type RoleKey =
    | "student"
    | "professional_0_2"
    | "professional_2_5"
    | "professional_5_10"
    | "professional_10_plus"
    | "job_seeker";

export interface ChatMessage {
    id: string;
    role: "bot" | "user";
    text: string;
    ts: number;
}

export type StepKey =
    | "role"
    | "experience"
    | "education"
    | "project"
    | "motivation"
    | "done";

export interface EducationDto {
    institute: string | null;
    degree: string | null;
    fieldOfStudy: string | null;
    completionYear: string | null;
}

export interface ExperienceDto {
    company: string | null;
    role: string | null;
    startDate: string | null; // yyyy-mm-dd
    enddate: string | null;   // yyyy-mm-dd
    description?: string | null;
}

export interface ProjectDto {
    title: string | null;
    description: string | null;
    techStacks: string | null; // comma separated
    projectLink: string | null;
}

export interface OnboardingState {
    step: StepKey;
    role?: RoleKey;
    education?: EducationDto;
    experience?: ExperienceDto;
    project?: ProjectDto;
    motivation?: string | null;
    chat: ChatMessage[];
}

export interface LLMExtraction {
    role?: RoleKey;
    education?: Partial<EducationDto>;
    experience?: Partial<ExperienceDto>;
    project?: Partial<ProjectDto>;
    motivation?: string | null;
}
