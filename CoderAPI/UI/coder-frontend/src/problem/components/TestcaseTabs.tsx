import React, { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, X } from "lucide-react";

export interface Testcase {
    testCaseId: number;
    name: string;
}

interface Props {
    testcases: Testcase[];
    testcaseStates: Record<number, any>;
    onRemoveTestcase?: (testCaseId: number) => void;
}

const STATUS_PRIORITY: Record<string, number> = {
    "Runtime Error": 1,
    "Wrong Answer": 2,
    "Time Limit Exceeded": 3,
    "Accepted": 4,
    "Pending": 5,
};

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    "Runtime Error": { color: "text-red-600 dark:text-red-400", bg: "bg-red-50", border: "border-red-400" },
    "Wrong Answer": { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50", border: "border-orange-400" },
    "Time Limit Exceeded": { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50", border: "border-yellow-400" },
    "Accepted": { color: "text-green-600 dark:text-green-400", bg: "bg-green-50", border: "border-green-400" },
    "Pending": { color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-50", border: "border-zinc-400" },
};

const STATUS_ICON: Record<string, React.ReactNode> = {
    "Runtime Error": <AlertTriangle className="h-3.5 w-3.5" />,
    "Wrong Answer": <XCircle className="h-3.5 w-3.5" />,
    "Time Limit Exceeded": <Clock className="h-3.5 w-3.5" />,
    "Accepted": <CheckCircle2 className="h-3.5 w-3.5" />,
    "Pending": <Clock className="h-3.5 w-3.5" />,
};

// Highlight differences between expected vs actual
function highlightDiff(expected: string, actual: string) {
    if (expected === actual) return <span>{actual}</span>;
    const minLen = Math.min(expected.length, actual.length);
    const parts = [];
    for (let i = 0; i < minLen; i++) {
        if (expected[i] !== actual[i])
            parts.push(
                <span key={i} className="text-red-500 font-semibold">
                    {actual[i]}
                </span>
            );
        else parts.push(<span key={i}>{actual[i]}</span>);
    }
    if (actual.length > expected.length)
        parts.push(
            <span key="extra" className="text-red-400">
                {actual.slice(expected.length)}
            </span>
        );
    return <>{parts}</>;
}

export default function TestcaseTabs({ testcases, testcaseStates, onRemoveTestcase }: Props) {
    const [activeId, setActiveId] = useState<number | null>(
        testcases.length > 0 ? testcases[0].testCaseId : null
    );

    const sortedTestcases = useMemo(() => {
        return [...testcases].sort((a, b) => {
            const aStatus = testcaseStates[a.testCaseId]?.status || "Pending";
            const bStatus = testcaseStates[b.testCaseId]?.status || "Pending";
            return (STATUS_PRIORITY[aStatus] || 999) - (STATUS_PRIORITY[bStatus] || 999);
        });
    }, [testcases, testcaseStates]);

    const activeCase = activeId ? testcaseStates[activeId] : null;

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                <span>Test Results</span>
                {testcases.length > 0 && (
                    <span className="text-[11px] text-zinc-400">{testcases.length} cases</span>
                )}
            </div>

            {/* Chrome-style Tabs */}
            <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-700 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                {sortedTestcases.map((tc, index) => {
                    const state = testcaseStates[tc.testCaseId];
                    const status = state?.status || "Pending";
                    const isActive = activeId === tc.testCaseId;
                    const style = STATUS_STYLE[status];
                    return (
                        <div
                            key={tc.testCaseId}
                            className={`flex items-center mr-[1px] border border-zinc-300 dark:border-zinc-700 rounded-t-md ${isActive ? "bg-white dark:bg-zinc-900 border-b-0" : "bg-zinc-200 dark:bg-zinc-800"} transition-all`}
                        >
                            <button
                                onClick={() => setActiveId(tc.testCaseId)}
                                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium whitespace-nowrap transition-all rounded-t-md ${style.color} ${isActive ? "font-semibold" : "opacity-80 hover:opacity-100"}`}
                            >
                                {STATUS_ICON[status]}
                                <span>{tc.name}</span>
                            </button>
                            <button
                                onClick={() => onRemoveTestcase?.(tc.testCaseId)}
                                className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-sm ml-1"
                                title="Close testcase"
                            >
                                <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-3 text-xs">
                {activeCase ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-black dark:text-white">Status:</span>
                            <span
                                className={`px-2 py-0.5 rounded-md border ${STATUS_STYLE[activeCase.status || "Pending"].border} ${STATUS_STYLE[activeCase.status || "Pending"].bg} ${STATUS_STYLE[activeCase.status || "Pending"].color}`}
                            >
                                {activeCase.status || "Pending"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <div className="font-medium text-zinc-600 dark:text-zinc-300 mb-1">Input</div>
                                <pre className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 overflow-auto text-[11px] leading-snug">
                                    {activeCase.input || "<empty>"}
                                </pre>
                            </div>

                            <div>
                                <div className="font-medium text-zinc-600 dark:text-zinc-300 mb-1">Expected Output</div>
                                <pre className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 overflow-auto text-[11px] leading-snug">
                                    {activeCase.expectedOutput || "<empty>"}
                                </pre>
                            </div>

                            <div>
                                <div className="font-medium text-zinc-600 dark:text-zinc-300 mb-1">User Output</div>
                                <pre className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 overflow-auto text-[11px] leading-snug">
                                    {activeCase.stdout
                                        ? highlightDiff(activeCase.expectedOutput || "", activeCase.stdout)
                                        : "<empty>"}
                                </pre>
                            </div>

                            {activeCase.stderr && (
                                <div>
                                    <div className="font-medium text-red-600 dark:text-red-400 mb-1">Error</div>
                                    <pre className="p-2 rounded bg-red-50 dark:bg-red-900/20 overflow-auto text-[11px] leading-snug">
                                        {activeCase.stderr}
                                    </pre>
                                </div>
                            )}
                        </div>

                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                            Time: {activeCase.executionTime ?? "--"} ms | Memory:{" "}
                            {activeCase.memoryUsed ?? "--"} KB
                        </div>
                    </div>
                ) : (
                    <div className="text-zinc-500 dark:text-zinc-400 italic text-xs">
                        Select a testcase tab above to view details.
                    </div>
                )}
            </div>
        </div>
    );
}
