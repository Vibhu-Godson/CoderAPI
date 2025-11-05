// src/problem/components/UserSession/SessionChatModal.tsx
import React, { useEffect } from "react";
import { useGetChatQuery } from "../../userProblemApi";
import MessageList from "../AIChatPanel/MessageList";
import { ChatMessage } from "../AIChatPanel/types";

export default function SessionChatModal({
    userSessionId,
    onClose,
}: {
    userSessionId: number | null;
    onClose: () => void;
}) {
    const { data, isLoading } = useGetChatQuery(userSessionId!, {
        skip: !userSessionId,
    });

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!userSessionId) return null;

    // 🔧 Type-safe mapping to ChatMessage[]
    const chatMessages: ChatMessage[] =
        data?.messages?.map((m) => ({
            from: m.messageBy.toLowerCase() === "ai" ? "ai" : "user",
            text: m.messageContent ?? "",
            meta: [], // optional — MessageList supports this property
        })) ?? [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-[80%] max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="mb-4 text-xl font-semibold">Session Chat</h2>

                {isLoading ? (
                    <p className="text-zinc-500">Loading chat...</p>
                ) : (
                    <div className="max-h-[70vh] overflow-y-auto">
                        <MessageList chat={chatMessages} />
                    </div>
                )}
            </div>
        </div>
    );
}
