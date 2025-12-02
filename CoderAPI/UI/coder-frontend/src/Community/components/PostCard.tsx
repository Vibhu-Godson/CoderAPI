import { useState } from "react";
import { Link } from "react-router-dom";
import type { Post, ReactionType, Comment } from "../types/post.types";
import ReactionBar from "./ReactionBar";
import CommentPreview from "./CommentPreview";
import CommentBox from "./CommentBox";

export default function PostCard({
    post,
    onReact,
}: {
    post: Post;
    onReact: (id: number, type: ReactionType) => void;
}) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>(
        post.topComment ? [post.topComment] : []
    );

    function addComment(newComment: Comment) {
        setComments((prev) => [newComment, ...prev]);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">

            {/* CLICKABLE POST CONTENT */}
            <Link to={`/community/post/${post.id}`}>
                <div className="p-4 pb-3 cursor-pointer hover:bg-gray-50">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                            {post.avatar}
                        </div>
                        <div>
                            <p className="text-gray-900">{post.author}</p>
                            <p className="text-sm text-gray-500">{post.time}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-3">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {post.content.split(" ").map((word, idx) => {
                                if (word.startsWith("#"))
                                    return (
                                        <span key={idx} className="text-indigo-600 cursor-pointer font-medium">
                                            {word + " "}
                                        </span>
                                    );

                                if (word.startsWith("@"))
                                    return (
                                        <span
                                            key={idx}
                                            className="text-indigo-600 cursor-pointer font-medium bg-indigo-50 px-1 rounded"
                                        >
                                            {word + " "}
                                        </span>
                                    );

                                return <span key={idx}>{word + " "}</span>;
                            })}
                        </p>
                    </div>

                    {/* Media */}
                    {post.media.length > 0 && (
                        <div className="mt-3">
                            <div className={`grid gap-2 ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                {post.media.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt="post media"
                                        className="rounded-lg cursor-pointer hover:opacity-90"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            {/* Reactions */}
            <ReactionBar
                post={post}
                onReact={onReact}
                onCommentClick={() => setShowComments(true)}
            />

            {/* COMMENT PREVIEW */}
            {post.topComment && !showComments && (
                <CommentPreview comment={post.topComment} post={post} />
            )}

            {/* TOGGLE COMMENT SECTION */}
            <button
                onClick={() => setShowComments((v) => !v)}
                className="text-indigo-600 text-sm px-4 pb-3 hover:underline"
            >
                {showComments ? "Hide comments" : "View comments"}
            </button>

            {/* COMMENT LIST */}
            {showComments && (
                <div className="px-4 pb-3 space-y-3">
                    {comments.map((c, i) => (
                        <div key={i} className="bg-gray-50 p-2 rounded-lg">
                            <span className="font-medium text-gray-900">{c.author}</span>
                            <span className="ml-2 text-gray-700">{c.content}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* COMMENT BOX */}
            {showComments && <CommentBox onAddComment={addComment} />}
        </div>
    );
}
