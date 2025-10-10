import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../problem/components/LoadingSpinner";
import { jwtDecode } from "jwt-decode";
import { useGetProblemsMutation } from "../problemApi";

interface DecodedToken {
    subscription?: string;
    exp?: number;
}

export default function ProblemsPage() {
    const [filters, setFilters] = useState({ difficulty: "", tags: [] as number[], status: "" });
    const [page, setPage] = useState(1);
    const [getProblems, { data, isLoading }] = useGetProblemsMutation();

    // Decode JWT to check subscription
    const token = localStorage.getItem("authToken");
    let isPremium = false;
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            isPremium = decoded.subscription === "Premium";
        } catch { }
    }

    useEffect(() => {
        getProblems({ pageNumber: page, pageSize: 20, ...filters });
    }, [page, filters]);

    return (
        <div className="container mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">Problems</h2>

            {/* Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
                <select
                    className="form-select"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Status</option>
                    <option value="NotStarted">Not Started</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Solved">Solved</option>
                </select>
            </div>

            {/* Table */}
            {isLoading && <div className="text-center my-4"><LoadingSpinner/></div>}

            {data && (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-200 shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Locked</th>
                                <th className="px-4 py-2 border">Problem Name</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Difficulty</th>
                                <th className="px-4 py-2 border">Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((p) => {
                                const isLocked = p.isLocked && !isPremium;
                                return (
                                    <tr
                                        key={p.problemId}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-4 py-2 border">{p.problemId}</td>
                                        <td className="px-4 py-2 border text-center">{isLocked ? "🔒" : "🔓"}</td>
                                        <td className="px-4 py-2 border">
                                            {isLocked ? (
                                                <span className="text-gray-400">{p.problemName}</span>
                                            ) : (
                                                <Link
                                                    to={`/problems/${p.problemId}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {p.problemName}
                                                </Link>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <span
                                                className={`px-2 py-1 rounded text-sm ${p.userStatus === "Solved"
                                                        ? "bg-green-200 text-green-800"
                                                        : p.userStatus === "InProgress"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                {p.userStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <span
                                                className={`px-2 py-1 rounded text-sm ${p.difficultyLevel === "Easy"
                                                        ? "bg-green-200 text-green-800"
                                                        : p.difficultyLevel === "Medium"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : "bg-red-200 text-red-800"
                                                    }`}
                                            >
                                                {p.difficultyLevel}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border">{p.tags.join(", ")}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="btn btn-outline-primary px-4 py-2 rounded"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            &laquo; Prev
                        </button>
                        <span className="font-semibold">
                            Page {data.pageNumber} of {data.totalPages}
                        </span>
                        <button
                            className="btn btn-outline-primary px-4 py-2 rounded"
                            disabled={page >= data.totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next &raquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
