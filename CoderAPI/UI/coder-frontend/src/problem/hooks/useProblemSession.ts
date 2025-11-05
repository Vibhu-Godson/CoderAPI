import { useState, useEffect, useCallback } from "react";
import { signalRService, ExecutionCompletedPayload } from "../../Service/signalRService";
import {
    useNewSessionMutation,
    useSendPromptMutation,
    useRunOrSubmitSolutionMutation,
    useCompleteSessionMutation,
} from "../problemApi";

const AI_START_MESSAGES = [
    "What is your initial approach to solve this problem?",
    "Before writing code, can you outline your strategy?",
    "How do you plan to tackle the core logic of this problem?",
    "Let's start with an explanation. What's your algorithm idea?",
];

const USER_SUCCESS_MESSAGES = [
    "I’ve submitted my final solution, and all testcases passed 🎯",
    "Looks like my code’s working perfectly — ready for review!",
];

const AI_FOLLOWUP_MESSAGES = [
    "Nice work! Could you walk me through your code logic step by step?",
    "That’s great! Let’s make sure you truly understand — can you explain how your solution works?",
];

export function useProblemSession(
    problemId: number,
    problem: any,
    isSuccess: boolean,
    isPremiumUser: boolean,
    code: string,
    language: string
) {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [chat, setChat] = useState<{ from: "ai" | "user"; text: string; meta?: string[] }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [signalRConnected, setSignalRConnected] = useState(false);
    const [editorLocked, setEditorLocked] = useState(true);
    const [lastSubmittedSolutionId, setLastSubmittedSolutionId] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    const [completeSession] = useCompleteSessionMutation();
    const [showSessionCompleted, setShowSessionCompleted] = useState(false);

    const [startSession] = useNewSessionMutation();
    const [sendPrompt] = useSendPromptMutation();
    const [runOrSubmit] = useRunOrSubmitSolutionMutation();

    // --- INITIAL SESSION SETUP ---
    useEffect(() => {
        if (!isSuccess || !problem?.problemId || sessionId) return;
        if (problem.isLocked && !isPremiumUser) return;

        (async () => {
            try {
                const res = await startSession(problem.problemId).unwrap();
                if (res.status) {
                    setSessionId(res.userProblemSessionId);
                    const randomMsg = AI_START_MESSAGES[Math.floor(Math.random() * AI_START_MESSAGES.length)];
                    setChat([{ from: "ai", text: randomMsg }]);
                    await signalRService.connect();
                    setSignalRConnected(signalRService.isConnected());
                    await signalRService.joinSolutionGroup(res.userProblemSessionId);
                }
            } catch (e) {
                console.error("Error creating session:", e);
            }
        })();
    }, [isSuccess, problem, sessionId, startSession, isPremiumUser]);

    // --- CLEANUP ON UNMOUNT ---
    useEffect(() => {
        return () => {
            (async () => {
                try {
                    await signalRService.disconnect();
                } catch { }
            })();
        };
    }, []);


    // --- CHAT SEND ---
    const handleSend = async (
        userMessage: string,
        includeCode: boolean,
        includeBoard: boolean,
        codeContent?: string,
        boardData?: string
    ) => {
        if (!sessionId || !userMessage.trim()) return;

        const meta: string[] = [];
        if (includeCode) meta.push("Code");
        if (includeBoard) meta.push("Whiteboard");

        setChat((c) => [...c, { from: "user", text: userMessage, meta }]);
        setUserInput("");
        setIsThinking(true);

        try {
            const res = await sendPrompt({
                problemId,
                userProblemSessionId: sessionId,
                userText: userMessage,
                userSolutionId: lastSubmittedSolutionId ?? undefined,
                isAfterSubmit: !!lastSubmittedSolutionId,
                includeCode,
                includeBoard,
                codeContent: includeCode ? codeContent : undefined,
                boardData: includeBoard ? boardData : undefined,
            }).unwrap();

            setChat((c) => [...c, { from: "ai", text: res.message }]);
            setIsThinking(false);

            // ✅ Unlock the editor if AI confidence is high enough
            if (res.accuracy && res.accuracy > 0.5) {
                console.log("🔓 Unlocking editor (accuracy:", res.accuracy, ")");
                setEditorLocked(false);
            }

            // ✅ If accuracy ≥ 0.8 and the user already submitted → complete the session
            if (res.accuracy && res.accuracy >= 0.8 && lastSubmittedSolutionId && sessionId) {
                try {
                    console.log("📨 Calling completeSession...");
                    const completeRes = await completeSession({ userSessionId: sessionId }).unwrap();
                    console.log("✅ completeSession result:", completeRes);

                    if (completeRes.status) {
                        setShowSessionCompleted(true);
                        setTimeout(() => setShowSessionCompleted(false), 4000);
                        setChat((c) => [
                            ...c,
                            {
                                from: "ai",
                                text:
                                    "✅ Session marked completed successfully!\nYou can still continue chat if you want.",
                            },
                        ]);
                    } else {
                        console.warn("⚠️ Session completion returned false:", completeRes);
                    }
                } catch (err) {
                    console.error("❌ Error completing session:", err);
                }
            }
        } catch (err) {
            console.error("❌ AI sendPrompt error:", err);
            setChat((c) => [
                ...c,
                { from: "ai", text: "I hit a hiccup processing that. Try again?" },
            ]);
            setIsThinking(false);
        }
    };





    // --- RUN CODE ---
    const wrappedRun = useCallback(async () => {
        if (!sessionId) return { ok: false, message: "No session" };
        try {
            // running is often immediate or asynchronous via SignalR
            setIsThinking(true);
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: false,
            }).unwrap();

            if (!res.message.includes("Code is being processed")) {
                setChat((c) => [...c, { from: "ai", text: res.message }]);
                setIsThinking(false);
            } else {
                // server side processing; we'll wait for signalR ExecutionCompleted to clear
                setIsThinking(true);
            }

            return { ok: res.status ?? true, message: res.message, userSolutionId: res.userSolutionId };
        } catch {
            setIsThinking(false);
            return { ok: false, message: "Run failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    // --- SUBMIT CODE ---
    const wrappedSubmit = useCallback(async () => {
        if (!sessionId) return { ok: false, message: "No session" };

        try {
            setIsThinking(true);
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: true,
            }).unwrap();

            if (res.userSolutionId) {
                setLastSubmittedSolutionId(res.userSolutionId);
                await signalRService.joinSolutionGroup(res.userSolutionId);
            }

            if (!res.message.includes("Code is being processed")) {
                setChat((c) => [...c, { from: "ai", text: res.message }]);
                setIsThinking(false);
            } else {
                setIsThinking(true); // waiting for signalR ExecutionCompleted
            }

            return { ok: res.status ?? true, message: res.message, userSolutionId: res.userSolutionId };
        } catch {
            setIsThinking(false);
            return { ok: false, message: "Submit failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    // --- SIGNALR: EXECUTION COMPLETED ---
    useEffect(() => {
        if (!signalRConnected) return;

        const unsubscribe = signalRService.onExecutionCompleted((payload: ExecutionCompletedPayload) => {
            console.log("ExecutionCompleted:", payload);

            // clear thinking (we got a result)
            setIsThinking(false);

            if (payload.status?.toLowerCase() === "accepted") {
                // ✅ Trigger UI success + chat messages
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3500);

                const randomUserMsg = USER_SUCCESS_MESSAGES[Math.floor(Math.random() * USER_SUCCESS_MESSAGES.length)];
                const randomAiMsg = AI_FOLLOWUP_MESSAGES[Math.floor(Math.random() * AI_FOLLOWUP_MESSAGES.length)];

                setChat((c) => [...c, { from: "user", text: randomUserMsg }]);
                setTimeout(() => {
                    setChat((c) => [...c, { from: "ai", text: randomAiMsg }]);
                }, 800);
            } else {
                // show result text
                const statusText = payload.message || `Result: ${payload.status || "unknown"}`;
                setChat((c) => [...c, { from: "ai", text: statusText }]);
            }
        });

        return unsubscribe;
    }, [signalRConnected]);

    return {
        sessionId,
        chat,
        setChat,
        userInput,
        setUserInput,
        handleSend,
        wrappedRun,
        wrappedSubmit,
        signalRConnected,
        editorLocked,
        setEditorLocked,
        showSuccess,
        showSessionCompleted,
        isThinking, // <-- expose this so the RightPanel can show a top-level indicator
    };
}