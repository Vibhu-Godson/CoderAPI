// src/components/CodeEditorPanel.tsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import TestcaseTabs, { Testcase } from "./TestcaseTabs";
// We only import ExecutionCompletedPayload from the service.
import { signalRService, ExecutionCompletedPayload } from "../../Service/signalRService";
import UnlockEditorModal from "./UnlockEditorModal";

// --- Interfaces defined here (RENAMED to avoid collision) ---
// We must match the PascalCase fields sent by the backend: Input, ExpectedOutput, Status, etc.
// Renamed from TestcaseUpdatePayload to BackendTestcasePayload to fix TS conflict.
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
// -------------------------------------------------------------------------------


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
}: Props) {
    // Refs for Monaco Editor and its container
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State for the unlock modal
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    // local testcase list & states (managed here)
    const [testcases, setTestcases] = useState<Testcase[]>([]);
    const [testcaseStates, setTestcaseStates] = useState<Record<number, any>>({});
    const [joinedSolutionId, setJoinedSolutionId] = useState<number | null>(null);
    const mountedRef = useRef(true);

    // Helper to clear testcases (called before run/submit)
    const clearTestcases = () => {
        setTestcases([]);
        setTestcaseStates({});
        setJoinedSolutionId(null);
    };

    // --- EXECUTION HANDLERS (Moved up) ---
    // Defined before the useEffect that uses them, fixing TS2448/TS2454
    const handleRun = useCallback(async () => {
        if (!signalRConnected || editorLocked) return;
        clearTestcases();
        try {
            const res = await onRun();
            if (res && res.userSolutionId) {
                try {
                    await signalRService.joinSolutionGroup(res.userSolutionId);
                    setJoinedSolutionId(res.userSolutionId);
                } catch (err) {
                    console.error("Failed to join solution group for run", err);
                }
            }
            if (!res.ok) {
                console.warn("Run returned not ok:", res.message);
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
                try {
                    await signalRService.joinSolutionGroup(res.userSolutionId);
                    setJoinedSolutionId(res.userSolutionId);
                } catch (err) {
                    console.error("Failed to join solution group for submit", err);
                }
            }
            if (!res.ok) {
                console.warn("Submit returned not ok:", res.message);
            }
        } catch (err) {
            console.error("Submit failed", err);
        }
    }, [signalRConnected, editorLocked, onSubmit]);

    const handleUnlockClick = () => {
        setShowUnlockModal(true);
    };

    const handleUnlockAnyway = () => {
        setEditorLocked(false);
    };
    // ------------------------------------------------------------


    // Handler to store the editor instance when it mounts
    const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        editor.layout();
    }, []);

    // --- KEYBOARD SHORTCUTS ---
    useEffect(() => {
        const editorInstance = editorRef.current;
        if (!editorInstance) return;

        // Command: Ctrl + ' for Run
        const runAction = editorInstance.addAction({
            id: 'run-code-shortcut',
            label: 'Run Code',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote],
            contextMenuGroupId: 'navigation',
            run: () => handleRun(),
        });

        // Command: Ctrl + Enter for Submit
        const submitAction = editorInstance.addAction({
            id: 'submit-code-shortcut',
            label: 'Submit Code',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            contextMenuGroupId: 'navigation',
            run: () => handleSubmit(),
        });

        return () => {
            // Clean up actions using the dispose() method
            runAction.dispose();
            submitAction.dispose();
        };
    }, [handleRun, handleSubmit]);


    // --- SIGNALR/TESTCASE UPDATES ---
    useEffect(() => {
        mountedRef.current = true;

        // FIX: Cast the incoming payload parameter to 'any' to bypass the type conflict
        // from signalRService's incomplete definition, then assert to our correct type.
        const unsubTc = signalRService.onTestcaseUpdate((payload: any) => {

            // Assert the incoming payload to the correct backend structure
            const backendPayload = payload as BackendTestcasePayload;

            // Defensive check: Ensure payload is an object and has the required ID
            if (!backendPayload || typeof backendPayload !== 'object' || !backendPayload.testCaseId) {
                // Modified console message to log the unexpected payload
                console.error("Payload is missing TestCaseId. Stopping update.", backendPayload);
                return;
            }

            // 1. Update Testcases list (if new)
            setTestcases((prevTestcases) => {
                const isNew = !prevTestcases.find((t) => t.testCaseId === backendPayload.testCaseId);
                if (isNew) {
                    return [...prevTestcases, {
                        testCaseId: backendPayload.testCaseId,
                        name: `Test #${backendPayload.testCaseId}`
                    }];
                }
                return prevTestcases;
            });

            // 2. Update Testcase state 
            setTestcaseStates((prevStates) => {
                const existingState = prevStates[backendPayload.testCaseId] || {};

                const initialStatus = existingState.status || "PENDING";

                const newState = {
                    ...existingState,
                    // Use PascalCase fields from the payload definition
                    status: backendPayload.status ?? initialStatus,
                    stdout: backendPayload.stdout ?? existingState.stdout,
                    stderr: backendPayload.stderr ?? existingState.stderr,
                    compileOutput: backendPayload.compileOutput ?? existingState.compileOutput,
                    executionTime: backendPayload.executionTime ?? existingState.executionTime,
                    memoryUsed: backendPayload.memoryUsed ?? existingState.memoryUsed,
                    userTestCaseResultId: backendPayload.userTestCaseResultId ?? existingState.userTestCaseResultId,
                    input: backendPayload.input ?? existingState.input,
                    expectedOutput: backendPayload.expectedOutput ?? existingState.expectedOutput,
                };

                return {
                    ...prevStates,
                    [backendPayload.testCaseId]: newState,
                };
            });
        });

        const unsubExec = signalRService.onExecutionCompleted((payload: ExecutionCompletedPayload) => {
            console.info("ExecutionCompleted", payload);
            // Show status in UI
            if (payload.status) {
                alert(`Final Verdict: ${payload.status}`);
            }

            // If Accepted -> trigger AI follow-up
            if (payload.status === "Accepted") {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("ai-request-explanation", {
                        detail: {userSolutionId: payload.userSolutionId}
                    }));
                }, 500);
            }
        });

        return () => {
            unsubTc();
            unsubExec();
            mountedRef.current = false;
        };
    }, []);

    // --- RESIZE FIX (requestAnimationFrame) ---
    useEffect(() => {
        const containerElement = containerRef.current;
        const editorInstance = editorRef.current;
        if (!containerElement || !editorInstance) return;

        let animationFrameId: number | null = null;
        const resizeObserver = new ResizeObserver(() => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(() => {
                editorInstance.layout();
            });
        });
        resizeObserver.observe(containerElement);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            resizeObserver.unobserve(containerElement);
            resizeObserver.disconnect();
        };
    }, [editorRef.current]);

    return (
        // Attach the ref to the root element being observed
        <div ref={containerRef} className="d-flex flex-column h-100 position-relative">
            <UnlockEditorModal
                show={showUnlockModal}
                onClose={() => setShowUnlockModal(false)}
                onUnlockAnyway={handleUnlockAnyway}
            />

            <div className="p-2 d-flex justify-content-between align-items-center border-bottom">
                <div className="d-flex align-items-center">
                    <select
                        className="form-select w-auto"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={editorLocked}
                    >
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="csharp">C#</option>
                        <option value="javascript">JavaScript</option>
                    </select>

                    {/* Updated Unlock Button */}
                    {editorLocked && (
                        <button className="btn btn-warning ms-2" onClick={handleUnlockClick}>
                            Unlock Editor
                        </button>
                    )}
                </div>

                <div>
                    {/* Buttons disabled until signalRConnected is true OR editor is locked */}
                    <button className="btn btn-secondary me-2" onClick={handleRun} disabled={editorLocked || !signalRConnected}>
                        Run (Ctrl + ')
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={editorLocked || !signalRConnected}>
                        Submit (Ctrl + Enter)
                    </button>
                </div>
            </div>

            {/* Editor Container: Apply blur when locked */}
            <div style={{
                filter: editorLocked ? 'blur(3px)' : 'none',
                transition: 'filter 0.3s ease-in-out',
                flexGrow: 1,
                position: 'relative'
            }}>
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(val) => setCode(val ?? "")}
                    onMount={handleEditorDidMount}
                    options={{
                        readOnly: editorLocked,
                        minimap: { enabled: false }
                    }}
                />
            </div>

            {/* Testcases area */}
            <div style={{ height: "40%", borderTop: "1px solid #e6e6e6", minHeight: '100px' }}>
                {testcases.length > 0 ? (
                    <TestcaseTabs testcases={testcases} testcaseStates={testcaseStates} />
                ) : (
                    <div className="p-3 text-muted">Testcases will appear here after you Run or Submit and results arrive.</div>
                )}
            </div>
        </div>
    );
}
