import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import LeftPanel from "./ProblemDetailPage/LeftPanel";
import MiddlePanel from "./ProblemDetailPage/MiddlePanel";
import RightPanel from "./ProblemDetailPage/RightPanel";
import { useProblemData } from "../hooks/useProblemData";
import SuccessNotification from "../components/SuccessNotification";
import { ProblemSessionProvider, useProblemSessionContext } from "../context/ProblemSessionContext";

type DecodedToken = {
    subscription?: string;
    subscriptionExpiry?: string;
};

export default function ProblemDetailPage() {
    const { idSlug } = useParams<{ idSlug: string }>();
    const problemId = Number(idSlug?.split("-")[0]);
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");
    let isPremiumUser = false;

    if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const sub = decoded.subscription;
        const exp = new Date(decoded.subscriptionExpiry || "");
        if (sub === "Premium" && exp > new Date()) isPremiumUser = true;
    }

    const {
        problem,
        languagesData,
        selectedProblemDetailId,
        setSelectedProblemDetailId,
        language,
        setLanguage,
        code,
        setCode,
        isLocked,
        isLoading,
        isSuccess,
    } = useProblemData(problemId);

    if (isLoading)
        return (
            <div className="flex h-screen items-center justify-center text-zinc-500">
                <div className="mr-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent" />
                Loading problem setup…
            </div>
        );

    if (isLocked)
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-3">
                <div className="text-5xl">🔒</div>
                <h3 className="text-zinc-700">This problem is locked</h3>
                <p className="max-w-md text-center text-zinc-500">
                    This problem is available only to premium members.
                </p>
                <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => navigate("/plans")}
                >
                    Upgrade to Premium
                </button>
            </div>
        );

    return (
        <ProblemSessionProvider
            problemId={problemId}
            problem={problem}
            isSuccess={isSuccess}
            isPremiumUser={isPremiumUser}
        >
            <PageContent
                problem={problem}
                languagesData={languagesData}
                selectedProblemDetailId={selectedProblemDetailId}
                setSelectedProblemDetailId={setSelectedProblemDetailId}
                language={language}
                setLanguage={setLanguage}
                code={code}
                setCode={setCode}
                problemId={problemId}
            />
        </ProblemSessionProvider>
    );
}

function PageContent({
    problem,
    languagesData,
    selectedProblemDetailId,
    setSelectedProblemDetailId,
    language,
    setLanguage,
    code,
    setCode,
    problemId,
}: any) {
    const {
        showSuccess,
        showSessionCompleted,
    } = useProblemSessionContext();

    const [activeLeftTab, setActiveLeftTab] = useState("description");

    return (
        <div className="h-[calc(100vh-6rem)] mt-1 bg-zinc-50 flex">
            <div className="grid grid-cols-12 w-full gap-2 px-2">

                <div className="col-span-3 border-r border-slate-200 overflow-hidden">
                    <LeftPanel
                        activeTab={activeLeftTab}
                        setActiveTab={setActiveLeftTab}
                        problem={problem}
                    />
                </div>

                <div className="col-span-5 border-r border-slate-200 overflow-hidden">
                    <MiddlePanel
                        code={code}
                        setCode={setCode}
                        language={language}
                        setLanguage={setLanguage}
                        languagesData={languagesData}
                        problemId={problemId}
                        setSelectedProblemDetailId={setSelectedProblemDetailId}
                    />
                </div>

                <div className="col-span-4 overflow-hidden">
                    <RightPanel />
                </div>
            </div>

            {showSuccess && (
                <SuccessNotification
                    message="🎉 Code Submitted Successfully..!"
                    duration={3500}
                />
            )}

            {showSessionCompleted && (
                <SuccessNotification
                    message="✅ Session Marked Completed..!"
                    duration={4000}
                />
            )}
        </div>
    );
}
