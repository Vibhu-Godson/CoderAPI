import ProblemDescription from "../../components/ProblemDescription";
import ProblemDiscussion from "../../components/ProblemDiscussion/index";
import { TabButton } from "./TabButton";
import MySolutions from "../../components/MySolutions";
import MySessions from "../../components/MySessions";

export default function LeftPanel({
    activeTab,
    setActiveTab,
    problem,
    openDiscussionModal
}: any) {

    return (
        <div className="flex min-h-0 flex-col h-full bg-white">
            <div className="mb-2 flex items-center gap-2">
                <TabButton active={activeTab === "description"} onClick={() => setActiveTab("description")}>
                    Description
                </TabButton>
                <TabButton active={activeTab === "solutions"} onClick={() => setActiveTab("solutions")}>
                    Your Solutions
                </TabButton>
                <TabButton active={activeTab === "sessions"} onClick={() => setActiveTab("sessions")}>
                    Your Sessions
                </TabButton>
                <TabButton active={activeTab === "discussion"} onClick={() => setActiveTab("discussion")}>
                    Discussion
                </TabButton>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
                {activeTab === "description" && <ProblemDescription problem={problem} />}
                {activeTab === "solutions" && <MySolutions problemId={problem.problemId} />}
                {activeTab === "sessions" && <MySessions problemId={problem.problemId} />}
                {activeTab === "discussion" && (
                    <ProblemDiscussion
                        problemId={problem.problemId}
                        openDiscussionModal={openDiscussionModal}
                    />
                )}
            </div>
        </div>
    );
}
