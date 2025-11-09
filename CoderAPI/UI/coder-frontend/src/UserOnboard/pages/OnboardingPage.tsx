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
import StepMotivation from "../components/StepMotivation";

import {
    useSendChatMessageMutation,
    type UserChatResponse,
} from "../apis/userChatApi";

import {
    useSetCurrentRoleMutation,
    useSetEducationMutation,
    useSetExperienceMutation,
    useSetProjectMutation,
    useSetMotivationMutation,
} from "../apis/userDetailApi";

// fallback uid
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// convert backend string to RoleKey
const asRoleKey = (val: string | null): RoleKey | undefined => {
    if (!val) return undefined;
    const allowed: RoleKey[] = [
        "student",
        "professional_0_2",
        "professional_2_5",
        "professional_5_10",
        "professional_10_plus",
        "job_seeker",
    ];
    return (allowed as string[]).includes(val) ? (val as RoleKey) : undefined;
};

// convert API response to internal partial
const normalizeChat = (r: UserChatResponse): LLMExtraction => ({
    role: asRoleKey(r.currentRole),
    education: r.education ?? undefined,
    experience: r.experience ?? undefined,
    project: r.project ?? undefined,
    motivation: r.motivation ?? undefined,
});

function toSafe<T extends Record<string, any>>(obj: Partial<T>): Record<keyof T, string> {
    const out: any = {};
    for (const k in obj) {
        const val = obj[k];
        out[k] = val === null || val === undefined ? "" : String(val);
    }
    return out;
}


// clean null/undefined → empty strings
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
    const [saveMotivation] = useSetMotivationMutation();

    // redirect after finishing onboarding
    useEffect(() => {
        if (state.step === "done") {
            const t = setTimeout(() => {
                navigate("/home");
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [state.step, navigate]);

    const pushChat = (role: "bot" | "user", text: string) => {
        const msg: ChatMessage = { id: uid(), role, text, ts: Date.now() };
        setState((s) => ({ ...s, chat: [...s.chat, msg] }));
    };

    const handleChatUserSend = async (text: string) => {
        pushChat("user", text);
        const res = await sendChat({ value: text }).unwrap();
        await applyLLMExtraction(normalizeChat(res));
    };

    // ✅ When LLM extracts → auto-fill + auto-save + jump
    const applyLLMExtraction = async (res: LLMExtraction) => {

        if (res.role) {
            await saveRole({ value: res.role });
            setState((s) => ({ ...s, role: res.role }));
            pushChat("bot", `Got it — you are a ${res.role.replaceAll("_", " ")}.`);
            setState((s) => ({ ...s, step: "education" }));
        }

        if (res.education) {
            const cleaned = clean<EducationDto>(res.education);
            await saveEdu(cleaned as any);
            setState((s) => ({ ...s, education: cleaned }));
            pushChat("bot", `Recorded your education at ${cleaned.institute}.`);
            setState((s) => ({ ...s, step: "experience" }));
        }

        if (res.experience) {
            const cleaned = clean<ExperienceDto>(res.experience);
            await saveExp(cleaned as any);
            setState((s) => ({ ...s, experience: cleaned }));
            pushChat("bot", `Added your experience at ${cleaned.company}.`);
            setState((s) => ({ ...s, step: "project" }));
        }

        if (res.project) {
            const cleaned = clean<ProjectDto>(res.project);
            await saveProject(cleaned as any);
            setState((s) => ({ ...s, project: cleaned }));
            pushChat("bot", `Your project "${cleaned.title}" looks great!`);
            setState((s) => ({ ...s, step: "motivation" }));
        }

        if (res.motivation) {
            await saveMotivation({ value: res.motivation });
            setState((s) => ({ ...s, motivation: res.motivation }));
            pushChat("bot", "Motivation saved!");
            setState((s) => ({ ...s, step: "done" }));
        }
    };

    // ✅ Form submission (manual entry)
    const handleFormSubmit = async (key: StepKey, data: any) => {
        if (key === "role") {
            pushChat("user", `I am a ${String(data).replaceAll("_", " ")}`);
        } else {
            pushChat("user", JSON.stringify(data));
        }

        if (key === "role") {
            await saveRole({ value: data });
            setState((s) => ({ ...s, role: data, step: "education" }));
            pushChat("bot", "Great! Let's add your latest education.");
        }

        if (key === "education") {
            await saveEdu(data);
            setState((s) => ({ ...s, education: data, step: "experience" }));
            pushChat("bot", "Nice! Now your latest work experience.");
        }

        if (key === "experience") {
            await saveExp(data);
            setState((s) => ({ ...s, experience: data, step: "project" }));
            pushChat("bot", "Awesome! Let's add one recent project.");
        }

        if (key === "project") {
            await saveProject(data);
            setState((s) => ({ ...s, project: data, step: "motivation" }));
            pushChat("bot", "Almost done! What motivates you?");
        }

        if (key === "motivation") {
            await saveMotivation({ value: data });
            setState((s) => ({ ...s, motivation: data, step: "done" }));
            pushChat("bot", "All set! Your onboarding is complete 🎉");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">

                <div className="flex h-[80vh]">

                    {/* LEFT CHAT PANEL */}
                    <div className="w-1/3 border-r bg-white overflow-hidden">
                        <ChatPanel chat={state.chat} onSend={handleChatUserSend} />
                    </div>

                    {/* RIGHT FORM PANEL */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {state.step === "role" && (
                            <StepRole onSelect={(v) => handleFormSubmit("role", v)} />
                        )}

                        {state.step === "education" && (
                            <StepEducation
                                initial={state.education}
                                onSubmit={(v) => handleFormSubmit("education", v)}
                            />
                        )}

                        {state.step === "experience" && (
                            <StepExperience
                                initial={state.experience}
                                onSubmit={(v) => handleFormSubmit("experience", v)}
                            />
                        )}

                        {state.step === "project" && (
                            <StepProject
                                initial={state.project}
                                onSubmit={(v) => handleFormSubmit("project", v)}
                            />
                        )}

                        {state.step === "motivation" && (
                            <StepMotivation
                                initial={state.motivation || ""}
                                onSubmit={(v) => handleFormSubmit("motivation", v)}
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
