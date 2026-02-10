import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Target, TrendingUp, Brain } from "lucide-react";

const motivationCards = [
    {
        icon: <Brain className="h-8 w-8 text-blue-600" />,
        title: "Problem Solving is a Skill",
        desc: "Every problem you solve rewires your brain. Master patterns, develop intuition, and unlock the ability to tackle any challenge."
    },
    {
        icon: <Target className="h-8 w-8 text-green-600" />,
        title: "Code is Secondary",
        desc: "The real skill isn't syntax—it's breaking down problems, thinking algorithmically, and seeing through complexity."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
        title: "Progress Over Perfection",
        desc: "Each problem you attempt builds your muscle memory. Struggle is the path. Growth is exponential."
    },
    {
        icon: <Zap className="h-8 w-8 text-amber-600" />,
        title: "From Student to Engineer",
        desc: "Problem solvers become engineers. Engineers build the future. Start solving, start building."
    },
];

export default function StartPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/Problems");
        }, 10000); // Auto-navigate after 10 seconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Your Journey Starts Here
                    </h1>

                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-4">
                        You're not here to memorize syntax or copy solutions.
                        <br />
                        You're here to become a <span className="font-semibold text-blue-600">problem solver</span>.
                    </p>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
                        Every problem you solve is a building block. Every struggle is a lesson. Every solution is a pattern you own forever.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate("/Problems")}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                    >
                        Start Solving Problems
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>

                    <p className="text-sm text-gray-500 mt-4">
                        (Auto-redirecting in 10 seconds...)
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {motivationCards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition"
                        >
                            <div className="mb-4">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {card.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Philosophy Section */}
                <div className="bg-white border-2 border-blue-200 rounded-xl p-10 mb-12 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        What You'll Experience
                    </h2>

                    <div className="space-y-4 text-gray-700">
                        <p>
                            <span className="font-semibold text-blue-600">🎯 Curated Problems:</span> Each problem is designed to teach you a pattern or concept. Not busywork.
                        </p>
                        <p>
                            <span className="font-semibold text-blue-600">💡 AI-Powered Analysis:</span> Get insights on your approach. Understand not just what works, but why.
                        </p>
                        <p>
                            <span className="font-semibold text-blue-600">📈 Skill Progression:</span> Track your growth. See patterns emerge. Feel yourself level up.
                        </p>
                        <p>
                            <span className="font-semibold text-blue-600">🚀 From Theory to Practice:</span> Understand the fundamentals. Apply them. Solve real problems.
                        </p>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                    <p className="text-gray-600 mb-6">
                        The best time to solve your first problem was yesterday.
                        <br />
                        The second best time is right now.
                    </p>
                    <button
                        onClick={() => navigate("/Problems")}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        Let's Go
                    </button>
                </div>
            </div>
        </div>
    );
}
