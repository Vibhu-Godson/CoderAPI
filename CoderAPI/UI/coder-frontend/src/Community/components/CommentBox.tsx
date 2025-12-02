import { useState } from "react";
import type { Comment } from "../types/post.types";

export default function CommentBox({
    onAddComment,
}: {
    onAddComment: (comment: Comment) => void;
}) {
    const [text, setText] = useState("");

    function submit() {
        if (!text.trim()) return;

        onAddComment({
            author: "You",
            avatar: "Y",
            content: text,
            reactions: { like: 0 },
        });

        setText("");
    }

    return (
        <div className="border-t border-gray-200 p-4">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
            />

            <div className="flex justify-end mt-2">
                <button
                    onClick={submit}
                    className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Comment
                </button>
            </div>
        </div>
    );
}
