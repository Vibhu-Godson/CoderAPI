import { useState } from "react";
import Problems from "../components/Problems";
import TagsBar from "../components/TagsBar";

export default function ProblemPage() {
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [difficulty, setDifficulty] = useState<string>("All");

    return (
        <div className="min-h-screen bg-white px-8 pt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Problems
                </h1>

                {/* Difficulty Select — Right Aligned */}
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm bg-white shadow-sm hover:border-slate-400"
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* TAGS ABOVE PROBLEMS */}
            <TagsBar selected={selectedTags} onChange={setSelectedTags} />

            {/* PROBLEMS */}
            <Problems selectedTags={selectedTags} difficulty={difficulty} />
        </div>
    );
}
