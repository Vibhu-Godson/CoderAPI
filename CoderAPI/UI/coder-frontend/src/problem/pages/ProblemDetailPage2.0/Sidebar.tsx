import { ChevronDown, X } from "lucide-react";
import ProblemDescription from "../../components/ProblemDescription";
import MySolutions from "../../components/MySolutions";
import MySessions from "../../components/MySessions";

interface SidebarProps {
    activeTab: "description" | "solutions" | "sessions";
    setActiveTab: (tab: "description" | "solutions" | "sessions") => void;
    problem: any;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobile: boolean;
}

export default function Sidebar({
    activeTab,
    setActiveTab,
    problem,
    isCollapsed,
    setIsCollapsed,
    isMobile,
}: SidebarProps) {
    // Tab configurations
    const tabs = [
        { id: "description", label: "Problem", icon: "📋" },
        { id: "solutions", label: "Solutions", icon: "💾" },
        { id: "sessions", label: "Sessions", icon: "📊" },
    ] as const;

    if (isCollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="fixed left-2 top-20 z-40 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg md:absolute md:top-3 md:left-3"
                title="Show sidebar"
            >
                <ChevronDown size={20} />
            </button>
        );
    }

    return (
        <div className={`
            flex flex-col h-full bg-white overflow-hidden
            ${isMobile ? "fixed left-0 top-0 w-full max-w-xs z-30 shadow-xl" : ""}
        `}>
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200">
                <h3 className={`font-semibold text-sm text-zinc-700 ${isMobile ? "flex-1" : ""}`}>Problem</h3>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className={`p-1 hover:bg-slate-200 rounded transition ${isMobile ? "text-red-600" : ""}`}
                    title="Hide sidebar"
                >
                    {isMobile ? <X size={18} /> : <ChevronDown size={18} style={{ transform: "rotate(90deg)" }} />}
                </button>
            </div>

            {/* Content area - scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <div className="p-4">
                    {activeTab === "description" && problem && (
                        <ProblemDescription problem={problem} />
                    )}
                    {activeTab === "solutions" && problem && (
                        <MySolutions problemId={problem.problemId} />
                    )}
                    {activeTab === "sessions" && problem && (
                        <MySessions problemId={problem.problemId} />
                    )}
                </div>
            </div>

            {/* Tabs at bottom */}
            <div className="border-t border-slate-200 bg-slate-50 p-2 flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "description" | "solutions" | "sessions")}
                        className={`
                            flex-1 px-2 py-2 rounded font-medium text-xs transition truncate
                            ${activeTab === tab.id
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }
                        `}
                        title={tab.label}
                    >
                        <span>{tab.icon}</span>
                        <span className="hidden sm:inline"> {tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}