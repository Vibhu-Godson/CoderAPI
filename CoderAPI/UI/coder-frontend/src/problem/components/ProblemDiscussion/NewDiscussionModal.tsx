import { useState } from "react";
import { useAddDiscussionMutation } from "../../problemDiscussionApi";

export default function NewDiscussionModal({ problemId, onClose }: any) {
    const [title, setTitle] = useState("");
    const [blocks, setBlocks] = useState<any[]>([
        { blockType: "text", content: "", imageUrl: "", sortOrder: 1 }
    ]);
    const [tags, setTags] = useState<string>("");

    const [addDiscussion, { isLoading }] = useAddDiscussionMutation();

    function updateBlock(i: number, key: string, val: string) {
        const clone = [...blocks];
        clone[i][key] = val;
        setBlocks(clone);
    }

    async function handleSubmit() {
        await addDiscussion({
            problemId,
            parentDiscussionId: 0,
            userSolutionId: 0,
            userProblemSessionId: 0,
            blocks,
            tags: tags.split(",").map(t => ({ tagName: t.trim() }))
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-[600px]">
                <h2 className="text-xl font-semibold mb-3">Start a Discussion</h2>

                <label className="text-sm">Title</label>
                <input
                    className="w-full border p-2 rounded mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label className="text-sm">Tags (comma-separated)</label>
                <input
                    className="w-full border p-2 rounded mb-3"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <h3 className="font-medium mb-2">Blocks</h3>

                {blocks.map((b, i) => (
                    <div key={i} className="border p-3 rounded mb-2">
                        <select
                            className="border p-1 rounded mb-2"
                            value={b.blockType}
                            onChange={(e) =>
                                updateBlock(i, "blockType", e.target.value)
                            }
                        >
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
                        </select>

                        {b.blockType === "text" && (
                            <textarea
                                className="w-full border p-2 rounded"
                                rows={3}
                                value={b.content}
                                onChange={(e) =>
                                    updateBlock(i, "content", e.target.value)
                                }
                            />
                        )}

                        {b.blockType === "image" && (
                            <input
                                placeholder="Image URL"
                                className="w-full border p-2 rounded"
                                value={b.imageUrl}
                                onChange={(e) =>
                                    updateBlock(i, "imageUrl", e.target.value)
                                }
                            />
                        )}

                        {b.blockType === "link" && (
                            <input
                                placeholder="Enter a hyperlink"
                                className="w-full border p-2 rounded"
                                value={b.content}
                                onChange={(e) =>
                                    updateBlock(i, "content", e.target.value)
                                }
                            />
                        )}
                    </div>
                ))}

                <button
                    className="text-blue-600 text-sm mt-1"
                    onClick={() =>
                        setBlocks([
                            ...blocks,
                            {
                                blockType: "text",
                                content: "",
                                imageUrl: "",
                                sortOrder: blocks.length + 1
                            }
                        ])
                    }
                >
                    + Add Block
                </button>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-3 py-1" onClick={onClose}>Cancel</button>
                    <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}
