import ProblemDescription from "../../components/ProblemDescription";
import { TabButton } from "./TabButton";

export default function LeftPanel({
    activeTab,
    setActiveTab,
    problem,
    leftCollapsed,
    setLeftCollapsed,
}: any) {
    if (leftCollapsed) {
        return (
            <button
                className="rounded-md bg-blue-600 px-3 py-1 text-white md:absolute md:left-3 md:top-3"
                onClick={() => setLeftCollapsed(false)}
            >
                Show Description
            </button>
        );
    }

    return (
        <div className="flex min-h-0 flex-col rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 flex justify-between items-center">
                <div className="flex gap-2">
                    <TabButton active={activeTab === "description"} onClick={() => setActiveTab("description")}>Description</TabButton>
                    <TabButton active={activeTab === "solutions"} onClick={() => setActiveTab("solutions")}>My Solutions</TabButton>
                    <TabButton active={activeTab === "sessions"} onClick={() => setActiveTab("sessions")}>My Sessions</TabButton>
                </div>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => setLeftCollapsed(true)}>Collapse</button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
                {activeTab === "description" && <ProblemDescription problem={problem} />}
                {activeTab === "solutions" && <div className="text-sm text-zinc-500">/* My Solutions */</div>}
                {activeTab === "sessions" && <div className="text-sm text-zinc-500">/* My Sessions */</div>}
            </div>
        </div>
    );
}
