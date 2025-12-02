// MySessions.tsx
import { useState } from "react";
import { useListChatsQuery } from "../userProblemApi";
import SessionChatModal from "./UserSession/SessionChatModal";

export default function MySessions({ problemId }: { problemId: number }) {
    const { data, isLoading, error } = useListChatsQuery(problemId);
    const [selectedSession, setSelectedSession] = useState<number | null>(null);

    if (isLoading) return <p className="text-zinc-500 text-sm">Loading your sessions…</p>;
    if (error) return <p className="text-red-500 text-sm">Failed to load sessions.</p>;
    if (!data?.items?.length) return <p className="text-zinc-500 text-sm">No sessions found.</p>;

    return (
        <>
            <div className="space-y-2">
                {data.items.map((session) => (
                    <div
                        key={session.userProblemSessionId}
                        className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                        onClick={() => setSelectedSession(session.userProblemSessionId)}
                    >
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Session #{session.userProblemSessionId}</span>
                            <span className="text-zinc-500">
                                {new Date(session.date).toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                            Status:{" "}
                            <span className="font-medium text-blue-600">{session.sessionStatus}</span>{" "}
                            • Duration: {session.totalDiscussionTime}
                        </div>
                    </div>
                ))}
            </div>

            {selectedSession && (
                <SessionChatModal
                    userSessionId={selectedSession}
                    onClose={() => setSelectedSession(null)}
                />
            )}
        </>
    );
}
