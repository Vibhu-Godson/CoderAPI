import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Split from "react-split";
import {
    useGetProblemByIdQuery,
    useNewSessionMutation,
    useSendPromptMutation,
    useRunOrSubmitSolutionMutation,
    useCompleteSessionMutation,
} from "../problemApi";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import AIChatPanel from "../components/AIChatPanel";
import { signalRService } from "../../Service/signalRService";

// --- DEBOUNCE UTILITY FUNCTION (Retained for Split) ---
const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
// ------------------------------------------

// Random starting messages for the AI chat
const AI_START_MESSAGES = [
    "What is your initial approach to solve this problem?",
    "Before writing code, can you outline your strategy?",
    "How do you plan to tackle the core logic of this problem?",
    "Let's start with an explanation. What's your algorithm idea?",
];

export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const problemId = Number(id);

    // fetch problem first
    const { data: problem, isSuccess } = useGetProblemByIdQuery(problemId);

    const [startSession] = useNewSessionMutation();
    const [completeSession] = useCompleteSessionMutation();
    const [sendPrompt] = useSendPromptMutation();
    const [runOrSubmit] = useRunOrSubmitSolutionMutation();
    const [lastSubmittedSolutionId, setLastSubmittedSolutionId] = useState<number | null>(null);

    const [sessionId, setSessionId] = useState<number | null>(null);
    const [chat, setChat] = useState<{ from: "ai" | "user"; text: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [code, setCode] = useState("// Your solution here");
    const [editorLocked, setEditorLocked] = useState(true);
    const [language, setLanguage] = useState("C"); // default
    const [signalRConnected, setSignalRConnected] = useState(false);

    // --- Debounced Drag Handler (Retained) ---
    const debouncedOnDrag = useRef(debounce(() => {
        // Empty as the Monaco fix handles the layout
    }, 50)).current;
    // ------------------------------------------


    // create session and add initial AI message once after problem is successfully loaded
    useEffect(() => {
        if (isSuccess && problem?.problemId && !sessionId) {
            (async () => {
                try {
                    const res = await startSession(problem.problemId).unwrap();
                    if (res.status) {
                        setSessionId(res.userProblemSessionId);
                        console.log("Session started:", res.userProblemSessionId);

                        // ADD INITIAL AI MESSAGE
                        const randomMessage = AI_START_MESSAGES[Math.floor(Math.random() * AI_START_MESSAGES.length)];
                        setChat([{ from: "ai", text: randomMessage }]);

                        // connect SignalR and join session group
                        try {
                            await signalRService.connect();
                            setSignalRConnected(signalRService.isConnected());
                            await signalRService.joinSolutionGroup(res.userProblemSessionId);
                            console.info("Joined session group", res.userProblemSessionId);
                        } catch (err) {
                            console.error("SignalR connect/join failed:", err);
                            setSignalRConnected(false);
                        }
                    } else {
                        console.warn("Failed to create session:", res.message);
                    }
                } catch (err) {
                    console.error("Error creating session:", err);
                }
            })();
        }
    }, [isSuccess, problem, startSession, sessionId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            (async () => {
                try {
                    await signalRService.disconnect();
                } catch (err) {
                    // ignore
                }
            })();
        };
    }, []);

    useEffect(() => {
        const handler = (e: any) => {
            const { userSolutionId } = e.detail || {};
            setChat(c => [
                ...c,
                {
                    from: "user",
                    text: "code submitted"
                },
                {
                    from: "ai",
                    text: "Great job! Can you now explain your solution step by step, so I can verify your reasoning?"
                }
            ]);
            if (userSolutionId) {
                setLastSubmittedSolutionId(userSolutionId);
            }
        };

        window.addEventListener("ai-request-explanation", handler);
        return () => window.removeEventListener("ai-request-explanation", handler);
    }, []);

    const handleSend = async () => {
        if (!sessionId || !userInput.trim()) return;

        // add user message first
        const userTextToSend = userInput; // Capture the current input
        setChat((c) => [...c, { from: "user", text: userTextToSend }]);
        setUserInput(""); 

        try {
            const res = await sendPrompt({
                problemId,
                userProblemSessionId: sessionId,
                userText: userTextToSend,
                userSolutionId: lastSubmittedSolutionId ?? undefined,
                isAfterSubmit: !!lastSubmittedSolutionId
            }).unwrap();

            // add AI response
            setChat((c) => [
                ...c,
                { from: "ai", text: res.message },
            ]);

            // unlock editor if AI says accuracy >= 50
            if (res.accuracy >= 0.50) {
                setEditorLocked(false);
            }
            if (res.accuracy >= 0.82 && !!lastSubmittedSolutionId) {
                try {
                    await completeSession({ userSessionId: sessionId }).unwrap();
                    alert("✅ Session marked as completed");
                } catch (err) {
                    console.error("❌ Failed to complete session", err);
                }
            }
        } catch (err) {
            console.error("Error sending prompt:", err);
        }
    };

    // wrapper that the CodeEditorPanel expects: returns { ok, message, userSolutionId? }
    const wrappedRun = useCallback(async (): Promise<{ ok: boolean; message?: string; userSolutionId?: number }> => {
        if (!sessionId) {
            return { ok: false, message: "No session" };
        }
        try {
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: false,
            }).unwrap();

            const userSolutionId = res.userSolutionId ?? undefined;
            alert(res.message);

            return { ok: res.status ?? true, message: res.message, userSolutionId };
        } catch (err) {
            console.error("Error running code:", err);
            return { ok: false, message: "Run failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    const wrappedSubmit = useCallback(async (): Promise<{ ok: boolean; message?: string; userSolutionId?: number }> => {
        if (!sessionId) {
            return { ok: false, message: "No session" };
        }
        try {
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: true,
            }).unwrap();

            const userSolutionId = res.userSolutionId ?? undefined;
            alert(res.message);

            return { ok: res.status ?? true, message: res.message, userSolutionId };
        } catch (err) {
            console.error("Error submitting code:", err);
            return { ok: false, message: "Submit failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    return (
        <div className="container-fluid mt-3">
            <Split
                className="d-flex border rounded shadow-sm"
                sizes={[30, 40, 30]}
                minSize={200}
                expandToMin={false}
                gutterSize={6}
                gutterAlign="center"
                style={{ height: "85vh" }}
                onDrag={debouncedOnDrag}
            >
                <div className="p-3 bg-light overflow-auto">
                    <ProblemDescription problem={problem} />
                </div>

                <div className="d-flex flex-column">
                    <CodeEditorPanel
                        code={code}
                        setCode={setCode}
                        onRun={wrappedRun}
                        onSubmit={wrappedSubmit}
                        editorLocked={editorLocked}
                        setEditorLocked={setEditorLocked}
                        language={language}
                        setLanguage={setLanguage}
                        signalRConnected={signalRConnected}
                        sessionId={sessionId}
                        problemId={problemId}
                    />
                </div>

                <div className="d-flex flex-column p-3 bg-light">
                    <AIChatPanel
                        chat={chat}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        onSend={handleSend}
                    />
                </div>
            </Split>
        </div>
    );
}
