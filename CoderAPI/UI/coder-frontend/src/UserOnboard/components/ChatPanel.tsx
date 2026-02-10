import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";

export function ChatPanel({
    chat,
    onSend,
}: {
    chat: ChatMessage[];
    onSend: (val: string) => void;
}) {
    const [msg, setMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const send = async () => {
        if (!msg.trim()) return;
        const text = msg.trim();
        setMsg("");
        setIsLoading(true);
        try {
            await onSend(text);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="flex flex-col h-full w-full bg-white overflow-hidden"
            role="region"
            aria-label="Onboarding Chat"
            aria-live="polite"
        >
            {/* Chat History */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-slate-50"
            >
                {chat.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm md:text-base break-words ${
                                m.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none shadow-md"
                                    : "bg-slate-200 text-slate-900 rounded-bl-none shadow-sm"
                            }`}
                            role={m.role === "bot" ? "status" : undefined}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-200 px-3 sm:px-4 py-2 rounded-lg rounded-bl-none">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-1.5 sm:p-2 bg-white flex gap-1 sm:gap-2 shrink-0">
                <input
                    type="text"
                    className="flex-1 border border-slate-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Type your message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && send()}
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <button
                    onClick={send}
                    disabled={!msg.trim() || isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-colors shrink-0"
                    aria-label="Send message"
                >
                    {isLoading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}
