// Replace file with cleaned implementation (rebuild below)
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useMemo, useRef } from "react";
import { useProblemData } from "../hooks/useProblemData";
import { useProblemSession } from "../hooks/useProblemSession";
import SuccessNotification from "../components/SuccessNotification";
import MiniHeader from "./ProblemDetailPage2.0/MiniHeader";
import Sidebar from "./ProblemDetailPage2.0/Sidebar";
import CodeEditorPanel from "../components/CodeEditorPanel";
import AIChatPanel from "../components/AIChatPanel";

type DecodedToken = {
    subscription?: string;
    subscriptionExpiry?: string;
};

interface TestCaseResult {
    userTestCaseResultId: number;
    testCaseId: number;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    status: string;
    executionTime?: number;
    memoryUsed?: number;
    stderr?: string;
    compileOutput?: string;
}

interface RunSubmitResult {
    ok: boolean;
    message?: string;
    userSolutionId?: number;
    testCaseResults?: TestCaseResult[];
}

export default function ProblemDetailPage2_0() {
    const { idSlug } = useParams<{ idSlug: string }>();
    const navigate = useNavigate();
    const problemId = Number(idSlug?.split("-")[0]);

    const token = localStorage.getItem("authToken");
    let isPremiumUser = false;
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token as string);
            const sub = decoded.subscription;
            const expDate = new Date(decoded.subscriptionExpiry || "");
            if (sub === "Premium" && expDate > new Date()) isPremiumUser = true;
        } catch (e) {
            // ignore
        }
    }

    // Fetch problem data
    const {
        problem,
        languagesData,
        selectedProblemDetailId,
        setSelectedProblemDetailId,
        language,
        setLanguage,
        code,
        setCode,
        isLocked,
        isLoading,
        isSuccess,
    } = useProblemData(problemId);

    // Session management
    const {
        sessionId,
        chat,
        userInput,
        setUserInput,
        handleSend: handleSendChat,
        wrappedRun: originalWrappedRun,
        wrappedSubmit: originalWrappedSubmit,
        signalRConnected,
        editorLocked,
        setEditorLocked,
        showSuccess,
        showSessionCompleted,
        isThinking,
    } = useProblemSession(problemId, problem, isSuccess, isPremiumUser, code, language);

    // Memoize wrapped functions
    const wrappedRun = useMemo(() => {
        return originalWrappedRun as () => Promise<RunSubmitResult>;
    }, [originalWrappedRun]);

    const wrappedSubmit = useMemo(() => {
        return originalWrappedSubmit as () => Promise<RunSubmitResult>;
    }, [originalWrappedSubmit]);

    // UI State
    const [activeTab, setActiveTab] = useState<"description" | "solutions" | "sessions">("description");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [includeCode, setIncludeCode] = useState(true);
    const [includeBoard, setIncludeBoard] = useState(false);
    const tlEditorRef = useRef<any>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle language change - update problem detail ID to fetch code for new language
    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage);
        const found = languagesData?.items.find((x: any) => x.value === newLanguage);
        if (found) {
            setSelectedProblemDetailId(found.problemDetailId);
        }
    };

    // Wrapper for chat send with code and whiteboard data
    const handleSend = (userMessage: string, withCode: boolean, withBoard: boolean, codeContent?: string, boardData?: string) => {
        handleSendChat(userMessage, withCode, withBoard, codeContent || code, boardData);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-zinc-500">
                <div className="mr-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />
                Loading problem setup…
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-3">
                <div className="text-5xl">🔒</div>
                <h3 className="text-zinc-700 dark:text-zinc-200">This problem is locked</h3>
                <p className="max-w-md text-center text-zinc-500 dark:text-zinc-400">
                    This problem is available only to premium members.
                </p>
                <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    onClick={() => navigate("/plans")}
                >
                    Upgrade to Premium
                </button>
            </div>
        );
    }

    const handleBack = () => {
        navigate("/problems");
    };

    // Mobile: show tabs layout
    if (isMobile) {
        return (
            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                {/* Header */}
                <MiniHeader problemName={problem?.problemName} onBack={handleBack} />

                {/* Mobile Tabs */}
                <div className="flex gap-0 border-b border-slate-200 bg-white px-2 py-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("description")}
                        className={`
                            px-4 py-2 rounded-t font-medium text-sm transition whitespace-nowrap
                            ${activeTab === "description"
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }
                        `}
                    >
                        📖 Description
                    </button>
                    <button
                        onClick={() => setActiveTab("solutions")}
                        className={`
                            px-4 py-2 rounded-t font-medium text-sm transition whitespace-nowrap
                            ${activeTab === "solutions"
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }
                        `}
                    >
                        ✓ Solutions
                    </button>
                    <button
                        onClick={() => setActiveTab("sessions")}
                        className={`
                            px-4 py-2 rounded-t font-medium text-sm transition whitespace-nowrap
                            ${activeTab === "sessions"
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }
                        `}
                    >
                        💬 Sessions
                    </button>
                </div>

                {/* Mobile Content Area */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === "description" && (
                        <div className="h-full overflow-y-auto">
                            <Sidebar
                                activeTab="description"
                                setActiveTab={() => {}}
                                problem={problem}
                                isCollapsed={false}
                                setIsCollapsed={() => {}}
                                isMobile={true}
                            />
                        </div>
                    )}
                    {activeTab === "solutions" && (
                        <div className="h-full overflow-y-auto">
                            <Sidebar
                                activeTab="solutions"
                                setActiveTab={() => {}}
                                problem={problem}
                                isCollapsed={false}
                                setIsCollapsed={() => {}}
                                isMobile={true}
                            />
                        </div>
                    )}
                    {activeTab === "sessions" && (
                        <div className="h-full overflow-y-auto">
                            <Sidebar
                                activeTab="sessions"
                                setActiveTab={() => {}}
                                problem={problem}
                                isCollapsed={false}
                                setIsCollapsed={() => {}}
                                isMobile={true}
                            />
                        </div>
                    )}
                </div>

                {/* Notifications */}
                {showSuccess && (
                    <SuccessNotification
                        message="🎉 Code Submitted Successfully..!"
                        duration={3500}
                    />
                )}
                {showSessionCompleted && (
                    <SuccessNotification
                        message="✅ Session Marked Completed..!"
                        duration={4000}
                    />
                )}
            </div>
        );
    }

    // Desktop: 3-panel layout (Description/Solutions/Sessions | Code/Whiteboard | Chat)
    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden relative">
            {/* Header */}
            <MiniHeader problemName={problem?.problemName} onBack={handleBack} />

            {/* Expand Button - shown when sidebar is collapsed */}
            {sidebarCollapsed && (
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="absolute left-2 top-20 z-40 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg"
                    title="Show sidebar"
                >
                    ▶
                </button>
            )}

            {/* Main 3-Panel Layout */}
            <div className="flex flex-1 overflow-hidden gap-2 px-2 pb-2 relative">
                {/* LEFT PANEL: Description / Solutions / Sessions - collapses to 0 width */}
                <div className={`${sidebarCollapsed ? "w-0" : "w-1/4"} min-w-0 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden shadow-sm transition-all duration-300`}>
                    {!sidebarCollapsed && (
                        <Sidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            problem={problem}
                            isCollapsed={sidebarCollapsed}
                            setIsCollapsed={setSidebarCollapsed}
                            isMobile={isMobile}
                        />
                    )}
                </div>

                {/* MIDDLE PANEL: Code Editor */}
                <div className={`${sidebarCollapsed ? "flex-1" : "w-1/2"} min-w-0 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden shadow-sm transition-all duration-300`}>
                    <CodeEditorPanel
                        code={code}
                        setCode={setCode}
                        language={language}
                        setLanguage={handleLanguageChange}
                        languages={languagesData?.items || []}
                        onRun={wrappedRun}
                        onSubmit={wrappedSubmit}
                        editorLocked={editorLocked}
                        setEditorLocked={setEditorLocked}
                        signalRConnected={signalRConnected}
                        sessionId={sessionId}
                        problemId={problemId}
                    />
                </div>

                {/* RIGHT PANEL: AI Chat */}
                <div className={`${sidebarCollapsed ? "flex-1" : "w-1/4"} min-w-0 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden shadow-sm transition-all duration-300`}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                        <h3 className="font-semibold text-sm text-zinc-700">AI Chat</h3>
                    </div>
                    <AIChatPanel
                        chat={chat}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        onSend={handleSend}
                        includeCode={includeCode}
                        setIncludeCode={setIncludeCode}
                        includeBoard={includeBoard}
                        setIncludeBoard={setIncludeBoard}
                        isThinking={isThinking}
                        code={code}
                        tlEditorRef={tlEditorRef}
                    />
                </div>
            </div>

            {/* Notifications */}
            {showSuccess && (
                <SuccessNotification
                    message="🎉 Code Submitted Successfully..!"
                    duration={3500}
                />
            )}
            {showSessionCompleted && (
                <SuccessNotification
                    message="✅ Session Marked Completed..!"
                    duration={4000}
                />
            )}
        </div>
    );
}
