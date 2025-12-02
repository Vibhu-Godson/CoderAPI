import React, { useEffect, useRef, useState } from "react";
import { fetchSuccessStories } from "../api/home.api";
import StoryCard from "./StoryCard";

export default function SuccessStoriesSection() {
    const [stories, setStories] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSuccessStories().then(setStories);
    }, []);

    const scrollAmount = 360; // width of one card + gap

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-20 bg-white relative">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-3xl font-semibold mb-4">
                        Real People, Real Transformations
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Stories that inspire us to keep building and supporting.
                    </p>
                </div>

                {/* Buttons */}
                <button
                    onClick={scrollLeft}
                    className="
                        absolute left-2 top-1/2 -translate-y-1/2 
                        bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center
                        hover:bg-gray-100 transition
                        z-20 border
                    "
                >
                    ←
                </button>

                <button
                    onClick={scrollRight}
                    className="
                        absolute right-2 top-1/2 -translate-y-1/2 
                        bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center
                        hover:bg-gray-100 transition
                        z-20 border
                    "
                >
                    →
                </button>

                {/* Carousel container */}
                <div
                    ref={containerRef}
                    className="
                        flex gap-6 overflow-hidden scroll-smooth
                        no-scrollbar
                    "
                >
                    {stories.map((s, idx) => (
                        <div
                            key={idx}
                            className="min-w-[330px] h-[260px] flex-shrink-0"
                        >
                            <StoryCard story={s} fixed />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
