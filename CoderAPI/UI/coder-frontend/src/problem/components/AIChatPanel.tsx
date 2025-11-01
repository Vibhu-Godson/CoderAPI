// src/problem/components/AIChatPanel.tsx
import React, { useEffect, useRef } from "react";

interface ChatMessage {
    from: "ai" | "user";
    text: string;
    meta?: string[];
}

interface Props {
    chat: ChatMessage[];
    userInput: string;
    setUserInput: (val: string) => void;
    onSend: () => void;

    includeCode: boolean;
    setIncludeCode: (v: boolean) => void;
    includeBoard: boolean;
    setIncludeBoard: (v: boolean) => void;
}

export default function AIChatPanel({
    chat,
    userInput,
    setUserInput,
    onSend,
    includeCode,
    setIncludeCode,
    includeBoard,
    setIncludeBoard,
}: Props) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [chat]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Messages */}
            <div
                ref={listRef}
                className="min-h-0 flex-1 overflow-y-auto px-1 scrollbar-hide"
            >
                <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
                    {chat.map((m, idx) => {
                        const isAI = m.from === "ai";
                        return (
                            <div key={idx} className={`w-full ${isAI ? "" : "flex flex-col items-end"}`}>
                                {/* context badges (only for user, above bubble) */}
                                {!isAI && m.meta && m.meta.length > 0 && (
                                    <div className="mb-1 flex flex-wrap gap-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                                        {m.meta.map((tag, i) => (
                                            <span key={i} className="rounded-full border border-zinc-300 px-2 py-0.5 dark:border-zinc-600">
                                                {tag} attached
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* message bubbles */}
                                {isAI ? (
                                    // AI: full-width, no visible box (just clean text)
                                    <div className="w-full whitespace-pre-wrap break-words text-[15px] leading-7 text-zinc-900 dark:text-zinc-100">
                                        {m.text}
                                    </div>
                                ) : (
                                    // User: right-aligned blue bubble
                                    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white">
                                        {m.text}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Composer */}
            <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-end gap-2">
                    {/* LEFT: Context toggles */}
                    <div className="flex shrink-0 flex-col gap-2">
                        <TogglePill label="Code" active={includeCode} onClick={() => setIncludeCode(!includeCode)} />
                        <TogglePill label="Whiteboard" active={includeBoard} onClick={() => setIncludeBoard(!includeBoard)} />
                    </div>

                    {/* Textarea */}
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question… (Enter to send, Shift+Enter for newline)"
                        className="max-h-36 min-h-[44px] w-full resize-none rounded-md bg-white/60 px-3 py-2 text-sm text-zinc-900 outline-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900/60 dark:text-zinc-100 dark:ring-zinc-700 scrollbar-hide"
                    />

                    {/* Send */}
                    <button
                        onClick={onSend}
                        disabled={!userInput.trim()}
                        className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition enabled:hover:bg-blue-700 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

function TogglePill({
    label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${active
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
        >
            {label}
        </button>
    );
}
