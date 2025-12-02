// src/problem/components/AIChatPanel/MessageList.tsx
import React from "react";
import { ChatMessage } from "./types";
import RichRenderer from "./RichRenderer";

export default function MessageList({
    chat,
    isThinking,
}: { chat: ChatMessage[]; isThinking?: boolean }) {
    return (
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4 py-2">
            {chat.map((m, idx) => {
                const isAI = m.from === "ai";
                return (
                    <div key={idx} className={`w-full ${isAI ? "" : "flex flex-col items-end"}`}>
                        {!isAI && m.meta?.length ? (
                            <div className="mb-1 flex flex-wrap gap-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                                {m.meta.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full border border-zinc-300 px-2 py-0.5 dark:border-zinc-600"
                                    >
                                        {tag} attached
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {isAI ? (
                            <div className="w-full whitespace-pre-wrap break-words text-[15px] leading-7 text-zinc-900 dark:text-zinc-100">
                                <RichRenderer text={m.text} />
                            </div>
                        ) : (
                            <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white shadow-sm">
                                {m.text}
                            </div>
                        )}
                    </div>
                );
            })}

            {isThinking && (
                <div className="w-full text-zinc-500 dark:text-zinc-400">
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 50 50">
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray="31.4 31.4"
                            />
                        </svg>
                        <div className="text-sm">Thinking…</div>
                    </div>
                </div>
            )}
        </div>
    );
}
