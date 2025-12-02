import React, { useEffect, useState, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import TestcaseTabs, { Testcase } from "./TestcaseTabs";
import { signalRService, ExecutionCompletedPayload } from "../../Service/signalRService";
import UnlockEditorModal from "./UnlockEditorModal";

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

interface Props {
    code: string;
    setCode: (val: string) => void;
    onRun: () => Promise<{ ok: boolean; message?: string; userSolutionId?: number }>;
    onSubmit: () => Promise<{ ok: boolean; message?: string; userSolutionId?: number }>;
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

    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [testcases, setTestcases] = useState<Testcase[]>([]);
    const [testcaseStates, setTestcaseStates] = useState<Record<number, any>>({});
    const [joinedSolutionId, setJoinedSolutionId] = useState<number | null>(null);

    // panel sizing
    const [collapsed, setCollapsed] = useState(false);
    const [panelHeight, setPanelHeight] = useState(window.innerHeight * 0.39);
    const lastHeightRef = useRef(panelHeight);

    const clearTestcases = () => {
        setTestcases([]);
        setTestcaseStates({});
        setJoinedSolutionId(null);
    };

    const handleRun = useCallback(async () => {
        if (!signalRConnected || editorLocked) return;
        clearTestcases();
        try {
            const res = await onRun();
            if (res && res.userSolutionId) {
                await signalRService.joinSolutionGroup(res.userSolutionId);
                setJoinedSolutionId(res.userSolutionId);
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
            if (res && res.userSolutionId) {
                await signalRService.joinSolutionGroup(res.userSolutionId);
                setJoinedSolutionId(res.userSolutionId);
            }
        } catch (err) {
            console.error("Submit failed", err);
        }
    }, [signalRConnected, editorLocked, onSubmit]);

    const handleEditorDidMount: OnMount = useCallback((editor) => {
        editorRef.current = editor;
        editor.layout();
    }, []);

    // SignalR events
    useEffect(() => {
        const unsubTestcase = signalRService.onTestcaseUpdate((payload: any) => {
            const backendPayload = payload as BackendTestcasePayload;
            if (!backendPayload?.testCaseId) return;

            // auto expand on new data
            setCollapsed(false);
            setPanelHeight(window.innerHeight * 0.39);

            setTestcases((prev) => {
                const exists = prev.some((t) => t.testCaseId === backendPayload.testCaseId);
                if (exists) return prev;
                return [
                    ...prev,
                    { testCaseId: backendPayload.testCaseId, name: `Test ${prev.length + 1}` },
                ];
            });

            setTestcaseStates((prev) => ({
                ...prev,
                [backendPayload.testCaseId]: {
                    ...prev[backendPayload.testCaseId],
                    ...backendPayload,
                },
            }));
        });

        const unsubExec = signalRService.onExecutionCompleted((payload: ExecutionCompletedPayload) => {
            console.info("✅ Execution Completed:", payload);
        });

        return () => {
            unsubTestcase();
            unsubExec();
        };
    }, []);

    // Resize observer
    useEffect(() => {
        const container = containerRef.current;
        const editorInstance = editorRef.current;
        if (!container || !editorInstance) return;
        const ro = new ResizeObserver(() => editorInstance.layout());
        ro.observe(container);
        return () => ro.disconnect();
    }, []);

    // Keyboard shortcuts (Ctrl+' = Run, Ctrl+Enter = Submit)
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

    // collapse toggle
    const toggleCollapse = () => {
        if (collapsed) {
            setCollapsed(false);
            setPanelHeight(lastHeightRef.current || window.innerHeight * 0.39);
        } else {
            lastHeightRef.current = panelHeight;
            setCollapsed(true);
            setPanelHeight(50); // neat bar height when collapsed
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
                        disabled={editorLocked}
                    >
                        {languages.map((lang) => (
                            <option key={lang.problemDetailId} value={lang.value}>
                                {lang.value.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    {editorLocked && (
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
                        disabled={editorLocked || !signalRConnected}
                        className="flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                        ▶ Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={editorLocked || !signalRConnected}
                        className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        🚀 Submit
                    </button>
                </div>
            </div>

            {/* Editor (takes remaining height dynamically) */}
            <div className="relative flex-1 overflow-hidden">
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

                {editorLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md bg-white/40 dark:bg-zinc-900/40 text-center text-zinc-700 dark:text-zinc-300 select-none transition">
                        <div className="text-lg font-semibold animate-pulse">Editor Locked 🔒</div>
                        <div className="text-sm opacity-80 mt-1">Click “Unlock” above to continue</div>
                    </div>
                )}
            </div>

            {/* Testcase Panel */}
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
                                    className={`flex items-center gap-1.5 text-xs font-semibold ${colorMap[status]} 
                  bg-white/70 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 
                  px-2 py-1 rounded-md`}
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

                {/* Collapse toggle button (centered) */}
                {!collapsed && (
                    <button
                        onClick={toggleCollapse}
                        className="absolute left-1/2 -translate-x-1/2 -top-4 text-[14px] px-3 py-1 rounded-md 
            bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 
            font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
                        title="Minimize panel"
                    >
                        ▼
                    </button>
                )}
            </div>
        </div>
    );
}
