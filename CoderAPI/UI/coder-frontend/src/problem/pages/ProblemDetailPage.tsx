import { Navigate, useNavigation, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import LeftPanel from "./ProblemDetailPage/LeftPanel";
import MiddlePanel from "./ProblemDetailPage/MiddlePanel";
import RightPanel from "./ProblemDetailPage/RightPanel";
import { useProblemData } from "../hooks/useProblemData";
import { useProblemSession } from "../hooks/useProblemSession";
import SuccessNotification from "../components/SuccessNotification"; 
import { useNavigate } from "react-router-dom";

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
        const expDate = new Date(decoded.subscriptionExpiry || "");
        if (sub === "Premium" && expDate > new Date()) isPremiumUser = true;
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

    const {
        sessionId,
        chat,
        userInput,
        setUserInput,
        handleSend,
        wrappedRun,
        wrappedSubmit,
        signalRConnected,
        editorLocked,
        setEditorLocked,
        showSuccess,
        showSessionCompleted,
    } = useProblemSession(problemId, problem, isSuccess, isPremiumUser, code, language);


    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeMiddleTab] = useState("code");
    const [includeCode, setIncludeCode] = useState(true);
    const [includeBoard, setIncludeBoard] = useState(false);
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);
    const [isThinking, setIsThinking] = useState(false); // ✅ from AI hook
    const [tlEditorRef, setTlEditorRef] = useState<any>(null); // ✅ shared ref


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
                <h3 className="text-zinc-700 dark:text-zinc-200">This problem is locked</h3>
                <p className="max-w-md text-center text-zinc-500 dark:text-zinc-400">
                    This problem is available only to premium members.
                </p>
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700" onClick={() => navigate("/plans") }>
                    Upgrade to Premium
                </button>
            </div>
        );

    return (
        <div className="h-[calc(100vh-6rem)] mt-1 bg-zinc-50 flex">
            <div className="grid grid-cols-12 w-full gap-2 px-2">
                <div className="col-span-3 border-r border-slate-200 overflow-hidden">
                    <LeftPanel
                        activeTab={activeLeftTab}
                        setActiveTab={setActiveLeftTab}
                        problem={problem}
                        leftCollapsed={leftCollapsed}
                        setLeftCollapsed={setLeftCollapsed}
                    />
                </div>
                <div className="col-span-5 border-r border-slate-200 overflow-hidden">
                    <MiddlePanel
                        code={code}
                        setCode={setCode}
                        wrappedRun={wrappedRun}
                        wrappedSubmit={wrappedSubmit}
                        editorLocked={editorLocked}
                        setEditorLocked={setEditorLocked}
                        language={language}
                        setLanguage={setLanguage}
                        languagesData={languagesData}
                        signalRConnected={signalRConnected}
                        sessionId={sessionId}
                        problemId={problemId}
                        setSelectedProblemDetailId={setSelectedProblemDetailId}
                        setTlEditorRef={setTlEditorRef}  // ✅ pass down
                    />
                </div>

                <div className="col-span-4 overflow-hidden">
                    <RightPanel
                        rightCollapsed={rightCollapsed}
                        setRightCollapsed={setRightCollapsed}
                        chat={chat}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        handleSend={handleSend}
                        includeCode={includeCode}
                        setIncludeCode={setIncludeCode}
                        includeBoard={includeBoard}
                        setIncludeBoard={setIncludeBoard}
                        isThinking={isThinking}  // ✅ pass down
                        code={code}              // ✅ pass down
                        tlEditorRef={tlEditorRef} // ✅ pass down
                    />
                </div>

            </div>

            {/* ✅ Success Toasts */}
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
