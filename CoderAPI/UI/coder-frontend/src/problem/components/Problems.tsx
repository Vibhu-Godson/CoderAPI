import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useGetProblemsMutation } from "../problemApi";

import {
    Lock,
    Check,
    CheckCheck,
    X,
    TimerReset,
} from "lucide-react";

interface DecodedToken {
    subscription?: string;
    exp?: number;
}

export default function Problems({ selectedTags, difficulty, searchQuery = "" }: { selectedTags: number[]; difficulty: string; searchQuery?: string; }) {
    const [filters, setFilters] = useState({
        difficulty: difficulty,
        tags: [] as number[],
        status: "",
        search: searchQuery
    });
    const [page, setPage] = useState(1);
    const [getProblems, { data, isLoading }] = useGetProblemsMutation();

    // PREMIUM CHECK
    let isPremium = false;
    const token = localStorage.getItem("authToken");
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            isPremium = decoded.subscription === "Premium";
        } catch { }
    }
    
    useEffect(() => {
        setFilters((prev) => ({ ...prev, tags: selectedTags, difficulty: difficulty }));
        setPage(1); // Reset to first page when filters change
    }, [selectedTags, difficulty]);

    useEffect(() => {
        setFilters((prev) => ({ ...prev, search: searchQuery }));
        setPage(1); // Reset to first page when search changes
    }, [searchQuery]);

    useEffect(() => {
        getProblems({
            pageNumber: page,
            pageSize: 50,
            ...filters,
        });
    }, [page, filters]);

    const getStatusIcon = (p: any) => {
        if (p.isLocked && !isPremium)
            return <Lock className="w-4 h-4 text-slate-400" />;

        switch (p.userStatus) {
            case "Accepted":
                return <Check className="w-4 h-4 text-green-600" />;
            case "Completed":
                return <CheckCheck className="w-4 h-4 text-green-600" />;
            case "WA":
                return <X className="w-4 h-4 text-orange-500" />;
            case "TLE":
                return <TimerReset className="w-4 h-4 text-indigo-500" />;
            default:
                return <span className="w-4 h-4 inline-block" />;
        }
    };
    const slugify = (text: string) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");


    return (
        <div className="bg-white p-2 sm:p-4 rounded-xl w-full">

            {isLoading && (
                <p className="text-slate-700 text-lg font-medium">Loading...</p>
            )}

            {/* Problem ROWS - Responsive */}
            <div className="divide-y divide-gray-200 overflow-x-auto">

                {data?.items?.map((p, idx) => {
                    const locked = p.isLocked && !isPremium;

                    const rowColor =
                        idx % 2 === 0
                            ? "bg-gray-50" // light gray
                            : "bg-white"; // very light yellow

                    const slug = slugify(p.problemName);
                    return (
                        <Link
                            key={p.problemId}
                            to={`/problem/${p.problemId}-${slug}`}
                            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-2 sm:px-4 hover:bg-gray-100 transition text-sm sm:text-base gap-2 sm:gap-0 ${rowColor}`}
                        >

                            {/* LEFT */}
                            <div className="flex items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto min-w-0">
                                {getStatusIcon(p)}

                                <p className="w-8 text-slate-500 flex-shrink-0">{p.problemId}.</p>

                                <span
                                    className={
                                        locked
                                            ? "text-slate-400 truncate"
                                            : "text-slate-900 hover:text-indigo-700 font-medium truncate"
                                    }
                                    title={p.problemName}
                                >
                                    {p.problemName}
                                </span>

                                {/* TAGS - Hidden on mobile, visible on larger screens */}
                                <div className="hidden lg:flex gap-2 ml-4 flex-wrap">
                                    {p.tags.slice(0, 2).map((t: string, i: number) => (
                                        <span
                                            key={i}
                                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-end">

                                <span
                                    className={
                                        p.difficultyLevel === "Easy"
                                            ? "text-emerald-600 font-medium w-12 text-right flex-shrink-0"
                                            : p.difficultyLevel === "Medium"
                                                ? "text-amber-600 font-medium w-12 text-right flex-shrink-0"
                                                : "text-red-600 font-medium w-12 text-right flex-shrink-0"
                                    }
                                >
                                    {p.difficultyLevel}
                                </span>

                                <span className="text-slate-500 w-12 text-right flex-shrink-0">
                                    {p.acceptance}%
                                </span>
                            </div>

                        </Link>
                    );
                })}

            </div>

            {/* Empty state */}
            {!isLoading && (!data?.items || data.items.length === 0) && (
                <div className="text-center py-8">
                    <p className="text-slate-500 font-medium">No problems found</p>
                </div>
            )}

            {/* PAGINATION */}
            {(data?.totalPages ?? 0) > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 w-full sm:w-auto"
                    >
                        Prev
                    </button>

                    <p className="font-medium text-slate-700 text-sm sm:text-base">
                        Page {data?.pageNumber ?? 1} of {data?.totalPages ?? 1}
                    </p>

                    <button
                        disabled={page >= (data?.totalPages ?? 1)}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40 w-full sm:w-auto"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
