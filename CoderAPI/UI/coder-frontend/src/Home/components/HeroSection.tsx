import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

            <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
                <div className="inline-block px-4 py-2 bg-white border border-indigo-200 rounded-full shadow-sm mb-8">
                    <span className="text-indigo-600 text-sm">
                        A calm place to begin learning for Future
                    </span>
                </div>

                <h1 className="text-gray-900 text-4xl md:text-5xl font-semibold leading-tight mb-6">
                    You don’t lack intelligence.  
                    <br />
                    <span className="text-indigo-600">You lack a clear path.</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                    You’re told to learn DSA, Web, AI, System Design —
                    but no one explains how it all fits together.
                    <br /><br />
                    AmCoder exists so you can see the long road —
                    <span className="font-medium text-gray-800"> and not feel scared by it.</span>
                </p>

                <Link
                    to="/start"
                    className="inline-flex items-center gap-2 px-8 py-4 
                               bg-gradient-to-r from-indigo-600 to-purple-600 
                               text-white rounded-xl shadow-lg hover:shadow-xl 
                               transition-all"
                >
                    Start from the beginning
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    );
}
