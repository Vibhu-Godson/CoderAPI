import React from "react";
import AIChatPanel from "../../components/AIChatPanel";
import { ChatMessage } from "../../components/AIChatPanel/types";

type Props = {
    rightCollapsed: boolean;
    setRightCollapsed: (v: boolean) => void;
    chat: ChatMessage[];
    userInput: string;
    setUserInput: (val: string) => void;
    handleSend: (
        userMessage: string,
        includeCode: boolean,
        includeBoard: boolean,
        codeContent?: string,
        boardData?: string
    ) => void; // ✅ accepts parameters now
    includeCode: boolean;
    setIncludeCode: (v: boolean) => void;
    includeBoard: boolean;
    setIncludeBoard: (v: boolean) => void;
    isThinking?: boolean;
    code: string;              // ✅ add
    tlEditorRef: any;          // ✅ add
};

export default function RightPanel({
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
    isThinking = false,
    code,
    tlEditorRef,
}: Props) {
    if (rightCollapsed) {
        return (
            <div className="md:absolute md:right-3 md:top-3">
                <button
                    aria-label="Show chat"
                    onClick={() => setRightCollapsed(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <aside className="flex min-h-0 flex-col rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                    AI Chat
                </h3>

                <div className="flex items-center gap-2">
                    {/* Thinking indicator */}
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

                    {/* Collapse */}
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
                code={code}              // ✅ must be passed
                tlEditorRef={tlEditorRef} // ✅ must be passed
            />
        </aside>
    );
}
