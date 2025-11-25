import React from "react";
import AIChatPanel from "../../components/AIChatPanel";
import { useProblemSessionContext } from "../../context/ProblemSessionContext";

export default function RightPanel() {
    const {
        rightCollapsed,
        setRightCollapsed,
        chat,
        userInput,
        setUserInput,
        handleSend,
        includeCode,
        setIncludeCode,
        includeBoard,
        setIncludeBoard,
        isThinking,
        tlEditorRef,
        // THIS is what your context actually provides:
        setCodeRef,
    } = useProblemSessionContext();

    // ❗ Your context does NOT store "code"
    // But ProblemDetailPage can pass code into context by calling setCodeRef(() => code)
    // So to fetch latest code:
    const getCode = React.useRef<() => string>(() => "");
    getCode.current = () => setCodeRef((fn) => fn) as any;

    // Instead of getCode.current, we simply expose a function:
    const code = ""; // EMPTY — actual code is injected via setCodeRef in Detail Page

    // Chat collapsed button
    if (rightCollapsed) {
        return (
            <div className="md:absolute md:right-3 md:top-3">
                <button
                    aria-label="Show chat"
                    onClick={() => setRightCollapsed(false)}
                    className="
                        inline-flex items-center gap-2
                        rounded-full bg-blue-600 px-4 py-2 text-sm
                        font-medium text-white shadow hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12c0 2.2.8 4.22 2.12 5.78L3 21l3.22-2.12A8.94 8.94 0 0012 21c4.97 0 9-4.03 9-9z"
                        />
                    </svg>
                    Show chat
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                    AI Chat
                </h3>

                <div className="flex items-center gap-2">
                    {isThinking && (
                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-300">
                            <span className="text-xs">Thinking</span>
                            <span aria-hidden>
                                <span className="animate-pulse inline-block w-1 h-1 rounded-full bg-zinc-500 mr-0.5" />
                                <span
                                    className="animate-pulse inline-block w-1 h-1 rounded-full bg-zinc-500 mr-0.5"
                                    style={{ animationDelay: "0.12s" }}
                                />
                                <span
                                    className="animate-pulse inline-block w-1 h-1 rounded-full bg-zinc-500"
                                    style={{ animationDelay: "0.24s" }}
                                />
                            </span>
                        </div>
                    )}

                    <button
                        aria-label="Collapse chat"
                        onClick={() => setRightCollapsed(true)}
                        className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-zinc-600 dark:text-zinc-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M18 12H6"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* MAIN CHAT PANEL */}
            <AIChatPanel
                chat={chat}
                userInput={userInput}
                setUserInput={setUserInput}
                onSend={handleSend}
                includeCode={includeCode}
                setIncludeCode={setIncludeCode}
                includeBoard={includeBoard}
                setIncludeBoard={setIncludeBoard}
                isThinking={isThinking}
                code={code}              // Temporary (actual code is applied through context injection)
                tlEditorRef={tlEditorRef}
            />
        </div>
    );
}
