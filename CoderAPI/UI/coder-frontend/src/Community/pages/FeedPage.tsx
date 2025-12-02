import { useEffect, useState } from "react";
import WorkshopsPanel from "../components/WorkshopsPanel";
import RDPanel from "../components/RDPanel";
import PostCard from "../components/PostCard";
import CreatePostFAB from "../components/CreatePostFAB";
import { getPublicPosts } from "../api/community.api";
import { getWorkshops } from "../api/workshops.api";
import type { Post } from "../types/post.types";
import type { Workshop } from "../types/workshop.types";
import type { ReactionType } from "../types/post.types";

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [workshops, setWorkshops] = useState<Workshop[]>([]);

    useEffect(() => {
        getPublicPosts().then(setPosts);
        getWorkshops().then(setWorkshops);
    }, []);

    function handleReaction(postId: number, type: ReactionType) {
        setPosts(prev =>
            prev.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        reactions: {
                            ...p.reactions,
                            [type]: (p.reactions[type] ?? 0) + 1,
                        },
                    }
                    : p
            )
        );
    }

    return (
        <div className="max-w-[2000px] mx-auto px-10 lg:px-20 py-12">
            <div className="grid grid-cols-[250px_1fr_300px] gap-10">

                {/* LEFT PANEL */}
                <div>
                    <WorkshopsPanel workshops={workshops} />
                </div>

                {/* CENTER FEED */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-2xl mx-auto space-y-6">

                        <h2 className="text-gray-900">Public Space</h2>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                            <p className="text-indigo-700 text-sm">
                                💡 Tip: Use <span className="bg-white px-1">#hashtags</span> and <span className="bg-white px-1">@mentions</span> to connect
                            </p>
                        </div>

                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} onReact={handleReaction} />
                        ))}

                    </div>
                </main>

                {/* RIGHT PANEL */}
                <div>
                    <RDPanel />
                </div>

                <CreatePostFAB />

            </div>
        </div>
    );
}
