import React, { useEffect, useState, useRef, useCallback, Suspense, lazy } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import TestcaseTabs, { Testcase } from "./TestcaseTabs";
import UnlockEditorModal from "./UnlockEditorModal";

const WhiteboardEditor = lazy(() => import("./WhiteboardEditor"));

export interface BackendTestcasePayload {
    userTestCaseResultId: number;
    testCaseId: number;
    input: string;
    expectedOutput: string;
    status: string;
    stdout: string | null;
    stderr: string | null;
    compileOutput: string | null;
    executionTime: number;
    memoryUsed: number;
}

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

interface Props {
    code: string;
    setCode: (val: string) => void;
    onRun: () => Promise<{ ok: boolean; message?: string; userSolutionId?: number; testCaseResults?: TestCaseResult[] }>;
    onSubmit: () => Promise<{ ok: boolean; message?: string; userSolutionId?: number; testCaseResults?: TestCaseResult[] }>;
    editorLocked: boolean;
    setEditorLocked: (val: boolean) => void;
    language: string;
    setLanguage: (val: string) => void;
    signalRConnected: boolean;
    sessionId: number | null;
    problemId: number;
    languages: { value: string; problemDetailId: number }[];
}

export default function CodeEditorPanel({
    code,
    setCode,
    onRun,
    onSubmit,
    editorLocked,
    setEditorLocked,
    language,
    setLanguage,
    signalRConnected,
    sessionId,
    problemId,
    languages,
}: Props) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const whiteboardRef = useRef<any>(null);

    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [testcases, setTestcases] = useState<Testcase[]>([]);
    const [testcaseStates, setTestcaseStates] = useState<Record<number, any>>({});
    const [activeTab, setActiveTab] = useState<"code" | "whiteboard">("code");
    const [collapsed, setCollapsed] = useState(false);
    const [panelHeight, setPanelHeight] = useState(window.innerHeight * 0.39);
    const lastHeightRef = useRef(panelHeight);

    const clearTestcases = () => {
        setTestcases([]);
        setTestcaseStates({});
    };

    const handleRun = useCallback(async () => {
        if (!signalRConnected || editorLocked) return;
        clearTestcases();
        try {
            const res = await onRun();
            if (res && res.testCaseResults && res.testCaseResults.length > 0) {
                setCollapsed(false);
                setPanelHeight(window.innerHeight * 0.39);

                setTestcases(
                    res.testCaseResults.map((tc: any, idx: number) => ({
                        testCaseId: tc.testCaseId,
                        name: `Test ${idx + 1}`,
                    }))
                );

                const statesMap: Record<number, any> = {};
                res.testCaseResults.forEach((tc: any) => {
                    statesMap[tc.testCaseId] = {
                        userTestCaseResultId: tc.userTestCaseResultId,
                        testCaseId: tc.testCaseId,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        status: tc.status,
                        stdout: tc.actualOutput || "",
                        stderr: tc.stderr || "",
                        compileOutput: tc.compileOutput || "",
                        executionTime: tc.executionTime || 0,
                        memoryUsed: tc.memoryUsed || 0,
                    };
                });
                setTestcaseStates(statesMap);
            }
        } catch (err) {
            console.error("Run failed", err);
        }
    }, [signalRConnected, editorLocked, onRun]);

    const handleSubmit = useCallback(async () => {
        if (!signalRConnected || editorLocked) return;
        clearTestcases();
        try {
            const res = await onSubmit();
            if (res && res.testCaseResults && res.testCaseResults.length > 0) {
                setCollapsed(false);
                setPanelHeight(window.innerHeight * 0.39);

                setTestcases(
                    res.testCaseResults.map((tc: any, idx: number) => ({
                        testCaseId: tc.testCaseId,
                        name: `Test ${idx + 1}`,
                    }))
                );

                const statesMap: Record<number, any> = {};
                res.testCaseResults.forEach((tc: any) => {
                    statesMap[tc.testCaseId] = {
                        userTestCaseResultId: tc.userTestCaseResultId,
                        testCaseId: tc.testCaseId,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        status: tc.status,
                        stdout: tc.actualOutput || "",
                        stderr: tc.stderr || "",
                        compileOutput: tc.compileOutput || "",
                        executionTime: tc.executionTime || 0,
                        memoryUsed: tc.memoryUsed || 0,
                    };
                });
                setTestcaseStates(statesMap);
            }
        } catch (err) {
            console.error("Submit failed", err);
        }
    }, [signalRConnected, editorLocked, onSubmit]);

    const handleEditorDidMount: OnMount = useCallback((editor) => {
        editorRef.current = editor;
        editor.layout();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (editorRef.current) {
                editorRef.current.layout();
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "'") {
                e.preventDefault();
                handleRun();
            }
            if (e.ctrlKey && e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handleRun, handleSubmit]);

    const toggleCollapse = () => {
        if (collapsed) {
            setCollapsed(false);
            setPanelHeight(lastHeightRef.current || window.innerHeight * 0.39);
        } else {
            lastHeightRef.current = panelHeight;
            setCollapsed(true);
            setPanelHeight(50);
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full relative">
            <UnlockEditorModal
                show={showUnlockModal}
                onClose={() => setShowUnlockModal(false)}
                onUnlockAnyway={() => setEditorLocked(false)}
            />

            {/* Toolbar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70">
                <div className="flex items-center gap-2">
                    <select
                        className="rounded-md border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700 dark:text-zinc-200"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={editorLocked || activeTab !== "code"}
                    >
                        {languages.map((lang) => (
                            <option key={lang.problemDetailId} value={lang.value}>
                                {lang.value.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    {editorLocked && activeTab === "code" && (
                        <button
                            className="flex items-center gap-1 rounded-md bg-yellow-400 text-white text-sm px-3 py-1 hover:bg-yellow-500 transition"
                            onClick={() => setShowUnlockModal(true)}
                        >
                            🔒 Unlock
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRun}
                        disabled={editorLocked || !signalRConnected || activeTab !== "code"}
                        className="flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                        ▶ Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={editorLocked || !signalRConnected || activeTab !== "code"}
                        className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        🚀 Submit
                    </button>
                </div>
            </div>

            {/* Editor Section with Tabs and Testcases */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Content Area */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === "code" && (
                            <Editor
                                height="100%"
                                language={language || "plaintext"}
                                value={code}
                                onChange={(val) => setCode(val ?? "")}
                                onMount={handleEditorDidMount}
                                options={{
                                    readOnly: editorLocked,
                                    minimap: { enabled: false },
                                }}
                            />
                        )}

                        {activeTab === "whiteboard" && (
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center h-full text-zinc-500">
                                        Loading whiteboard...
                                    </div>
                                }
                            >
                                <WhiteboardEditor ref={whiteboardRef} />
                            </Suspense>
                        )}

                        {editorLocked && activeTab === "code" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md bg-white/40 dark:bg-zinc-900/40 text-center text-zinc-700 dark:text-zinc-300 select-none transition">
                                <div className="text-lg font-semibold animate-pulse">Editor Locked 🔒</div>
                                <div className="text-sm opacity-80 mt-1">
                                    Click "Unlock" above to continue
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Testcase Panel - Only in Code Tab */}
                    {activeTab === "code" && (
                        <div
                            className="relative border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out"
                            style={{ height: `${panelHeight}px` }}
                        >
                            {collapsed ? (
                                <button
                                    onClick={toggleCollapse}
                                    className="absolute inset-0 flex items-center justify-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                    style={{
                                        height: "100%",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {testcases.length > 0 && (() => {
                                        const first = testcaseStates[testcases[0].testCaseId];
                                        const status = first?.status || "Pending";
                                        const colorMap: Record<string, string> = {
                                            Accepted: "text-green-600 dark:text-green-400",
                                            "Wrong Answer": "text-orange-600 dark:text-orange-400",
                                            "Time Limit Exceeded": "text-yellow-600 dark:text-yellow-400",
                                            "Runtime Error": "text-red-600 dark:text-red-400",
                                            Pending: "text-zinc-500 dark:text-zinc-400",
                                        };
                                        const iconMap: Record<string, string> = {
                                            Accepted: "✅",
                                            "Wrong Answer": "❌",
                                            "Time Limit Exceeded": "⏱️",
                                            "Runtime Error": "⚠️",
                                            Pending: "🕓",
                                        };
                                        return (
                                            <span
                                                className={`flex items-center gap-1.5 text-xs font-semibold ${
                                                    colorMap[status]
                                                } bg-white/70 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded-md`}
                                            >
                                                {iconMap[status]} {status}
                                            </span>
                                        );
                                    })()}
                                    <span className="text-[12px] opacity-80 tracking-wide font-medium">
                                        ▲ Show Test Results
                                    </span>
                                </button>
                            ) : testcases.length > 0 ? (
                                <TestcaseTabs
                                    testcases={testcases}
                                    testcaseStates={testcaseStates}
                                    onRemoveTestcase={(id) =>
                                        setTestcases((prev) => prev.filter((t) => t.testCaseId !== id))
                                    }
                                />
                            ) : (
                                <div className="p-3 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                                    Testcases will appear here after you Run or Submit.
                                </div>
                            )}

                            {!collapsed && (
                                <button
                                    onClick={toggleCollapse}
                                    className="absolute left-1/2 -translate-x-1/2 -top-4 text-[14px] px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
                                    title="Minimize panel"
                                >
                                    ▼
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Tab Buttons at Bottom */}
                <div className="flex gap-1 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2">
                    <button
                        onClick={() => setActiveTab("code")}
                        className={`
                            px-3 py-1.5 rounded font-medium text-xs transition
                            ${
                                activeTab === "code"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-zinc-600 border border-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                            }
                        `}
                    >
                        💻 Code
                    </button>
                    <button
                        onClick={() => setActiveTab("whiteboard")}
                        className={`
                            px-3 py-1.5 rounded font-medium text-xs transition
                            ${
                                activeTab === "whiteboard"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-zinc-600 border border-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                            }
                        `}
                    >
                        🎨 Whiteboard
                    </button>
                </div>
            </div>
        </div>
    );
}
