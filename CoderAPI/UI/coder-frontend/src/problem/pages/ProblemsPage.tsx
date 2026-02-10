import { useState } from "react";
import { Search } from "lucide-react";
import Problems from "../components/Problems";
import TagsBar from "../components/TagsBar";

export default function ProblemPage() {
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [difficulty, setDifficulty] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="min-h-screen bg-white px-4 sm:px-8 pt-10 pb-10">
            {/* Header Section - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Problems
                </h1>

                {/* Difficulty Select — Right Aligned */}
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full sm:w-auto border px-3 py-2 rounded-md text-sm bg-white shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Search Bar - Mobile Responsive */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search problems by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
                    />
                </div>
            </div>

            {/* TAGS ABOVE PROBLEMS */}
            <TagsBar selected={selectedTags} onChange={setSelectedTags} />

            {/* PROBLEMS */}
            <Problems selectedTags={selectedTags} difficulty={difficulty} searchQuery={searchQuery} />
        </div>
    );
}
