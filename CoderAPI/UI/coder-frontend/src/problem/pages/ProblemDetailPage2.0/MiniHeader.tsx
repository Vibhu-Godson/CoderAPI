import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

function getInitials(name?: string | null) {
    if (!name) return "U";
    const parts = name.trim().split(/\s+|_/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

interface MiniHeaderProps {
    problemName?: string;
    onBack?: () => void;
}

export default function MiniHeader({ problemName, onBack }: MiniHeaderProps) {
    const userName = useSelector((s: any) => s.auth?.userName);
    const avatar = useSelector((s: any) => s.auth?.profileImageBase64);

    return (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-full mx-auto px-4 py-2 flex items-center justify-between gap-4">
                {/* Left: Logo and Back button */}
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        onClick={onBack}
                        className="p-1 hover:bg-slate-100 rounded transition flex-shrink-0"
                        title="Go back"
                    >
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <Link
                        to="/"
                        className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap flex-shrink-0"
                    >
                        AmCoder
                    </Link>
                    {problemName && (
                        <span className="text-slate-600 text-sm truncate">
                            / {problemName}
                        </span>
                    )}
                </div>

                {/* Right: User info */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {avatar ? (
                        <img
                            src={`data:image/*;base64,${avatar}`}
                            className="w-7 h-7 rounded-full object-cover"
                            alt="Avatar"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white grid place-items-center font-semibold text-xs">
                            {getInitials(userName)}
                        </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                        {userName}
                    </span>
                </div>
            </div>
        </div>
    );
}
