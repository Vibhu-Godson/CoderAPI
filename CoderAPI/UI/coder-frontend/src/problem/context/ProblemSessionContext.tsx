import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import {
    signalRService,
    ExecutionCompletedPayload,
} from "../../Service/signalRService";
import {
    useNewSessionMutation,
    useSendPromptMutation,
    useRunOrSubmitSolutionMutation,
    useCompleteSessionMutation,
} from "../problemApi";

type ChatMsg = {
    from: "ai" | "user";
    text: string;
    meta?: string[];
};

type SessionContextType = {
    sessionId: number | null;
    chat: ChatMsg[];
    userInput: string;
    setUserInput: (v: string) => void;

    handleSend: (
        msg: string,
        includeCode: boolean,
        includeBoard: boolean,
        codeContent?: string,
        boardData?: string
    ) => void;

    wrappedRun: () => Promise<{
        ok: boolean;
        message?: string;
        userSolutionId?: number;
    }>;

    wrappedSubmit: () => Promise<{
        ok: boolean;
        message?: string;
        userSolutionId?: number;
    }>;

    signalRConnected: boolean;
    editorLocked: boolean;
    setEditorLocked: (v: boolean) => void;

    showSuccess: boolean;
    showSessionCompleted: boolean;
    isThinking: boolean;

    includeCode: boolean;
    setIncludeCode: (v: boolean) => void;

    includeBoard: boolean;
    setIncludeBoard: (v: boolean) => void;

    rightCollapsed: boolean;
    setRightCollapsed: (v: boolean) => void;

    setBoardRef: (r: any) => void;
    setCodeRef: (fn: () => string) => void;

    tlEditorRef: any;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const useProblemSessionContext = () =>
    useContext(SessionContext)!;

export function ProblemSessionProvider({
    children,
    problemId,
    problem,
    isSuccess,
    isPremiumUser,
}: {
    children: ReactNode;
    problemId: number;
    problem: any;
    isSuccess: boolean;
    isPremiumUser: boolean;
}) {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [chat, setChat] = useState<ChatMsg[]>([]);
    const [userInput, setUserInput] = useState("");
    const [signalRConnected, setSignalRConnected] = useState(false);
    const [editorLocked, setEditorLocked] = useState(true);

    const [lastSubmittedSolutionId, setLastSubmittedSolutionId] =
        useState<number | null>(null);

    const [showSuccess, setShowSuccess] = useState(false);
    const [showSessionCompleted, setShowSessionCompleted] =
        useState(false);

    const [isThinking, setIsThinking] = useState(false);

    const [includeCode, setIncludeCode] = useState(true);
    const [includeBoard, setIncludeBoard] = useState(false);

    const [rightCollapsed, setRightCollapsed] = useState(false);

    const [tlEditorRef, setBoardRef] = useState<any>(null);
    const [codeGetter, setCodeRef] = useState<() => string>(() => "");

    const [startSession] = useNewSessionMutation();
    const [sendPrompt] = useSendPromptMutation();
    const [runOrSubmit] = useRunOrSubmitSolutionMutation();
    const [completeSession] = useCompleteSessionMutation();

    const AI_START = [
        "What is your initial approach to solve this problem?",
        "Before writing code, can you outline your strategy?",
        "How do you plan to tackle the core logic of this problem?",
        "Let's start with an explanation. What's your algorithm idea?",
    ];

    const USER_SUCCESS = [
        "I’ve submitted my final solution, and all testcases passed 🎯",
        "Looks like my code’s working perfectly — ready for review!",
    ];

    const AI_FOLLOWUP = [
        "Nice work! Could you walk me through your code logic step by step?",
        "That’s great! Let's ensure clarity — can you explain how your solution works?",
    ];

    useEffect(() => {
        if (!isSuccess || !problem?.problemId || sessionId) return;
        if (problem.isLocked && !isPremiumUser) return;

        (async () => {
            try {
                const res = await startSession(problem.problemId).unwrap();
                if (res.status) {
                    setSessionId(res.userProblemSessionId);

                    const m =
                        AI_START[Math.floor(Math.random() * AI_START.length)];

                    setChat([{ from: "ai", text: m }]);

                    await signalRService.connect();
                    setSignalRConnected(signalRService.isConnected());
                    await signalRService.joinSolutionGroup(
                        res.userProblemSessionId
                    );
                }
            } catch { }
        })();
    }, [isSuccess, problem, sessionId, isPremiumUser]);

    useEffect(() => {
        return () => {
            (async () => {
                try {
                    await signalRService.disconnect();
                } catch { }
            })();
        };
    }, []);

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
                userSolutionId:
                    lastSubmittedSolutionId ?? undefined,
                isAfterSubmit: !!lastSubmittedSolutionId,
                includeCode,
                includeBoard,
                codeContent,
                boardData,
            }).unwrap();

            setChat((c) => [...c, { from: "ai", text: res.message }]);
            setIsThinking(false);

            if (res.accuracy && res.accuracy > 0.5)
                setEditorLocked(false);

            if (
                res.accuracy &&
                res.accuracy >= 0.8 &&
                lastSubmittedSolutionId
            ) {
                try {
                    const r = await completeSession({
                        userSessionId: sessionId,
                    }).unwrap();

                    if (r.status) {
                        setShowSessionCompleted(true);
                        setTimeout(
                            () => setShowSessionCompleted(false),
                            4000
                        );

                        setChat((c) => [
                            ...c,
                            { from: "ai", text: "Session completed successfully." },
                        ]);
                    }
                } catch { }
            }
        } catch {
            setChat((c) => [
                ...c,
                {
                    from: "ai",
                    text: "I hit a hiccup processing that.",
                },
            ]);
            setIsThinking(false);
        }
    };

    const wrappedRun = useCallback(async () => {
        if (!sessionId) return { ok: false, message: "No session" };

        try {
            setIsThinking(true);

            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code: codeGetter(),
                language: "",
                isSubmit: false,
            }).unwrap();

            if (!res.message.includes("Code is being processed")) {
                setChat((c) => [...c, { from: "ai", text: res.message }]);
                setIsThinking(false);
            }

            return {
                ok: true,
                message: res.message,
                userSolutionId: res.userSolutionId,
            };
        } catch {
            setIsThinking(false);
            return { ok: false, message: "Run failed" };
        }
    }, [sessionId, problemId, codeGetter]);

    const wrappedSubmit = useCallback(async () => {
        if (!sessionId) return { ok: false, message: "No session" };

        try {
            setIsThinking(true);

            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code: codeGetter(),
                language: "",
                isSubmit: true,
            }).unwrap();

            if (res.userSolutionId) {
                setLastSubmittedSolutionId(res.userSolutionId);
                await signalRService.joinSolutionGroup(
                    res.userSolutionId
                );
            }

            if (!res.message.includes("Code is being processed")) {
                setChat((c) => [...c, { from: "ai", text: res.message }]);
                setIsThinking(false);
            }

            return {
                ok: true,
                message: res.message,
                userSolutionId: res.userSolutionId,
            };
        } catch {
            setIsThinking(false);
            return { ok: false, message: "Submit failed" };
        }
    }, [sessionId, problemId, codeGetter]);

    useEffect(() => {
        if (!signalRConnected) return;

        const unsub = signalRService.onExecutionCompleted(
            (p: ExecutionCompletedPayload) => {
                setIsThinking(false);

                if (p.status?.toLowerCase() === "accepted") {
                    setShowSuccess(true);
                    setTimeout(
                        () => setShowSuccess(false),
                        3500
                    );

                    const a =
                        USER_SUCCESS[
                        Math.floor(
                            Math.random() * USER_SUCCESS.length
                        )
                        ];

                    const b =
                        AI_FOLLOWUP[
                        Math.floor(
                            Math.random() * AI_FOLLOWUP.length
                        )
                        ];

                    setChat((c) => [...c, { from: "user", text: a }]);

                    setTimeout(() => {
                        setChat((c) => [...c, { from: "ai", text: b }]);
                    }, 600);
                } else {
                    setChat((c) => [
                        ...c,
                        {
                            from: "ai",
                            text: p.message || "Execution completed.",
                        },
                    ]);
                }
            }
        );

        return unsub;
    }, [signalRConnected]);

    return (
        <SessionContext.Provider
            value={{
                sessionId,
                chat,
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
                isThinking,

                includeCode,
                setIncludeCode,
                includeBoard,
                setIncludeBoard,

                rightCollapsed,
                setRightCollapsed,

                setBoardRef,
                setCodeRef,
                tlEditorRef,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}
