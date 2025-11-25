import { useState } from "react";
import {
    useGetDiscussionListQuery,
    useAddDiscussionMutation,
} from "../../problemDiscussionApi";

import DiscussionThread from "./DiscussionThread";
import NewDiscussionModal from "./NewDiscussionModal";

export default function ProblemDiscussion({ problemId, openDiscussionModal }: { problemId: number; openDiscussionModal: () => void; }) {
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading } = useGetDiscussionListQuery({
        problemId,
        pageNumber: page,
        pageSize: 10,
    });

    if (isLoading)
        return <div className="p-4 text-zinc-500">Loading discussions…</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Discussions</h2>
                <button
                    className="bg-blue-600 text-white px-3 py-1 rounded-md"
                    onClick={openDiscussionModal}
                >
                    Start Discussion
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 space-y-4">
                {data?.items?.map((d: any) => (
                    <DiscussionThread key={d.problemDiscussionId} thread={d} />
                ))}

                {data?.items?.length === 0 && (
                    <p className="text-zinc-500 text-center">No discussions yet.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 py-2">
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Prev
                </button>
                <button
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
                    disabled={page === data?.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {isModalOpen && (
                <NewDiscussionModal
                    problemId={problemId}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
