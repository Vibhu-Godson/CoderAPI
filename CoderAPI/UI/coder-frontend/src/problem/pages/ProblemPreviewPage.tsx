import { Navigate, useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useProblemData } from "../hooks/useProblemData";
import { useNewSessionMutation } from "../problemApi";
import { signalRService } from "../../Service/signalRService";
import { ArrowLeft, Play } from "lucide-react";

type DecodedToken = {
    subscription?: string;
    subscriptionExpiry?: string;
};

export default function ProblemPreviewPage() {
    const { idSlug } = useParams<{ idSlug: string }>();
    const navigate = useNavigate();
    const problemId = Number(idSlug?.split("-")[0]);

    const token = localStorage.getItem("authToken");
    let isPremiumUser = false;
    if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const sub = decoded.subscription;
        const expDate = new Date(decoded.subscriptionExpiry || "");
        if (sub === "Premium" && expDate > new Date()) isPremiumUser = true;
    }

    // Fetch problem data
    const {
        problem,
        isLocked,
        isLoading,
        isSuccess,
    } = useProblemData(problemId);

    const [startSession] = useNewSessionMutation();
    const [isStarting, setIsStarting] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-zinc-500">
                <div className="mr-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />
                Loading problem…
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-3">
                <div className="text-5xl">🔒</div>
                <h3 className="text-zinc-700 dark:text-zinc-200">This problem is locked</h3>
                <p className="max-w-md text-center text-zinc-500 dark:text-zinc-400">
                    This problem is available only to premium members.
                </p>
                <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    onClick={() => navigate("/plans")}
                >
                    Upgrade to Premium
                </button>
            </div>
        );
    }

    const handleStartSolving = async () => {
        if (!problem?.problemId) return;
        
        setIsStarting(true);
        try {
            // Create session
            // const res = await startSession(problem.problemId).unwrap();   
                // Navigate to 2.0 version
                navigate(`/problem-solve/${problemId}-${problem.problemName?.replace(/\s+/g, "-").toLowerCase()}`);
        } catch (err) {
            console.error("Error starting session:", err);
            setIsStarting(false);
        }
    };

    const handleBack = () => {
        navigate("/problems");
    };

    if (!problem) {
        return (
            <div className="flex h-screen items-center justify-center text-zinc-500">
                Problem not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back to Problems</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`
                            px-2.5 py-1 rounded-full text-xs font-semibold
                            ${problem.difficultyLevel === "Easy" ? "bg-green-100 text-green-800" :
                              problem.difficultyLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"}
                        `}>
                            {problem.difficultyLevel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        {problem.problemName}
                    </h1>
                </div>

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {problem.tags.map((tag: any, idx: number) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-200 transition cursor-pointer"
                            >
                                {typeof tag === "string" ? tag : tag.value}
                            </span>
                        ))}
                    </div>
                )}

                {/* Problem Description */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Description</h2>
                    <div className="prose prose-sm max-w-none text-slate-700">
                        {problem.problemDetail ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: problem.problemDetail,
                                }}
                            />
                        ) : (
                            <p>No description available</p>
                        )}
                    </div>
                </div>

                {/* Constraints */}
                {problem.constraints && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Constraints</h2>
                        <div className="prose prose-sm max-w-none text-slate-700">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: problem.constraints,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Test Cases Preview */}
                {problem.testCases && problem.testCases.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            Example Test Cases
                        </h2>
                        <div className="space-y-4">
                            {problem.testCases.slice(0, 2).map((testCase: any, idx: number) => (
                                <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold text-slate-600 mb-1">Input:</p>
                                        <pre className="bg-white p-2 rounded border border-slate-200 text-sm text-slate-700 overflow-auto">
                                            {testCase.input}
                                        </pre>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold text-slate-600 mb-1">Output:</p>
                                        <pre className="bg-white p-2 rounded border border-slate-200 text-sm text-slate-700 overflow-auto">
                                            {testCase.expectedOutput}
                                        </pre>
                                    </div>
                                    {testCase.explaination && (
                                        <div>
                                            <p className="text-xs font-semibold text-slate-600 mb-1">Explanation:</p>
                                            <p className="text-sm text-slate-600">
                                                {testCase.explaination}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {problem.testCases.length > 3 && (
                                <p className="text-sm text-slate-500 text-center py-2">
                                    +{problem.testCases.length - 3} more open test cases
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Start Solving Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleStartSolving}
                        disabled={isStarting}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white text-lg transition
                            ${isStarting
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                            }
                        `}
                    >
                        <Play size={20} fill="white" />
                        {isStarting ? "Starting Session..." : "Start Solving"}
                    </button>
                </div>
            </div>
        </div>
    );
}
