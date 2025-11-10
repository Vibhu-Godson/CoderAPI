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
        const res = await sendChat({ value: text }).unwrap();
        await applyLLMExtraction(normalizeChat(res));
    };

    const applyLLMExtraction = async (res: LLMExtraction) => {

        // ============= ROLE =============
        if (res.role) {
            pushChat("bot", "Updating your role...");
            await new Promise(r => setTimeout(r, 300));

            await saveRole({ value: res.role });
            setState((s) => ({ ...s, role: res.role }));

            pushChat("bot", `You are a ${res.role.replaceAll("_", " ")}.`);
            setState((s) => ({ ...s, step: "education" }));
        }

        // ============= EDUCATION =============
        if (res.education) {
            const cleaned = clean<EducationDto>(res.education);

            setState((s) => ({ ...s, education: cleaned }));
            pushChat("bot", "Filling your education details...");
            await new Promise(r => setTimeout(r, 400));

            await saveEdu(cleaned as any);
            pushChat("bot", `Saved your education at ${cleaned.institute}.`);

            setState((s) => ({ ...s, step: "experience" }));
        }

        // ============= EXPERIENCE =============
        if (res.experience) {
            const cleaned = clean<ExperienceDto>(res.experience);

            setState((s) => ({ ...s, experience: cleaned }));
            pushChat("bot", "Adding your work experience...");
            await new Promise(r => setTimeout(r, 400));

            await saveExp(cleaned as any);
            pushChat("bot", `Saved your experience at ${cleaned.company}.`);

            setState((s) => ({ ...s, step: "project" }));
        }

        // ============= PROJECT =============
        if (res.project) {
            const cleaned = clean<ProjectDto>(res.project);

            setState((s) => ({ ...s, project: cleaned }));
            pushChat("bot", "Filling your project details...");
            await new Promise(r => setTimeout(r, 400));

            await saveProject(cleaned as any);
            pushChat("bot", `Saved your project "${cleaned.title}".`);

            setState((s) => ({ ...s, step: "skills" }));
        }

        // ============= SKILLS =============
        if (res.skills) {
            setState((s) => ({ ...s, skills: res.skills }));
            pushChat("bot", "Recording your skills...");
            await new Promise(r => setTimeout(r, 400));

            await saveSkills({ value: res.skills });
            pushChat("bot", "Skills saved!");

            setState((s) => ({ ...s, step: "motivation" }));
        }

        // ============= MOTIVATION =============
        if (res.motivation) {
            setState((s) => ({ ...s, motivation: res.motivation }));
            pushChat("bot", "Saving your motivation...");
            await new Promise(r => setTimeout(r, 300));

            await saveMotivation({ value: res.motivation });
            pushChat("bot", "Motivation saved!");

            setState((s) => ({ ...s, step: "done" }));
        }
    };

    const handleFormSubmit = async (key: StepKey, data: any) => {
        pushChat("user", key === "role" ? `I am a ${data}` : JSON.stringify(data));

        if (key === "role") {
            await saveRole({ value: data });
            setState((s) => ({ ...s, role: data, step: "education" }));
            pushChat("bot", "Great! Let's add your education.");
        }

        if (key === "education") {
            await saveEdu(data);
            setState((s) => ({ ...s, education: data, step: "experience" }));
            pushChat("bot", "Nice! Now your latest work experience.");
        }

        if (key === "experience") {
            await saveExp(data);
            setState((s) => ({ ...s, experience: data, step: "project" }));
            pushChat("bot", "Awesome! Let's add a project.");
        }

        if (key === "project") {
            await saveProject(data);
            setState((s) => ({ ...s, project: data, step: "skills" }));
            pushChat("bot", "Great! Add some skills now.");
        }

        if (key === "skills") {
            await saveSkills({ value: data });
            setState((s) => ({ ...s, skills: data, step: "motivation" }));
            pushChat("bot", "Nice! What motivates you?");
        }

        if (key === "motivation") {
            await saveMotivation({ value: data });
            setState((s) => ({ ...s, motivation: data, step: "done" }));
            pushChat("bot", "All set! Your onboarding is complete 🎉");
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
                            <StepRole
                                onSelect={(v) => handleFormSubmit("role", v)}
                            />
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
