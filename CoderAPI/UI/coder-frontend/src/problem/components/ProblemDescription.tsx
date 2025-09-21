interface Problem {
    problemName: string;
    problemDetail: string;
    constraints: string;
    difficultyLevel: string;
    tags: { value: string }[];
}

export default function ProblemDescription({ problem }: { problem?: Problem }) {
    return (
        <div>
            <h4 className="mb-3">{problem?.problemName}</h4>
            <p>{problem?.problemDetail}</p>
            <p><strong>Constraints:</strong> {problem?.constraints}</p>
            <p><strong>Difficulty:</strong>
                <span className={`badge ms-2 ${problem?.difficultyLevel === 'Easy' ? 'bg-success' :
                        problem?.difficultyLevel === 'Medium' ? 'bg-warning text-dark' :
                            'bg-danger'
                    }`}>
                    {problem?.difficultyLevel}
                </span>
            </p>
            <p><strong>Tags:</strong> {problem?.tags.map((t) => (
                <span key={t.value} className="badge bg-secondary me-1">{t.value}</span>
            ))}</p>
        </div>
    );
}
