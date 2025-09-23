interface Problem {
    problemName: string;
    problemDetail: string;
    constraints: string;
    difficultyLevel: string;
    tags: { value: string }[];
    testCases: {
        testCaseId: number;
        input: string;
        expectedOutput: string;
        explaination: string;
    }[];
}

export default function ProblemDescription({ problem }: { problem?: Problem }) {
    return (
        <div>
            {/* Question */}
            <h4 className="mb-3">{problem?.problemName}</h4>
            <p>{problem?.problemDetail}</p>

            {/* Difficulty */}
            <p>
                <strong>Difficulty:</strong>
                <span
                    className={`badge ms-2 ${problem?.difficultyLevel === "Easy"
                            ? "bg-success"
                            : problem?.difficultyLevel === "Medium"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                        }`}
                >
                    {problem?.difficultyLevel}
                </span>
            </p>

            {/* Test Cases */}
            {problem?.testCases?.length ? (
                <div className="mb-3">
                    <h5>Examples:</h5>
                    {problem.testCases.map((tc, idx) => (
                        <div
                            key={tc.testCaseId}
                            className="p-2 mb-2 border rounded bg-light"
                        >
                            <p>
                                <strong>Example {idx + 1}:</strong>
                            </p>
                            <pre className="mb-1">
                                <strong>Input:</strong> {tc.input}
                            </pre>
                            <pre className="mb-1">
                                <strong>Output:</strong> {tc.expectedOutput}
                            </pre>
                            {tc.explaination && (
                                <pre className="mb-1">
                                    <strong>Explanation:</strong> {tc.explaination}
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Constraints */}
            <div className="mb-3">
                <p>
                    <strong>Constraints:</strong>
                </p>
                <pre className="bg-light p-2 rounded">{problem?.constraints}</pre>
            </div>

            {/* Tags */}
            <div>
                <p>
                    <strong>Tags:</strong>
                </p>
                {problem?.tags.map((t) => (
                    <span key={t.value} className="badge bg-secondary me-1">
                        {t.value}
                    </span>
                ))}
            </div>
        </div>
    );
}
