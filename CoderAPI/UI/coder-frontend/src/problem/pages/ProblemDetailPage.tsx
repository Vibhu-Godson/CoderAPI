import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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
import LoadingSpinner from "../components/LoadingSpinner";
import MySolutions from "../components/MySolutions";
import MySessions from "../components/MySessions";

import { Tldraw, createTLStore, defaultShapeUtils, TLStore } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

// ---------------- TOKEN & ACCESS CONTROL -----------------
interface DecodedToken {
    subscription?: string;
    subscriptionExpiry?: string;
    exp?: number;
    [key: string]: any;
}
const token = localStorage.getItem("authToken");
let isPremiumUser = false;

if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    const sub = decoded.subscription;
    const expDate = new Date(decoded.subscriptionExpiry || "");
    if (sub === "Premium" && expDate > new Date()) {
        isPremiumUser = true;
    }
}
// ----------------------------------------------------------

const debounce = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const AI_START_MESSAGES = [
    "What is your initial approach to solve this problem?",
    "Before writing code, can you outline your strategy?",
    "How do you plan to tackle the core logic of this problem?",
    "Let's start with an explanation. What's your algorithm idea?",
];

export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const problemId = Number(id);

    const {
        data: problem,
        error,
        isError,
        isLoading,
        isSuccess,
    } = useGetProblemByIdQuery(problemId);

    const [isLocked, setIsLocked] = useState(false);
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
    const [language, setLanguage] = useState("C");
    const [signalRConnected, setSignalRConnected] = useState(false);
    const [activeLeftTab, setActiveLeftTab] = useState<"description" | "solutions" | "sessions">("description");
    const [activeMiddleTab, setActiveMiddleTab] = useState<"code" | "board">("code");

    const [store] = useState<TLStore>(() => createTLStore({ shapeUtils: defaultShapeUtils }));

    const debouncedOnDrag = useRef(debounce(() => { }, 50)).current;

    // ---- Handle problem lock ----
    useEffect(() => {
        if (isError && "status" in error && error.status === 403) {
            const errMsg = (error as any)?.data?.message || "Problem is locked.";
            console.warn("Locked Problem:", errMsg);
            setIsLocked(true);
        }
    }, [isError, error]);

    // ---- Create session after loading problem ----
    useEffect(() => {
        if (isSuccess && problem?.problemId && !sessionId && (!problem.isLocked || (problem.isLocked && isPremiumUser))) {
            (async () => {
                try {
                    const res = await startSession(problem.problemId).unwrap();
                    if (res.status) {
                        setSessionId(res.userProblemSessionId);
                        console.log("Session started:", res.userProblemSessionId);

                        const randomMessage = AI_START_MESSAGES[Math.floor(Math.random() * AI_START_MESSAGES.length)];
                        setChat([{ from: "ai", text: randomMessage }]);

                        await signalRService.connect();
                        setSignalRConnected(signalRService.isConnected());
                        await signalRService.joinSolutionGroup(res.userProblemSessionId);
                        console.info("Joined session group", res.userProblemSessionId);
                    } else {
                        console.warn("Failed to create session:", res.message);
                    }
                } catch (err) {
                    console.error("Error creating session:", err);
                }
            })();
        }
    }, [isSuccess, problem, startSession, sessionId]);

    useEffect(() => {
        return () => {
            (async () => {
                try {
                    await signalRService.disconnect();
                } catch { }
            })();
        };
    }, []);

    // ---- AI Request Explanation Event ----
    useEffect(() => {
        const handler = (e: any) => {
            const { userSolutionId } = e.detail || {};
            setChat((c) => [
                ...c,
                { from: "user", text: "code submitted" },
                {
                    from: "ai",
                    text: "Great job! Can you now explain your solution step by step, so I can verify your reasoning?",
                },
            ]);
            if (userSolutionId) setLastSubmittedSolutionId(userSolutionId);
        };

        window.addEventListener("ai-request-explanation", handler);
        return () => window.removeEventListener("ai-request-explanation", handler);
    }, []);

    // ---- Chat send ----
    const handleSend = async () => {
        if (!sessionId || !userInput.trim()) return;
        const userTextToSend = userInput;
        setChat((c) => [...c, { from: "user", text: userTextToSend }]);
        setUserInput("");

        try {
            const res = await sendPrompt({
                problemId,
                userProblemSessionId: sessionId,
                userText: userTextToSend,
                userSolutionId: lastSubmittedSolutionId ?? undefined,
                isAfterSubmit: !!lastSubmittedSolutionId,
            }).unwrap();

            setChat((c) => [...c, { from: "ai", text: res.message }]);

            if (res.accuracy >= 0.5) setEditorLocked(false);
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

    // ---- Run & Submit Wrappers ----
    const wrappedRun = useCallback(async () => {
        if (!sessionId) return { ok: false, message: "No session" };
        try {
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: false,
            }).unwrap();

            alert(res.message);
            return { ok: res.status ?? true, message: res.message, userSolutionId: res.userSolutionId };
        } catch (err) {
            console.error("Error running code:", err);
            return { ok: false, message: "Run failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    const wrappedSubmit = useCallback(async () => {
        if (!sessionId) return { ok: false, message: "No session" };
        try {
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: true,
            }).unwrap();

            alert(res.message);
            return { ok: res.status ?? true, message: res.message, userSolutionId: res.userSolutionId };
        } catch (err) {
            console.error("Error submitting code:", err);
            return { ok: false, message: "Submit failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    // ---- UI RENDER ----
    if (isLoading) return <LoadingSpinner />;

    if (isLocked) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "80vh" }}>
                <i className="bi bi-lock-fill display-1 text-secondary mb-3"></i>
                <h3 className="text-muted">This problem is locked</h3>
                <p className="text-center text-secondary" style={{ maxWidth: "500px" }}>
                    This problem is available only to premium members.
                </p>
                <button className="btn btn-primary mt-3">Upgrade to Premium</button>
            </div>
        );
    }

    if (isError) return <div>Something went wrong while loading the problem.</div>;

    return (
        <div className="container-fluid mt-3">
            <div className="grid grid-cols-[30%_40%_30%] h-[85vh] border rounded shadow-sm">
                {/* LEFT PANEL */}
                <div className="p-3 bg-light overflow-auto">
                    <div className="d-flex border-bottom mb-2">
                        <button
                            className={`btn flex-grow-1 ${activeLeftTab === "description" ? "btn-primary" : "btn-light"}`}
                            onClick={() => setActiveLeftTab("description")}
                        >
                            Description
                        </button>
                        <button
                            className={`btn flex-grow-1 ${activeLeftTab === "solutions" ? "btn-primary" : "btn-light"}`}
                            onClick={() => setActiveLeftTab("solutions")}
                        >
                            My Solutions
                        </button>
                        <button
                            className={`btn flex-grow-1 ${activeLeftTab === "sessions" ? "btn-primary" : "btn-light"}`}
                            onClick={() => setActiveLeftTab("sessions")}
                        >
                            My Sessions
                        </button>
                    </div>

                    {activeLeftTab === "description" && <ProblemDescription problem={problem} />}
                    {activeLeftTab === "solutions" && <MySolutions />}
                    {activeLeftTab === "sessions" && <MySessions />}
                </div>

                {/* MIDDLE PANEL */}
                <div className="flex flex-col flex-grow-1 border-end">
                    <div className="d-flex bg-light p-2">
                        <button
                            className={`btn me-2 ${activeMiddleTab === "code" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setActiveMiddleTab("code")}
                        >
                            Code Editor
                        </button>
                        <button
                            className={`btn ${activeMiddleTab === "board" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setActiveMiddleTab("board")}
                        >
                            Whiteboard
                        </button>
                    </div>

                    {activeMiddleTab === "code" && (
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
                    )}

                    {activeMiddleTab === "board" && (
                        <div style={{ width: "100%", height: "100%" }}>
                            <Tldraw store={store} />
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <div className="flex flex-col p-3 bg-light">
                    <AIChatPanel
                        chat={chat}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        onSend={handleSend}
                    />
                </div>
            </div>
        </div>
    );
}
