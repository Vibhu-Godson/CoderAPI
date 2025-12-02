import { Lock, Lightbulb, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RDPanel() {
    const navigate = useNavigate();

    return (
        <aside className="w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-4">

                {/* Job Hunting */}
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <h3 className="text-gray-900">Job Hunting</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Premium job board and career resources coming soon.
                    </p>
                    <div className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">
                        Work in Progress
                    </div>
                </div>

                {/* R&D Lab */}
                <div className="bg-white border border-indigo-200 rounded-xl p-4 shadow hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-gray-900">R&D Lab</h3>
                    </div>

                    <div className="inline-block px-2 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-md mb-3">
                        <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Tribes & Contributions</span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        Join tribes focused on AI, startups, automation, and innovation.
                    </p>

                    <button
                        onClick={() => navigate("/community/lab")}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Explore Tribes
                    </button>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Active Tribes</div>

                        {["AI & ML", "Startups", "Automation"].map((t, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🔥</span>
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </aside>
    );
}
