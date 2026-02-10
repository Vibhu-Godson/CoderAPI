import { useState } from "react";
import { MessageSquare, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import CodeEditorPanel from "../../components/CodeEditorPanel";

interface PlaygroundProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    setLanguage: (language: string) => void;
    languagesData: any;
    selectedProblemDetailId: number | null;
    setSelectedProblemDetailId: (id: number | null) => void;
    wrappedRun: () => Promise<any>;
    wrappedSubmit: () => Promise<any>;
    chat: any[];
    userInput: string;
    setUserInput: (input: string) => void;
    handleSend: () => void;
    signalRConnected: boolean;
    sessionId: number | null;
    problemId: number;
    editorLocked: boolean;
    setEditorLocked: (locked: boolean) => void;
    isThinking: boolean;
    problem: any;
    isMobile: boolean;
    onMinimize?: () => void;
}

type CodeTab = "code" | "whiteboard";
type ViewMode = "code-only" | "code-chat";

export default function Playground({
    code,
    setCode,
    language,
    setLanguage,
    languagesData,
    selectedProblemDetailId,
    setSelectedProblemDetailId,
    wrappedRun,
    wrappedSubmit,
    chat,
    userInput,
    setUserInput,
    handleSend,
    signalRConnected,
    sessionId,
    problemId,
    editorLocked,
    setEditorLocked,
    isThinking,
    problem,
    isMobile,
    onMinimize,
}: PlaygroundProps) {
    const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("code");
    const [viewMode, setViewMode] = useState<ViewMode>("code-chat");

    return (
        <div className="flex flex-col h-full bg-white">
            {/* View Mode Selector */}
            <div className="flex gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                <button
                    onClick={() => setViewMode("code-chat")}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-xs transition
                        ${viewMode === "code-chat"
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }
                    `}
                    title="Code + Chat"
                >
                    <PanelLeftOpen size={14} /> Code & Chat
                </button>
                <button
                    onClick={() => setViewMode("code-only")}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-xs transition
                        ${viewMode === "code-only"
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }
                    `}
                    title="Code Only"
                >
                    <PanelLeftClose size={14} /> Code Only
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SECTION: Code Editor & Whiteboard */}
                <div className={`
                    flex flex-col border-r border-slate-200 overflow-hidden
                    ${viewMode === "code-only" ? "w-full" : "w-2/3"}
                `}>
                    {/* Content area */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {activeCodeTab === "code" && (
                            <div className="flex flex-col h-full overflow-hidden">
                                {/* Code Editor */}
                                <div className="flex-1 overflow-hidden">
                                    <CodeEditorPanel
                                        code={code}
                                        setCode={setCode}
                                        language={language}
                                        setLanguage={setLanguage}
                                        languages={languagesData?.items || []}
                                        onRun={wrappedRun}
                                        onSubmit={wrappedSubmit}
                                        editorLocked={editorLocked}
                                        setEditorLocked={setEditorLocked}
                                        signalRConnected={signalRConnected}
                                        sessionId={sessionId}
                                        problemId={problemId}
                                    />
                                </div>
                            </div>
                        )}

                        {activeCodeTab === "whiteboard" && (
                            <div className="flex items-center justify-center h-full bg-slate-50">
                                <div className="text-center">
                                    <p className="text-slate-500 font-medium">Whiteboard Coming Soon</p>
                                    <p className="text-xs text-slate-400 mt-1">Interactive drawing space</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Tabs */}
                    <div className="flex gap-0 border-t border-slate-200 bg-slate-50 px-2 py-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveCodeTab("code")}
                            className={`
                                px-3 py-1.5 rounded font-medium text-xs transition truncate whitespace-nowrap flex-shrink-0
                                ${activeCodeTab === "code"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                }
                            `}
                        >
                            💻 Code
                        </button>
                        <button
                            onClick={() => setActiveCodeTab("whiteboard")}
                            className={`
                                px-3 py-1.5 rounded font-medium text-xs transition truncate whitespace-nowrap flex-shrink-0 ml-2
                                ${activeCodeTab === "whiteboard"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                                }
                            `}
                        >
                            🎨 Board
                        </button>
                    </div>
                </div>

                {/* RIGHT SECTION: Chat (visible only in code-chat mode) */}
                {viewMode === "code-chat" && (
                    <div className="w-1/3 flex flex-col bg-white overflow-hidden">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={18} className="text-indigo-600" />
                                <h3 className="font-semibold text-slate-900 text-sm">AI Assistant</h3>
                            </div>
                            <div className={`
                                w-2 h-2 rounded-full
                                ${signalRConnected ? "bg-green-500" : "bg-slate-300"}
                            `} />
                        </div>

                        {/* Chat messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-white space-y-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {chat.length === 0 && (
                                <div className="flex items-center justify-center h-full text-center">
                                    <div>
                                        <MessageSquare size={28} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-slate-500 text-xs">Start a conversation</p>
                                    </div>
                                </div>
                            )}
                            {chat.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.from === "ai" ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`
                                            max-w-xs px-3 py-2 rounded-lg text-xs
                                            ${msg.from === "ai"
                                                ? "bg-slate-100 text-slate-900"
                                                : "bg-indigo-600 text-white"
                                            }
                                        `}
                                    >
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded-lg">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat input */}
                        <div className="p-3 bg-slate-50 border-t border-slate-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask AI..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    disabled={!signalRConnected}
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs disabled:bg-slate-100"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!signalRConnected || !userInput.trim() || isThinking}
                                    className={`
                                        p-2 rounded-lg transition flex-shrink-0
                                        ${!signalRConnected || !userInput.trim() || isThinking
                                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }
                                    `}
                                >
                                    <MessageSquare size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
