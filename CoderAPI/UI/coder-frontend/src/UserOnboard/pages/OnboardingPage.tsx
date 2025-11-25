import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

import { useSendChatMessageMutation } from "../apis/userChatApi";

import {
    useSetCurrentRoleMutation,
    useSetEducationMutation,
    useSetExperienceMutation,
    useSetProjectMutation,
    useSetMotivationMutation,
    useSetSkillsMutation,
} from "../apis/userDetailApi";

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
                text: "What best describes you?",
                ts: Date.now(),
            },
        ],
    });

    const [sendChat] = useSendChatMessageMutation();
    const [saveRole] = useSetCurrentRoleMutation();
    const [saveEdu] = useSetEducationMutation();
    const [saveExp] = useSetExperienceMutation();
    const [saveProject] = useSetProjectMutation();
    const [saveSkills] = useSetSkillsMutation();
    const [saveMotivation] = useSetMotivationMutation();

    useEffect(() => {
        if (state.step === "done") {
            const t = setTimeout(() => navigate("/home"), 1500);
            return () => clearTimeout(t);
        }
    }, [state.step, navigate]);

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

    const handleChatUserSend = async (text: string) => {
        pushChat("user", text);
        const res = await sendChat({
            value: text,
            placeholder: state.step,
        }).unwrap();

        await applyLLMExtraction(normalizeChat(res));
    };

    const autoSubmit = (key: StepKey, data: any) => {
        setTimeout(() => {
            handleFormSubmit(key, data);
        }, 2000);
    };

    const applyLLMExtraction = async (res: LLMExtraction) => {

        // ============= ROLE =============
        if (res.role) {
            pushChat("bot", "Updating your role...");
            setState((s) => ({ ...s, role: res.role }));

            // Show the form filled for role
            autoSubmit("role", res.role);
            return;
        }

        // ============= EDUCATION =============
        if (res.education) {
            const cleaned = clean<EducationDto>(res.education);

            pushChat("bot", "Extracting your education details...");
            setState((s) => ({ ...s, education: cleaned }));

            autoSubmit("education", cleaned);
            return;
        }

        // ============= EXPERIENCE =============
        if (res.experience) {
            const cleaned = clean<ExperienceDto>(res.experience);

            pushChat("bot", "Extracting your work experience...");
            setState((s) => ({ ...s, experience: cleaned }));

            autoSubmit("experience", cleaned);
            return;
        }

        // ============= PROJECT =============
        if (res.project) {
            const cleaned = clean<ProjectDto>(res.project);

            pushChat("bot", "Extracting your project details...");
            setState((s) => ({ ...s, project: cleaned }));

            autoSubmit("project", cleaned);
            return;
        }

        // ============= SKILLS =============
        if (res.skills) {
            pushChat("bot", "Extracting your skills...");
            setState((s) => ({ ...s, skills: res.skills }));

            autoSubmit("skills", res.skills);
            return;
        }

        // ============= MOTIVATION =============
        if (res.motivation) {
            pushChat("bot", "Extracting your motivation...");
            setState((s) => ({ ...s, motivation: res.motivation }));

            autoSubmit("motivation", res.motivation);
            return;
        }
    };

    const handleFormSubmit = async (key: StepKey, data: any) => {
        pushChat("user", key === "role" ? `I am a ${data}` : JSON.stringify(data));

        // Save first (API call)
        if (key === "role") {
            await saveRole({ value: data });
            pushChat("bot", "Great! Let's add your education.");

            // Update data only
            setState((s) => ({ ...s, role: data }));

            // Delay switching to next form
            setTimeout(() => {
                setState((s) => ({ ...s, step: "education" }));
            }, 800);
        }

        if (key === "education") {
            await saveEdu(data);
            pushChat("bot", "Nice! Now your latest work experience.");

            setState((s) => ({ ...s, education: data }));

            setTimeout(() => {
                setState((s) => ({ ...s, step: "experience" }));
            }, 800);
        }

        if (key === "experience") {
            await saveExp(data);
            pushChat("bot", "Awesome! Let's add a project.");

            setState((s) => ({ ...s, experience: data }));

            setTimeout(() => {
                setState((s) => ({ ...s, step: "project" }));
            }, 800);
        }

        if (key === "project") {
            await saveProject(data);
            pushChat("bot", "Great! Add some skills now.");

            setState((s) => ({ ...s, project: data }));

            setTimeout(() => {
                setState((s) => ({ ...s, step: "skills" }));
            }, 800);
        }

        if (key === "skills") {
            await saveSkills({ value: data });
            pushChat("bot", "Nice! What motivates you?");

            setState((s) => ({ ...s, skills: data }));

            setTimeout(() => {
                setState((s) => ({ ...s, step: "motivation" }));
            }, 800);
        }

        if (key === "motivation") {
            await saveMotivation({ value: data });
            pushChat("bot", "All set! Your onboarding is complete 🎉");

            setState((s) => ({ ...s, motivation: data }));

            setTimeout(() => {
                setState((s) => ({ ...s, step: "done" }));
            }, 800);
        }
    };


    return (
        <div className="h-screen bg-gray-100 flex justify-center items-center px-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">

                <div className="flex h-[80vh]">

                    {/* LEFT CHAT PANEL */}
                    <div className="w-1/3 border-r bg-white overflow-hidden">
                        <ChatPanel chat={state.chat} onSend={handleChatUserSend} />
                    </div>

                    {/* RIGHT FORMS */}
                    <div className="flex-1 p-6 overflow-y-auto">

                        {state.step === "role" && (
                            <StepRole onSelect={(v) => handleFormSubmit("role", v)} />
                        )}

                        {state.step === "education" && (
                            <StepEducation
                                initial={state.education}
                                onSubmit={(v) => handleFormSubmit("education", v)}
                                onBack={goBack}
                            />
                        )}

                        {state.step === "experience" && (
                            <StepExperience
                                initial={state.experience}
                                onSubmit={(v) => handleFormSubmit("experience", v)}
                                onBack={goBack}
                            />
                        )}

                        {state.step === "project" && (
                            <StepProject
                                initial={state.project}
                                onSubmit={(v) => handleFormSubmit("project", v)}
                                onBack={goBack}
                            />
                        )}

                        {state.step === "skills" && (
                            <StepSkills
                                initial={state.skills}
                                onSubmit={(v) => handleFormSubmit("skills", v)}
                                onBack={goBack}
                            />
                        )}

                        {state.step === "motivation" && (
                            <StepMotivation
                                initial={state.motivation || ""}
                                onSubmit={(v) => handleFormSubmit("motivation", v)}
                                onBack={goBack}
                            />
                        )}

                        {state.step === "done" && (
                            <div className="text-center text-xl text-green-600 font-semibold">
                                ✅ Your onboarding is complete!
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}
