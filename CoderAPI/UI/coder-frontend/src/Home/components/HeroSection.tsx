import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Props {
    mousePosition: { x: number; y: number };
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function HeroSection({ mousePosition, onMouseMove }: Props) {
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50"
            onMouseMove={onMouseMove}
        >
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background:
                        "linear-gradient(135deg, #4F46E5 0%, #FFFFFF 50%, #7C3AED 100%)",
                    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                    transition: "transform 0.3s ease-out",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-block px-4 py-2 bg-white border border-indigo-200 rounded-full shadow-sm mb-6">
                        <span className="text-indigo-600">🚀 Built for Indian Coders</span>
                    </div>

                    <h1 className="text-gray-900 mb-6 text-4xl md:text-5xl font-bold leading-tight">
                        Your engineering journey, supercharged
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                        Learn, practice, and grow with India's most empowering coding
                        community. Master DSA, crack interviews, and build the future you
                        deserve.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/problems"
                            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>Start Solving Problems</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/community"
                            className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all duration-200"
                        >
                            Explore DSA Roadmap
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <div>
                            <div className="text-indigo-600 mb-1 text-xl font-bold">50K+</div>
                            <div className="text-sm text-gray-600">Active Learners</div>
                        </div>
                        <div>
                            <div className="text-indigo-600 mb-1 text-xl font-bold">1M+</div>
                            <div className="text-sm text-gray-600">Problems Solved</div>
                        </div>
                        <div>
                            <div className="text-indigo-600 mb-1 text-xl font-bold">500+</div>
                            <div className="text-sm text-gray-600">Success Stories</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
