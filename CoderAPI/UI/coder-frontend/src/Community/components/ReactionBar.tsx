import { useState, useRef } from "react";
import { Heart, MessageCircle, Lightbulb, PartyPopper } from "lucide-react";
import type { Post, ReactionType } from "../types/post.types";

export default function ReactionBar({
    post,
    onReact,
    onCommentClick,
}: {
    post: Post;
    onReact: (id: number, type: ReactionType) => void;
    onCommentClick: () => void;
}) {
    const r = post.reactions;

    const totalReactions = Object.values(r).reduce(
        (a: number, b: number | undefined) => a + (b ?? 0),
        0
    );

    // smoother hover menu
    const [pickerOpen, setPickerOpen] = useState(false);
    const hideTimeout = useRef<any>(null);

    function openPicker() {
        clearTimeout(hideTimeout.current);
        setPickerOpen(true);
    }

    function closePicker() {
        hideTimeout.current = setTimeout(() => setPickerOpen(false), 180);
    }

    const reactionList: { type: ReactionType; icon: string }[] = [
        { type: "like", icon: "❤️" },
        { type: "love", icon: "😍" },
        { type: "insightful", icon: "💡" },
        { type: "celebrate", icon: "🎉" },
        { type: "funny", icon: "😂" },
    ];

    return (
        <div className="px-4 pb-3 border-t border-gray-100">

            {/* Summary */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        {(r.like ?? 0) > 0 && <div className="w-6 h-6 bg-red-500 text-xs border-white border-2 rounded-full flex items-center justify-center">❤️</div>}
                        {(r.love ?? 0) > 0 && <div className="w-6 h-6 bg-pink-500 text-xs border-white border-2 rounded-full flex items-center justify-center">😍</div>}
                        {(r.insightful ?? 0) > 0 && <div className="w-6 h-6 bg-yellow-500 text-xs border-white border-2 rounded-full flex items-center justify-center">💡</div>}
                        {(r.celebrate ?? 0) > 0 && <div className="w-6 h-6 bg-purple-500 text-xs border-white border-2 rounded-full flex items-center justify-center">🎉</div>}
                        {(r.funny ?? 0) > 0 && <div className="w-6 h-6 bg-orange-500 text-xs border-white border-2 rounded-full flex items-center justify-center">😂</div>}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">{totalReactions}</span>
                </div>

                <button
                    onClick={onCommentClick}
                    className="text-sm text-gray-600 hover:text-indigo-600"
                >
                    {post.totalComments} comments
                </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-around border-t border-gray-100 pt-3">

                {/* LIKE WITH SMOOTH HOVER PICKER */}
                <div
                    className="relative"
                    onMouseEnter={openPicker}
                    onMouseLeave={closePicker}
                >
                    {/* Click to like normally */}
                    <button
                        onClick={() => onReact(post.id, "like")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-red-500"
                    >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">Like</span>
                    </button>

                    {/* POPUP */}
                    {pickerOpen && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-white shadow-xl rounded-full flex gap-2 z-50">

                            {reactionList.map((r) => (
                                <span
                                    key={r.type}
                                    onClick={() => onReact(post.id, r.type)}
                                    className="text-2xl cursor-pointer hover:scale-125 transition-transform"
                                >
                                    {r.icon}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onCommentClick}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-600 hover:text-indigo-500"
                >
                    <MessageCircle className="w-5 h-5" />
                    Comment
                </button>
            </div>
        </div>
    );
}
