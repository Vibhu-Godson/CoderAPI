import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    useSendChatMessageMutation,
} from "../apis/userChatApi";
import {
    useSetCurrentRoleMutation,
    useSetEducationMutation,
    useSetExperienceMutation,
    useSetProjectMutation,
    useSetMotivationMutation,
    useSetSkillsMutation,
} from "../apis/userDetailApi";
import { useLazyUserOnboardDoneQuery } from "../../auth/authApi";

import {
    ChatMessage,
    OnboardingState,
    StepKey,
    LLMExtraction,
    EducationDto,
    ExperienceDto,
    ProjectDto,
    RoleKey,
} from "../types";

import { ChatPanel } from "../components/ChatPanel";

import StepRole from "../components/StepRole";
import StepExperience from "../components/StepExperience";
import StepEducation from "../components/StepEducation";
import StepProject from "../components/StepProject";
import StepSkills from "../components/StepSkills";
import StepMotivation from "../components/StepMotivation";

// Mobile tab view state
type MobileTabView = "chat" | "form";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const allowedRoles: RoleKey[] = [
    "student",
    "professional_0_2",
    "professional_2_5",
    "professional_5_10",
    "professional_10_plus",
    "job_seeker",
];

const asRoleKey = (val: string | null): RoleKey | undefined =>
    val && allowedRoles.includes(val as RoleKey) ? (val as RoleKey) : undefined;

const normalizeChat = (r: any): LLMExtraction => ({
    role: asRoleKey(r.currentRole),
    education: r.education ?? undefined,
    experience: r.experience ?? undefined,
    project: r.project ?? undefined,
    skills: r.skills ?? undefined,
    motivation: r.motivation ?? undefined,
});

// Replace null → ""
function clean<T extends Record<string, any>>(obj: Partial<T> | null | undefined): T {
    const out: any = {};
    if (!obj) return out as T;
    for (const k in obj) out[k] = obj[k] ?? "";
    return out as T;
}

