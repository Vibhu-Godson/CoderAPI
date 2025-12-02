import { Lightbulb, X, Sparkles } from "lucide-react";
import { rdLabContent } from "../api/tribes.api";
import { useNavigate } from "react-router-dom";

export default function RDLabPage() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center px-4 py-10">
            <div className="bg-white max-w-5xl w-full rounded-2xl shadow-xl border border-gray-200 p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="w-6 h-6 text-indigo-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">R&D Lab</h2>
                            <p className="text-sm text-gray-600">Join tribes and contribute to innovation</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/community")}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tribe Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {rdLabContent.map((tribe) => (
                        <div
                            key={tribe.id}
                            className="border border-indigo-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer bg-white"
                        >
                            <div className="text-4xl mb-3">{tribe.icon}</div>

                            <h3 className="text-gray-900 text-lg font-medium mb-1">{tribe.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{tribe.description}</p>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">{tribe.members} members</span>
                            </div>

                            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Request to Join Tribe
                            </button>
                        </div>
                    ))}
                </div>

                {/* What are tribes */}
                <div className="rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                    <h4 className="text-gray-900 text-lg font-medium mb-2">What are Tribes?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                        Tribes are focused communities within AmCoder where members collaborate on specific topics.
                        To thrive in a tribe, you must contribute actively through tutorials, ideas, discussions,
                        and knowledge sharing.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="text-lg">📚</span>
                            <div>
                                <p className="text-gray-900">Learn Together</p>
                                <p className="text-gray-600">Access curated content</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <span className="text-lg">💡</span>
                            <div>
                                <p className="text-gray-900">Contribute Ideas</p>
                                <p className="text-gray-600">Share your knowledge</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <span className="text-lg">🏆</span>
                            <div>
                                <p className="text-gray-900">Earn Recognition</p>
                                <p className="text-gray-600">Build your reputation</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}