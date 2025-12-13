interface Problem {
    problemName: string;
    problemDetail: string;
    constraints: string[];
    difficultyLevel: "Easy" | "Medium" | "Hard" | string;
    tags: { value: string }[];
    testCases: {
        testCaseId: number;
        input: string;
        expectedOutput: string;
        explaination: string;
    }[];
}

// decode unicode like \u2264 → ≤
const decodeUnicode = (str: string) =>
    str.replace(/\\u([\dA-F]{4})/gi, (_, grp) =>
        String.fromCharCode(parseInt(grp, 16))
    );

// normalize constraints so UI never crashes
const normalizeConstraints = (raw: any): string[] => {
    if (!raw) return [];

    // Case 1: already an array
    if (Array.isArray(raw)) return raw.map(decodeUnicode);

    // Case 2: backend sends JSON string like "[\"1..\",\"2..\"]"
    if (typeof raw === "string" && raw.trim().startsWith("[")) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(decodeUnicode);
        } catch {
            // ignore parsing errors
        }
    }

    // Case 3: plain string with newline-separated constraints
    if (typeof raw === "string") {
        return raw
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
            .map(decodeUnicode);
    }

    return [];
};


export default function ProblemDescription({ problem }: { problem?: Problem }) {
    const diff = (problem?.difficultyLevel || "").toLowerCase();
    const diffColor =
        diff === "easy"
            ? "bg-emerald-600"
            : diff === "medium"
                ? "bg-amber-600"
                : "bg-rose-600";

    return (
        <div className="space-y-6">
            {/* Title + Difficulty */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {problem?.problemName}
                </h2>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                        Difficulty:
                    </span>
                    <span
                        className={`${diffColor} text-white text-xs px-3 py-1 rounded-full`}
                    >
                        {problem?.difficultyLevel}
                    </span>
                </div>
            </div>

            {/* Detail */}
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-800 dark:text-zinc-200">
                {problem?.problemDetail}
            </p>

            {/* Examples */}
            {problem?.testCases?.length ? (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                        Examples
                    </h3>

                    {problem.testCases.map((tc, index) => (
                        <div
                            key={tc.testCaseId}
                            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm"
                        >
                            <p className="font-semibold mb-3 text-zinc-700 dark:text-zinc-200">
                                Example {index + 1}
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                                        Input
                                    </p>
                                    <pre className="mt-1 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md text-xs whitespace-pre-wrap">
                                        {tc.input}
                                    </pre>
                                </div>

                                <div>
                                    <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                                        Output
                                    </p>
                                    <pre className="mt-1 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md text-xs whitespace-pre-wrap">
                                        {tc.expectedOutput}
                                    </pre>
                                </div>

                                {tc.explaination && (
                                    <div>
                                        <p className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                                            Explanation
                                        </p>
                                        <pre className="mt-1 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md text-xs whitespace-pre-wrap">
                                            {tc.explaination}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Constraints */}
            <div className="space-y-2">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    Constraints
                </h3>

                <ul className="flex flex-col gap-2 text-sm">
                    {normalizeConstraints(problem?.constraints).map((c, idx) => (
                        <li
                            key={idx}
                            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                        >
                            {c}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tags */}
            <div>
                <h3 className="text-lg mb-2 font-medium text-zinc-900 dark:text-zinc-100">
                    Tags
                </h3>

                <div className="flex flex-wrap gap-2">
                    {problem?.tags.map((t) => (
                        <span
                            key={t.value}
                            className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-3 py-1 text-xs text-zinc-800 dark:text-zinc-200"
                        >
                            {t.value}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
