// src/components/TestcaseTabs.tsx

import React, { useState, useEffect } from "react";

export type Testcase = {
    testCaseId: number;
    name?: string;
};

export default function TestcaseTabs({
    testcases = [],
    testcaseStates = {},
}: {
    testcases?: Testcase[];
    testcaseStates: Record<number, any>;
}) {
    const [activeId, setActiveId] = useState<number | null>(testcases.length ? testcases[0].testCaseId : null);

    useEffect(() => {
        // when testcases list changes, ensure we have a valid activeId
        if ((activeId === null || !testcases.find((t) => t.testCaseId === activeId)) && testcases.length) {
            setActiveId(testcases[0].testCaseId);
        }
        if (testcases.length === 0) {
            setActiveId(null);
        }
    }, [testcases, activeId]);

    return (
        <div className="h-100 d-flex flex-column">
            <div className="d-flex border-bottom align-items-center" style={{ overflowX: "auto" }}>
                {testcases.map((tc) => {
                    const state = testcaseStates[tc.testCaseId]?.status ?? "Waiting...";
                    return (
                        <button
                            key={tc.testCaseId} // KEY IS CORRECTLY APPLIED HERE
                            className={`btn btn-sm m-1 ${activeId === tc.testCaseId ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => setActiveId(tc.testCaseId)}
                            style={{ minWidth: 120 }}
                        >
                            {tc.name ?? `Test #${tc.testCaseId}`} — {state}
                        </button>
                    );
                })}
            </div>

            <div className="p-2 overflow-auto" style={{ flex: 1 }}>
                {activeId ? (
                    <TestcaseDetail testCaseId={activeId} state={testcaseStates[activeId] ?? { status: "Waiting..." }} />
                ) : (
                    <div className="text-muted">No testcases</div>
                )}
            </div>
        </div>
    );
}

function TestcaseDetail({ testCaseId, state }: { testCaseId: number; state: any }) {
    return (
        <div>
            <h6>Testcase #{testCaseId}</h6>
            <p>
                <strong>Status:</strong> {state.status}
            </p>
            {/* --- ADDED INPUT --- */}
            {state.input && (
                <div className="mb-3">
                    <p className="mb-1 fw-medium">
                        <strong>Input:</strong>
                    </p>
                    <pre className="border rounded bg-light p-2" style={{ whiteSpace: "pre-wrap", maxHeight: 150, overflowY: 'auto', fontSize: '0.85rem' }}>
                        {state.input}
                    </pre>
                </div>
            )}

            {/* --- ADDED EXPECTED OUTPUT (Visible for all, useful especially for W.A.) --- */}
            {state.expectedOutput && (
                <div className="mb-3">
                    <p className="mb-1 fw-medium">
                        <strong>Expected Output:</strong>
                    </p>
                    <pre className="border rounded bg-success-subtle p-2" style={{ whiteSpace: "pre-wrap", maxHeight: 150, overflowY: 'auto', fontSize: '0.85rem' }}>
                        {state.expectedOutput}
                    </pre>
                </div>
            )}

            {state.stdout !== undefined && (
                <>
                    <p>
                        <strong>Stdout:</strong>
                    </p>
                    <pre style={{ background: "#f8f9fa", padding: 8, whiteSpace: "pre-wrap" }}>{state.stdout}</pre>
                </>
            )}
            {state.stderr && (
                <>
                    <p>
                        <strong>Stderr:</strong>
                    </p>
                    <pre style={{ background: "#fff3f3", padding: 8, whiteSpace: "pre-wrap" }}>{state.stderr}</pre>
                </>
            )}
            {state.compileOutput && (
                <>
                    <p>
                        <strong>Compile Output:</strong>
                    </p>
                    <pre style={{ background: "#fff7e6", padding: 8, whiteSpace: "pre-wrap" }}>{state.compileOutput}</pre>
                </>
            )}
            {state.executionTime != null && (
                <p>
                    <strong>Execution time:</strong> {state.executionTime} ms
                </p>
            )}
            {state.memoryUsed != null && (
                <p>
                    <strong>Memory:</strong> {state.memoryUsed} KB
                </p>
            )}
        </div>
    );
}