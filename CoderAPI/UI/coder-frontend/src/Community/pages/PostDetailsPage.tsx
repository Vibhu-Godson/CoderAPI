import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicPosts } from "../api/community.api";
import type { Post, Comment, ReactionType } from "../types/post.types";
import ReactionBar from "../components/ReactionBar";
import CommentBox from "../components/CommentBox";

export default function PostDetailsPage() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        getPublicPosts().then((posts) => {
            const found = posts.find((p) => p.id === Number(id));
            if (found) {
                setPost(found);
                setComments(found.topComment ? [found.topComment] : []);
            }
        });
    }, [id]);

    function handleReact(postId: number, type: ReactionType) {
        if (postId !== post?.id) return;

        setPost((prev) =>
            prev
                ? {
                    ...prev,
                    reactions: {
                        ...prev.reactions,
                        [type]: (prev.reactions[type] ?? 0) + 1,
                    },
                }
                : null
        );
    }

    function addComment(c: Comment) {
        setComments((prev) => [c, ...prev]);
    }

    if (!post) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-6">
            <Link to="/community" className="text-indigo-600 hover:underline">
                ← Back to feed
            </Link>

            {/* Full post */}
            <div className="bg-white rounded-xl p-6 shadow">

                <h2 className="text-xl font-semibold mb-2">{post.author}</h2>

                <p className="text-gray-700 whitespace-pre-wrap mb-3">
                    {post.content}
                </p>

                {post.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.media.map((m, idx) => (
                            <img key={idx} src={m} className="rounded-lg" />
                        ))}
                    </div>
                )}

                <ReactionBar
                    post={post}
                    onReact={handleReact}
                    onCommentClick={() => {
                        // Scroll to comments
                        const el = document.getElementById("comments-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                />


                <h3 className="text-lg font-medium mt-6 mb-2">Comments</h3>

                {comments.map((c, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded-lg mb-2">
                        <span className="font-medium text-gray-900">{c.author}</span>{" "}
                        {c.content}
                    </div>
                ))}

                <CommentBox onAddComment={addComment} />
            </div>
        </div>
    );
}
