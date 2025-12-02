interface Problem {
    problemName: string;
    problemDetail: string;
    constraints: string;
    difficultyLevel: "Easy" | "Medium" | "Hard" | string;
    tags: { value: string }[];
    testCases: {
        testCaseId: number;
        input: string;
        expectedOutput: string;
        explaination: string;
    }[];
}

export default function ProblemDescription({ problem }: { problem?: Problem }) {
    const diff = (problem?.difficultyLevel || "").toLowerCase();
    const diffClass =
        diff === "easy"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            : diff === "medium"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";

    return (
        <div className="space-y-4">
            {/* Title */}
            <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {problem?.problemName}
                </h2>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${diffClass}`}>
                    Difficulty: {problem?.difficultyLevel}
                </span>
            </div>

            {/* Description */}
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                {problem?.problemDetail}
            </p>

            {/* Examples */}
            {problem?.testCases?.length ? (
                <div className="space-y-2">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Examples</h3>
                    {problem.testCases.map((tc, idx) => (
                        <div
                            key={tc.testCaseId}
                            className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                        >
                            <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-200">
                                Example {idx + 1}
                            </p>
                            <pre className="mb-1 overflow-auto rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                                <strong>Input:</strong> {tc.input}
                            </pre>
                            <pre className="mb-1 overflow-auto rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                                <strong>Output:</strong> {tc.expectedOutput}
                            </pre>
                            {tc.explaination && (
                                <pre className="overflow-auto rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                                    <strong>Explanation:</strong> {tc.explaination}
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Constraints */}
            <div>
                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">Constraints</h3>
                <pre className="overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    {problem?.constraints}
                </pre>
            </div>

            {/* Tags */}
            <div>
                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {problem?.tags.map((t) => (
                        <span
                            key={t.value}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                            {t.value}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
