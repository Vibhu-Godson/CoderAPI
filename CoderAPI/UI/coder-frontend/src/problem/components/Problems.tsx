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

export default function Problems({ selectedTags, difficulty }: { selectedTags: number[]; difficulty: string; }) {
    const [filters, setFilters] = useState({
        difficulty: difficulty,
        tags: [] as number[],
        status: ""
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
    }, [selectedTags, difficulty]);

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
        <div className="bg-white p-4 rounded-xl w-full">

            {isLoading && (
                <p className="text-slate-700 text-lg font-medium">Loading...</p>
            )}

            {/* Problem ROWS */}
            <div className="divide-y divide-gray-200">

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
                            to={`/problems/${p.problemId}-${slug}`}
                            className={`flex items-center justify-between py-3 px-4 hover:bg-gray-100 transition text-base ${rowColor}`}
                        >

                            {/* LEFT */}
                            <div className="flex items-center gap-4">
                                {getStatusIcon(p)}

                                <p className="w-10 text-slate-500">{p.problemId}.</p>

                                <span
                                    className={
                                        locked
                                            ? "text-slate-400"
                                            : "text-slate-900 hover:text-indigo-700 font-medium"
                                    }
                                >
                                    {p.problemName}
                                </span>

                                {/* TAGS */}
                                <div className="flex gap-2 ml-20">
                                    {p.tags.map((t: string, i: number) => (
                                        <span
                                            key={i}
                                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-6 pr-4">

                                <span
                                    className={
                                        p.difficultyLevel === "Easy"
                                            ? "text-emerald-600 font-medium w-12 text-right"
                                            : p.difficultyLevel === "Medium"
                                                ? "text-amber-600 font-medium w-12 text-right"
                                                : "text-red-600 font-medium w-12 text-right"
                                    }
                                >
                                    {p.difficultyLevel === "Medium" ? "Medium" : p.difficultyLevel}
                                </span>

                                <span className="text-slate-500 w-12 text-right">
                                    {p.acceptance}%
                                </span>
                            </div>

                        </Link>
                    );
                })}

            </div>

            {/* PAGINATION */}
            {(data?.totalPages ?? 0) > 1 && (
                <div className="flex justify-center items-center gap-6 mt-8">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <p className="font-medium text-slate-700">
                        Page {data?.pageNumber ?? 1} of {data?.totalPages ?? 1}
                    </p>

                    <button
                        disabled={page >= (data?.totalPages ?? 1)}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
