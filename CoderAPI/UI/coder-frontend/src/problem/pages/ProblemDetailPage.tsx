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
import { Tldraw, createTLStore, defaultShapeUtils, TLStore } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

type DecodedToken = {
    subscription?: string;
    subscriptionExpiry?: string;
    exp?: number;
    [key: string]: any;
};

const token = localStorage.getItem("authToken");
let isPremiumUser = false;
if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    const sub = decoded.subscription;
    const expDate = new Date(decoded.subscriptionExpiry || "");
    if (sub === "Premium" && expDate > new Date()) isPremiumUser = true;
}

const AI_START_MESSAGES = [
    "What is your initial approach to solve this problem?",
    "Before writing code, can you outline your strategy?",
    "How do you plan to tackle the core logic of this problem?",
    "Let's start with an explanation. What's your algorithm idea?",
];

export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const problemId = Number(id);

    const { data: problem, error, isError, isLoading, isSuccess } = useGetProblemByIdQuery(problemId);
    const [startSession] = useNewSessionMutation();
    const [completeSession] = useCompleteSessionMutation();
    const [sendPrompt] = useSendPromptMutation();
    const [runOrSubmit] = useRunOrSubmitSolutionMutation();

    const [sessionId, setSessionId] = useState<number | null>(null);
    const [chat, setChat] = useState<{ from: "ai" | "user"; text: string; meta?: string[] }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [code, setCode] = useState("// Your solution here");
    const [editorLocked, setEditorLocked] = useState(true);
    const [language, setLanguage] = useState("c");
    const [signalRConnected, setSignalRConnected] = useState(false);

    const [activeLeftTab, setActiveLeftTab] = useState<"description" | "solutions" | "sessions">("description");
    const [activeMiddleTab, setActiveMiddleTab] = useState<"code" | "board">("code");

    const [includeCode, setIncludeCode] = useState(true);
    const [includeBoard, setIncludeBoard] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lastSubmittedSolutionId, setLastSubmittedSolutionId] = useState<number | null>(null);

    const [store] = useState<TLStore>(() => createTLStore({ shapeUtils: defaultShapeUtils }));
    const tlEditorRef = useRef<any>(null);
    const liveBoardStoreRef = useRef<any>(null);

    // === Lock handling ===
    useEffect(() => {
        if (isError && "status" in (error as any) && (error as any).status === 403) {
            setIsLocked(true);
        }
    }, [isError, error]);

    // === Start a session when problem loads ===
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
    }, [isSuccess, problem, sessionId, startSession]);

    useEffect(() => {
        return () => {
            (async () => {
                try {
                    await signalRService.disconnect();
                } catch { }
            })();
        };
    }, []);

    // === AI request explanation listener ===
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

    // === Send chat ===
    const handleSend = async () => {
        if (!sessionId || !userInput.trim()) return;

        const meta: string[] = [];
        const context: { code?: string; board?: string } = {};

        if (includeCode) {
            context.code = code;
            meta.push("Code");
        }

        if (includeBoard) {
            try {
                const editor = tlEditorRef.current;
                let boardJson: any = null;

                if (editor?.store?.serialize) {
                    boardJson = editor.store.serialize();
                } else if (editor?.getSnapshot) {
                    boardJson = editor.getSnapshot();
                } else if (liveBoardStoreRef.current?.serialize) {
                    boardJson = liveBoardStoreRef.current.serialize();
                }

                if (boardJson) {
                    context.board = JSON.stringify(boardJson);
                    meta.push("Whiteboard");
                }
            } catch (err) {
                console.error("Error while serializing whiteboard:", err);
            }
        }

        const msg = userInput;
        setChat((c) => [...c, { from: "user", text: msg, meta }]);
        setUserInput("");

        try {
            const res = await sendPrompt({
                problemId,
                userProblemSessionId: sessionId,
                userText: msg,
                userSolutionId: lastSubmittedSolutionId ?? undefined,
                isAfterSubmit: !!lastSubmittedSolutionId,
            }).unwrap();

            setChat((c) => [...c, { from: "ai", text: res.message }]);
        } catch (err) {
            console.error("AI sendPrompt error:", err);
            setChat((c) => [...c, { from: "ai", text: "I hit a hiccup processing that. Try again?" }]);
        }
    };

    // === Run / Submit ===
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
            setChat((c) => [...c, { from: "ai", text: res.message }]);
            return { ok: res.status ?? true, message: res.message, userSolutionId: res.userSolutionId };
        } catch {
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
            setChat((c) => [...c, { from: "ai", text: res.message }]);
            return { ok: res.status ?? true, message: res.message, userSolutionId: res.userSolutionId };
        } catch {
            return { ok: false, message: "Submit failed" };
        }
    }, [sessionId, code, language, problemId, runOrSubmit]);

    // === Debounced autosave placeholder ===
    const debouncedSave = useRef<ReturnType<typeof setTimeout> | null>(null);
    const saveBoardIfNeeded = useCallback(() => {
        if (!sessionId) return;
        const snap = liveBoardStoreRef.current?.getSnapshot?.();
        const content = snap ? JSON.stringify(snap) : "{}";
        if (debouncedSave.current) clearTimeout(debouncedSave.current);
        debouncedSave.current = setTimeout(() => {
            console.log("🧭 Auto-saving board skipped (API removed)", { sessionId, problemId, length: content.length });
        }, 700);
    }, [problemId, sessionId]);

    useEffect(() => {
        const unsub = store.listen(() => {
            if (activeMiddleTab === "board") saveBoardIfNeeded();
        }, { scope: "document" });
        return () => { unsub(); };
    }, [store, activeMiddleTab, saveBoardIfNeeded]);

    // === Loading / Lock states ===
    if (isLoading)
        return (
            <div className="flex h-screen items-center justify-center text-zinc-500">
                <div className="mr-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />
                Loading problem…
            </div>
        );

    if (isLocked)
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-3">
                <div className="text-5xl">🔒</div>
                <h3 className="text-zinc-700 dark:text-zinc-200">This problem is locked</h3>
                <p className="max-w-md text-center text-zinc-500 dark:text-zinc-400">
                    This problem is available only to premium members.
                </p>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                    Upgrade to Premium
                </button>
            </div>
        );

    if (isError)
        return (
            <div className="flex h-screen items-center justify-center text-red-600">
                Something went wrong while loading the problem.
            </div>
        );

    return (
        <div className="fixed inset-0 flex flex-col bg-zinc-50 p-3 dark:bg-zinc-900">
            <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[28%_1fr_32%]">
                {/* LEFT PANEL */}
                <div className="flex min-h-0 flex-col rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-2 flex gap-2">
                        <TabButton active={activeLeftTab === "description"} onClick={() => setActiveLeftTab("description")}>
                            Description
                        </TabButton>
                        <TabButton active={activeLeftTab === "solutions"} onClick={() => setActiveLeftTab("solutions")}>
                            My Solutions
                        </TabButton>
                        <TabButton active={activeLeftTab === "sessions"} onClick={() => setActiveLeftTab("sessions")}>
                            My Sessions
                        </TabButton>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
                        {activeLeftTab === "description" && <ProblemDescription problem={problem} />}
                        {activeLeftTab === "solutions" && (
                            <div className="text-sm text-zinc-500">/* hook up MySolutions here */</div>
                        )}
                        {activeLeftTab === "sessions" && (
                            <div className="text-sm text-zinc-500">/* hook up MySessions here */</div>
                        )}
                    </div>
                </div>

                {/* MIDDLE PANEL */}
                <div className="flex min-h-0 flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center gap-2 border-b border-zinc-200 p-2 dark:border-zinc-800">
                        <TabButton active={activeMiddleTab === "code"} onClick={() => setActiveMiddleTab("code")}>
                            Code Editor
                        </TabButton>
                        <TabButton active={activeMiddleTab === "board"} onClick={() => setActiveMiddleTab("board")}>
                            Whiteboard
                        </TabButton>

                        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${signalRConnected
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                                    }`}
                            >
                                <span
                                    className={`h-2 w-2 rounded-full ${signalRConnected ? "bg-emerald-500" : "bg-zinc-400"
                                        }`}
                                />
                                Live
                            </span>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-auto">
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
                            <div className="h-full w-full overflow-hidden">
                                <Tldraw
                                    store={store}
                                    onMount={(editor) => {
                                        tlEditorRef.current = editor;
                                        liveBoardStoreRef.current = editor.store;
                                        console.log("✅ Tldraw editor mounted");
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL (CHAT) */}
                <div className="flex min-h-0 flex-col rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <AIChatPanel
                        chat={chat}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        onSend={handleSend}
                        includeCode={includeCode}
                        setIncludeCode={setIncludeCode}
                        includeBoard={includeBoard}
                        setIncludeBoard={setIncludeBoard}
                    />
                </div>
            </div>
        </div>
    );
}

// ---- Small Reusable Tab Button ----
function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-md px-3 py-1.5 text-sm transition ${active
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
        >
            {children}
        </button>
    );
}
