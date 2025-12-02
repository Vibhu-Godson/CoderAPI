import { useCallback, useMemo, useState } from "react";
import { ChatMessage, OnboardingState, RoleKey, StepKey } from "../types";

function uid() {
    return Math.random().toString(36).slice(2);
}

function getSequence(role?: RoleKey): StepKey[] {
    if (!role) return ["role"];

    const base: StepKey[] = [];
    if (role === "student") {
        base.push("education");
    } else if (role === "job_seeker") {
        base.push("experience", "education");
    } else {
        base.push("experience", "education");
    }
    base.push("project", "motivation", "done");
    return base;
}

export function useOnboarding() {
    const [state, setState] = useState<OnboardingState>({
        step: "role",
        chat: [
            { id: uid(), role: "bot", text: "Welcome to AmCoder! Let's set up your profile.", ts: Date.now() },
            { id: uid(), role: "bot", text: "What describes you best?", ts: Date.now() },
        ],
    });

    const sequence = useMemo(() => getSequence(state.role), [state.role]);
    const stepIndex = useMemo(() => sequence.indexOf(state.step), [sequence, state.step]);

    const appendChat = useCallback((msg: Omit<ChatMessage, "id" | "ts">) => {
        setState(s => ({
            ...s,
            chat: [...s.chat, { id: uid(), ts: Date.now(), ...msg }],
        }));
    }, []);

    const goNext = useCallback(() => {
        setState(s => {
            const seq = getSequence(s.role);
            const idx = seq.indexOf(s.step);
            const next = seq[Math.min(idx + 1, seq.length - 1)];
            return { ...s, step: next };
        });
    }, []);

    const setRole = useCallback((role: RoleKey) => {
        setState(s => ({
            ...s,
            role,
            step: getSequence(role)[0] === "role" ? "education" : getSequence(role)[0], // role is now decided, move to next
        }));
    }, []);

    const jumpTo = useCallback((step: StepKey) => {
        setState(s => ({ ...s, step }));
    }, []);

    return {
        state,
        setState,
        appendChat,
        goNext,
        setRole,
        jumpTo,
        sequence,
        stepIndex,
    };
}