export default function OnboardingPage() {
    const navigate = useNavigate();

    const [state, setState] = useState<OnboardingState>({
        step: "role",
        chat: [
            {
                id: uid(),
                role: "bot",
                text: "Welcome to AmCoder! Let's quickly set up your profile.",
                ts: Date.now(),
            },
            {
                id: uid(),
                role: "bot",
                text: "To start: Select your professional role (student, professional with 0-2 years, 2-5 years, etc.)",
                ts: Date.now(),
            },
        ],
    });

    const [mobileTabView, setMobileTabView] = useState<MobileTabView>("form");

    const [sendChat] = useSendChatMessageMutation();
    const [saveRole] = useSetCurrentRoleMutation();
    const [saveEdu] = useSetEducationMutation();
    const [saveExp] = useSetExperienceMutation();
    const [saveProject] = useSetProjectMutation();
    const [saveSkills] = useSetSkillsMutation();
    const [saveMotivation] = useSetMotivationMutation();
    const [checkOnboarded] = useLazyUserOnboardDoneQuery();

    useEffect(() => {
        if (state.step === "done") {
            const t = setTimeout(async () => {
                try {
                    const result = await checkOnboarded(undefined).unwrap();
                    if (result.status) {
                        navigate("/home");
                    } else {
                        pushChat("bot", "⚠️ Verification failed. Your profile wasn't saved properly. Please refresh and try again.");
                    }
                } catch (err) {
                    pushChat("bot", "⚠️ Connection error. Please check your internet and try again.");
                    console.error("Onboarding verification failed:", err);
                }
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [state.step, navigate, checkOnboarded]);

    const pushChat = (role: "bot" | "user", text: string) => {
        const msg: ChatMessage = { id: uid(), role, text, ts: Date.now() };
        setState((s) => ({ ...s, chat: [...s.chat, msg] }));
    };

    const goBack = () => {
        const order: StepKey[] = [
            "role",
            "education",
            "experience",
            "project",
            "skills",
            "motivation",
            "done",
        ];
        const idx = order.indexOf(state.step);
        if (idx > 0) {
            const prev = order[idx - 1];
            pushChat("bot", `Going back to ${prev} step...`);
            setState((s) => ({ ...s, step: prev }));
        }
    };

    const handleSkipStep = () => {
        const order: StepKey[] = [
            "role",
            "education",
            "experience",
            "project",
            "skills",
            "motivation",
            "done",
        ];
        const idx = order.indexOf(state.step);
        if (idx < order.length - 1) {
            const next = order[idx + 1];
            pushChat("bot", `Skipped ${state.step}. Moving to ${next}...`);
            setState((s) => ({ ...s, step: next }));
        }
    };

    const handleChatUserSend = async (text: string) => {
        pushChat("user", text);
        const res = await sendChat({ value: text }).unwrap();
        await applyLLMExtraction(normalizeChat(res));
    };

    /**
     * Format form data into readable chat message
     * Instead of showing raw JSON, show: "Form filled with: key1=value1, key2=value2"
     */
    const formatFormDataAsChat = (key: StepKey, data: any): string => {
        if (key === "role") {
            return `I am a ${data.replace(/_/g, " ")}`;
        }

        if (key === "education") {
            return `Form filled with: ${data.institute}, ${data.degree} in ${data.fieldOfStudy} (${data.completionYear})`;
        }

        if (key === "experience") {
            return `Form filled with: ${data.role} at ${data.company} (${data.startDate} to ${data.enddate})`;
        }

        if (key === "project") {
            return `Form filled with: Project "${data.title}" built with ${data.techStack} - ${data.description}`;
        }

        if (key === "skills") {
            return `Form filled with: Skills - ${Array.isArray(data) ? data.join(", ") : data}`;
        }

        if (key === "motivation") {
            return `Form filled with: "${data}"`;
        }

        return data;
    };

    const applyLLMExtraction = async (res: LLMExtraction) => {

        // ============= ROLE =============
        if (res.role) {
            pushChat("bot", "Updating your role...");
            await new Promise(r => setTimeout(r, 300));

            try {
                await saveRole({ value: res.role }).unwrap();
                setState((s) => ({ ...s, role: res.role }));
                pushChat("bot", `You are a ${res.role.replaceAll("_", " ")}.`);
                setState((s) => ({ ...s, step: "education" }));
            } catch (err) {
                pushChat("bot", "❌ Failed to save your role. Please try again.");
                console.error("Role save failed:", err);
            }
        }

        // ============= EDUCATION =============
        if (res.education) {
            const cleaned = clean<EducationDto>(res.education);

            setState((s) => ({ ...s, education: cleaned }));
            pushChat("bot", "Filling your education details...");
            await new Promise(r => setTimeout(r, 400));

            try {
                await saveEdu(cleaned as any).unwrap();
                pushChat("bot", `Saved your education at ${cleaned.institute}.`);
                setState((s) => ({ ...s, step: "experience" }));
            } catch (err) {
                pushChat("bot", "❌ Failed to save education. Please try again.");
                console.error("Education save failed:", err);
            }
        }

        // ============= EXPERIENCE =============
        if (res.experience) {
            const cleaned = clean<ExperienceDto>(res.experience);

            setState((s) => ({ ...s, experience: cleaned }));
            pushChat("bot", "Adding your work experience...");
            await new Promise(r => setTimeout(r, 400));

            try {
                await saveExp(cleaned as any).unwrap();
                pushChat("bot", `Saved your experience at ${cleaned.company}.`);
                setState((s) => ({ ...s, step: "project" }));
            } catch (err) {
                pushChat("bot", "❌ Failed to save experience. Please try again.");
                console.error("Experience save failed:", err);
            }
        }

        // ============= PROJECT =============
        if (res.project) {
            const cleaned = clean<ProjectDto>(res.project);

            setState((s) => ({ ...s, project: cleaned }));
            pushChat("bot", "Filling your project details...");
            await new Promise(r => setTimeout(r, 400));

            try {
                await saveProject(cleaned as any).unwrap();
                pushChat("bot", `Saved your project "${cleaned.title}".`);
                setState((s) => ({ ...s, step: "skills" }));
            } catch (err) {
                pushChat("bot", "❌ Failed to save project. Please try again.");
                console.error("Project save failed:", err);
            }
        }

        // ============= SKILLS =============
        if (res.skills) {
            setState((s) => ({ ...s, skills: res.skills }));
            pushChat("bot", "Recording your skills...");
            await new Promise(r => setTimeout(r, 400));

            try {
                await saveSkills({ value: res.skills }).unwrap();
                pushChat("bot", "Skills saved!");
                setState((s) => ({ ...s, step: "motivation" }));
            } catch (err) {
                pushChat("bot", "❌ Failed to save skills. Please try again.");
                console.error("Skills save failed:", err);
            }
        }

        // ============= MOTIVATION =============
        if (res.motivation) {
            setState((s) => ({ ...s, motivation: res.motivation }));
            pushChat("bot", "Saving your motivation...");
            await new Promise(r => setTimeout(r, 300));

            try {
                await saveMotivation({ value: res.motivation }).unwrap();
                pushChat("bot", "Motivation saved!");
                setState((s) => ({ ...s, step: "done" }));
            } catch (err) {
                pushChat("bot", "❌ Failed to save motivation. Please try again.");
                console.error("Motivation save failed:", err);
            }
        }
    };

    const handleFormSubmit = async (key: StepKey, data: any) => {
        // Use formatted message instead of raw JSON
        pushChat("user", formatFormDataAsChat(key, data));

        try {
            if (key === "role") {
                await saveRole({ value: data }).unwrap();
                setState((s) => ({ ...s, role: data, step: "education" }));
                pushChat("bot", "Great! Now tell me about your last education: college/university name, degree (B.Tech, B.S., etc), field of study, and completion year.");
            }

            if (key === "education") {
                await saveEdu(data).unwrap();
                setState((s) => ({ ...s, education: data, step: "experience" }));
                pushChat("bot", "Perfect! Now share your latest work experience: company name, job title, start and end dates.");
            }

            if (key === "experience") {
                await saveExp(data).unwrap();
                setState((s) => ({ ...s, experience: data, step: "project" }));
                pushChat("bot", "Awesome! Now tell me about a project you built: project name, technologies used, and what it does.");
            }

            if (key === "project") {
                await saveProject(data).unwrap();
                setState((s) => ({ ...s, project: data, step: "skills" }));
                pushChat("bot", "Excellent! Now add your technical skills (e.g., JavaScript, React, Python, SQL, etc). Use the suggestions or add your own.");
            }

            if (key === "skills") {
                await saveSkills({ value: data }).unwrap();
                setState((s) => ({ ...s, skills: data, step: "motivation" }));
                pushChat("bot", "Great! Finally, what motivates you in your career? Select from suggestions or tell us in your own words.");
            }

            if (key === "motivation") {
                await saveMotivation({ value: data }).unwrap();
                setState((s) => ({ ...s, motivation: data, step: "done" }));
                pushChat("bot", "All set! Your onboarding is complete 🎉");
            }
        } catch (err) {
            pushChat("bot", `❌ Failed to save ${key}. Please check your connection and try again.`);
            console.error(`${key} save failed:`, err);
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center px-0 sm:px-4 py-0 sm:py-2 overflow-hidden">
            <div className="w-full h-full sm:h-[98vh] max-w-7xl bg-white rounded-none sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                {/* ============= DESKTOP: Left Chat Panel (1/3) ============= */}
                <div className="hidden lg:flex lg:w-1/3 border-r border-slate-200 bg-white overflow-hidden flex-col h-full">
                    <ChatPanel chat={state.chat} onSend={handleChatUserSend} />
                </div>

                {/* ============= DESKTOP: Right Form Panel (2/3) ============= */}
                <div className="hidden lg:flex lg:w-2/3 flex-col h-full">
                    <FormRenderer />
                </div>

                {/* ============= MOBILE & TABLET: Tab-based Navigation ============= */}
                <div className="lg:hidden w-full h-full flex flex-col">
                    {/* Tab Buttons */}
                    <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10">
                        <button
                            onClick={() => setMobileTabView("chat")}
                            className={`flex-1 py-3 px-4 font-semibold text-center transition-colors border-b-2 text-sm ${
                                mobileTabView === "chat"
                                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                                    : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                            aria-label="Chat tab"
                        >
                            💬 Chat
                        </button>
                        <button
                            onClick={() => setMobileTabView("form")}
                            className={`flex-1 py-3 px-4 font-semibold text-center transition-colors border-b-2 text-sm ${
                                mobileTabView === "form"
                                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                                    : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                            aria-label="Form tab"
                        >
                            📝 Form
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden bg-slate-50">
                        {mobileTabView === "chat" ? (
                            <div className="h-full w-full flex flex-col">
                                <ChatPanel chat={state.chat} onSend={handleChatUserSend} />
                            </div>
                        ) : (
                            <div className="h-full w-full overflow-y-auto p-3 sm:p-4">
                                <FormRenderer skipButton onSkipStep={() => {
                                    // Handle skip
                                }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Form content renderer
    function FormRenderer(props?: { skipButton?: boolean; onSkipStep?: () => void }) {
        return (
            <div className="w-full h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="max-w-2xl">
                        {state.step === "role" && (
                            <StepRole
                                onSelect={(v) => handleFormSubmit("role", v)}
                                onSkip={() => handleSkipStep()}
                            />
                        )}

                        {state.step === "education" && (
                            <StepEducation
                                initial={state.education}
                                onSubmit={(v) => handleFormSubmit("education", v)}
                                onBack={goBack}
                                onSkip={() => handleSkipStep()}
                            />
                        )}

                        {state.step === "experience" && (
                            <StepExperience
                                initial={state.experience}
                                onSubmit={(v) => handleFormSubmit("experience", v)}
                                onBack={goBack}
                                onSkip={() => handleSkipStep()}
                            />
                        )}

                        {state.step === "project" && (
                            <StepProject
                                initial={state.project}
                                onSubmit={(v) => handleFormSubmit("project", v)}
                                onBack={goBack}
                                onSkip={() => handleSkipStep()}
                            />
                        )}

                        {state.step === "skills" && (
                            <StepSkills
                                initial={state.skills}
                                onSubmit={(v) => handleFormSubmit("skills", v)}
                                onBack={goBack}
                                onSkip={() => handleSkipStep()}
                            />
                        )}

                        {state.step === "motivation" && (
                            <StepMotivation
                                initial={state.motivation || ""}
                                onSubmit={(v) => handleFormSubmit("motivation", v)}
                                onBack={goBack}
                                onSkip={() => handleSkipStep()}
                            />
                        )}

                        {state.step === "done" && (
                            <div className="text-center space-y-4 py-8">
                                <div className="text-5xl animate-bounce">🎉</div>
                                <h2 className="text-2xl font-bold text-green-600">
                                    Profile Complete!
                                </h2>
                                <p className="text-slate-600 text-base">
                                    Redirecting to home...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
