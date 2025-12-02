import { useGetAllTagsQuery } from "../tagApi";
import { useState } from "react";

interface TagsBarProps {
    selected: number[];
    onChange: (tags: number[]) => void;
}

export default function TagsBar({ selected, onChange }: TagsBarProps) {
    const { data, isLoading } = useGetAllTagsQuery();
    const [showFull, setShowFull] = useState(false);

    if (isLoading) return <p className="text-slate-600 mb-4">Loading tags...</p>;

    // Sort by descending question count
    const sortedTags = [...(data?.items ?? [])].sort(
        (a, b) => b.totalQuestions - a.totalQuestions
    );

    // Show first 8 if small list
    const visibleTags = showFull ? sortedTags : sortedTags.slice(0, 8);

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-3">
                {visibleTags.map((tag) => {
                    const active = selected.includes(tag.tagId);

                    return (
                        <button
                            key={tag.tagId}
                            onClick={() =>
                                active
                                    ? onChange(selected.filter((t) => t !== tag.tagId))
                                    : onChange([...selected, tag.tagId])
                            }
                            className={`
                                px-3 py-1 rounded-full text-sm border transition shadow-sm
                                ${active
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                    : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                                }
                            `}
                        >
                            {tag.tagName}
                            <span className="ml-1 text-xs text-slate-500">
                                ({tag.totalQuestions})
                            </span>
                        </button>
                    );
                })}

                {/* Show Full / Less Button */}
                {sortedTags.length > 8 && (
                    <button
                        onClick={() => setShowFull(!showFull)}
                        className="px-3 py-1 rounded-full text-sm border border-slate-300 bg-white hover:bg-slate-100 shadow-sm"
                    >
                        {showFull ? "Show Less" : "Show All"}
                    </button>
                )}
            </div>
        </div>
    );
}
