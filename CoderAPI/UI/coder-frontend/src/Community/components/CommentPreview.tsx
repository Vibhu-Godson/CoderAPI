import type { Comment, Post } from "../types/post.types";

export default function CommentPreview({
    comment,
    post,
}: {
    comment: Comment;
    post: Post;
}) {
    const r = comment.reactions;

    return (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                    {comment.avatar}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-lg px-3 py-2 mb-2">
                        <p className="text-sm">
                            <span className="text-gray-900 mr-2">{comment.author}</span>
                            <span className="text-gray-700">{comment.content}</span>
                        </p>
                    </div>

                    {/* Comment Reactions */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">

                        {(r.like ?? 0) > 0 && (
                            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                <span>❤️</span>
                                <span>{r.like}</span>
                            </button>
                        )}

                        {(r.insightful ?? 0) > 0 && (
                            <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
                                <span>💡</span>
                                <span>{r.insightful}</span>
                            </button>
                        )}

                        {(r.love ?? 0) > 0 && (
                            <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                                <span>😍</span>
                                <span>{r.love}</span>
                            </button>
                        )}

                        {(r.funny ?? 0) > 0 && (
                            <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                                <span>😂</span>
                                <span>{r.funny}</span>
                            </button>
                        )}

                        {(r.celebrate ?? 0) > 0 && (
                            <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                                <span>🎉</span>
                                <span>{r.celebrate}</span>
                            </button>
                        )}

                    </div>

                    <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                        View all {post.totalComments} comments
                    </button>
                </div>
            </div>
        </div>
    );
}
