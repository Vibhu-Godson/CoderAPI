// MySolutions.tsx
import { useState } from "react";
import { useListSolutionsQuery } from "../userProblemApi";
import SolutionDetailModal from "./UserSession/SolutionDetailModal";

export default function MySolutions({ problemId }: { problemId: number }) {
    const { data, isLoading, error } = useListSolutionsQuery(problemId);
    const [selectedSolution, setSelectedSolution] = useState<number | null>(null);

    if (isLoading) return <p className="text-zinc-500 text-sm">Loading your solutions…</p>;
    if (error) return <p className="text-red-500 text-sm">Failed to load solutions.</p>;
    if (!data?.items?.length) return <p className="text-zinc-500 text-sm">No solutions found.</p>;

    return (
        <>
            <div className="space-y-2">
                {data.items.map((s) => (
                    <div
                        key={s.userSolutionId}
                        className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                        onClick={() => setSelectedSolution(s.userSolutionId)}
                    >
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">{s.selectedLanguage}</span>
                            <span className="text-zinc-500">
                                {new Date(s.submissionDate).toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                            Result:{" "}
                            <span
                                className={`font-medium ${s.result === "Accepted"
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }`}
                            >
                                {s.result}
                            </span>{" "}
                            • Time: {s.totalExecutionTime}ms • Memory: {s.totalMemoryUser}KB
                        </div>
                    </div>
                ))}
            </div>

            {selectedSolution && (
                <SolutionDetailModal
                    userSolutionId={selectedSolution}
                    onClose={() => setSelectedSolution(null)}
                />
            )}
        </>
    );
}
