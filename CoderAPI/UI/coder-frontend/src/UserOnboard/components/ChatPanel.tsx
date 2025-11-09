import { useState } from "react";
import { ChatMessage } from "../types";

export function ChatPanel({
    chat,
    onSend,
}: {
    chat: ChatMessage[];
    onSend: (val: string) => void;
}) {
    const [msg, setMsg] = useState("");

    const send = () => {
        if (!msg.trim()) return;
        onSend(msg.trim());
        setMsg("");
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.map((m) => (
                    <div
                        key={m.id}
                        className={`max-w-[80%] p-3 rounded-xl ${m.role === "user"
                                ? "ml-auto bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        {m.text}
                    </div>
                ))}
            </div>

            <div className="border-t p-2 flex gap-2">
                <input
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button
                    onClick={send}
                    className="bg-blue-600 text-white px-4 rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
