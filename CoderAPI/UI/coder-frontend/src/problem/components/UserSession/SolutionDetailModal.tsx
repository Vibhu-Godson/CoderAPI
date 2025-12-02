import React, { useEffect } from "react";
import { useGetSolutionQuery } from "../../userProblemApi";

export default function SolutionDetailModal({
    userSolutionId,
    onClose,
}: {
    userSolutionId: number | null;
    onClose: () => void;
}) {
    const { data, isLoading } = useGetSolutionQuery(userSolutionId!, {
        skip: !userSolutionId,
    });

    // Close modal on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!userSolutionId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-[80%] max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    onClick={onClose}
                >
                    ✕
                </button>

                {isLoading ? (
                    <p className="text-zinc-500">Loading solution...</p>
                ) : data ? (
                    <>
                        <h2 className="mb-2 text-xl font-semibold">
                            Solution #{data.userSolutionId}
                        </h2>
                        <div className="text-sm text-zinc-500 mb-3">
                            {new Date(data.submissionDate).toLocaleString()} •{" "}
                            <span
                                className={
                                    data.result === "Accepted"
                                        ? "text-green-600"
                                        : "text-red-500"
                                }
                            >
                                {data.result}
                            </span>{" "}
                            • Accuracy: {data.accuracy}%
                        </div>

                        <div className="border rounded-md p-3 bg-zinc-50 dark:bg-zinc-800 mb-5 overflow-x-auto">
                            <pre className="whitespace-pre-wrap text-sm">
                                <code>{data.userSolutionCode}</code>
                            </pre>
                        </div>

                        <h3 className="font-medium mb-2">Test Cases</h3>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-300 dark:border-zinc-700 text-left">
                                    <th className="p-2">#</th>
                                    <th className="p-2">Input</th>
                                    <th className="p-2">Expected</th>
                                    <th className="p-2">Output</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Memory</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.testCases.map((t, idx) => (
                                    <tr
                                        key={t.userTestCaseResultId}
                                        className="border-b border-zinc-200 dark:border-zinc-800"
                                    >
                                        <td className="p-2">{idx + 1}</td>
                                        <td className="p-2">{t.input}</td>
                                        <td className="p-2">{t.expectedOutput}</td>
                                        <td className="p-2">{t.actualOutput}</td>
                                        <td
                                            className={`p-2 font-medium ${t.status === "Passed"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {t.status}
                                        </td>
                                        <td className="p-2">{t.executionTime}ms</td>
                                        <td className="p-2">{t.memoryUsed}KB</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className="text-zinc-500">No data available</p>
                )}
            </div>
        </div>
    );
}
