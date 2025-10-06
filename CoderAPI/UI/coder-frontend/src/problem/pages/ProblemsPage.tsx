import { useEffect, useState } from 'react';
import { useGetProblemsMutation } from '../problemApi';
import { Link } from 'react-router-dom';

export default function ProblemsPage() {
    const [filters, setFilters] = useState({ difficulty: '', tags: [] as number[], status: '' });
    const [page, setPage] = useState(1);
    const [getProblems, { data, isLoading }] = useGetProblemsMutation();

    useEffect(() => {
        getProblems({ pageNumber: page, pageSize: 10, ...filters });
    }, [page, filters]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Problems</h2>

            {/* Filters */}
            <div className="mb-3 row g-2">
                <div className="col-md-4">
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
                </div>

                <div className="col-md-4">
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
            </div>

            {/* Problem Table */}
            {isLoading && <div className="text-center my-4">Loading...</div>}
            {data && (
                <div className="table-responsive shadow-sm">
                    <table className="table table-hover table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Problem</th>
                                <th>Tags</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((p) => (
                                <tr key={p.problemId} className={p.isLocked ? 'opacity-50' : ''}>
                                    <td>
                                        {p.isLocked ? (
                                            <div className="d-flex align-items-center text-muted">
                                                <i className="bi bi-lock-fill me-2"></i>
                                                {p.problemName}
                                            </div>
                                        ) : (
                                            <Link to={`/problems/${p.problemId}`} className="text-decoration-none">
                                                {p.problemName}
                                            </Link>
                                        )}
                                    </td>
                                    <td>{p.tags.join(', ')}</td>
                                    <td>
                                        <span
                                            className={`badge ${p.userStatus === 'Solved'
                                                    ? 'bg-success'
                                                    : p.userStatus === 'InProgress'
                                                        ? 'bg-warning text-dark'
                                                        : 'bg-secondary'
                                                }`}
                                        >
                                            {p.userStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            {/* Pagination */}
            {data && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                        className="btn btn-outline-primary"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        &laquo; Prev
                    </button>
                    <span className="fw-semibold">
                        Page {data.pageNumber} of {data.totalPages}
                    </span>
                    <button
                        className="btn btn-outline-primary"
                        disabled={page >= data.totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next &raquo;
                    </button>
                </div>
            )}
        </div>
    );
}
