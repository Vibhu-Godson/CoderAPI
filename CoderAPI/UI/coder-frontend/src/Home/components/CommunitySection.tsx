import React, { useEffect, useState } from "react";
import { fetchLiveActivity } from "../api/home.api";
import LiveActivityCard from "./LiveActivityCard";
import { Users, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunitySection() {
    const [activity, setActivity] = useState<any[]>([]);

    useEffect(() => {
        fetchLiveActivity().then(setActivity);
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-3xl font-semibold mb-4">
                        A Community That Grows Together
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Not just another coding platform — a living, breathing community of learners.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                            <h3 className="text-gray-900 font-medium">Live Activity</h3>
                        </div>

                        <div className="space-y-4">
                            {activity.map((a, i) => (
                                <LiveActivityCard key={i} activity={a} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                            <Users className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-gray-900 font-semibold mb-2">Discussion Forums</h3>
                            <p className="text-gray-600 mb-4">
                                Get help, share insights, and learn from peers solving the same problems.
                            </p>
                            <Link
                                to="/community"
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                            >
                                Join Discussions <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                            <Trophy className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-gray-900 font-semibold mb-2">Weekly Contests</h3>
                            <p className="text-gray-600 mb-4">
                                Test your skills, compete with others, and climb the leaderboard.
                            </p>
                            <Link
                                to="/community"
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                            >
                                View Contests <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg"
                    >
                        <Users className="w-5 h-5" />
                        <span>Join Our Community</span>
                    </Link>
                </div>

            </div>
        </section>
    );
}
