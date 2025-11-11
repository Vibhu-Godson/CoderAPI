import React, { useEffect, useState } from "react";

export default function ReviewCarousel({ reviews }: { reviews: any[] }) {
    const ITEMS_PER_VIEW = 3;
    const SLIDE_INTERVAL = 2500;
    const ANIMATION_DURATION = 600; // ms

    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(false);

    const total = reviews.length;

    // Get next batch of 3 cards
    function getWindow(startIndex: number) {
        let items: any[] = [];
        for (let i = 0; i < ITEMS_PER_VIEW; i++) {
            items.push(reviews[(startIndex + i) % total]);
        }
        return items;
    }

    const currentWindow = getWindow(index);
    const nextWindow = getWindow((index + ITEMS_PER_VIEW) % total);

    useEffect(() => {
        const timer = setInterval(() => {
            // start sliding animation
            setAnimate(true);

            // when slide completes, switch to next window
            setTimeout(() => {
                setIndex((prev) => (prev + ITEMS_PER_VIEW) % total);
                setAnimate(false);
            }, ANIMATION_DURATION);

        }, SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full overflow-hidden mt-4">

            <div
                className="flex"
                style={{
                    width: "200%",
                    transform: animate ? "translateX(-50%)" : "translateX(0%)",
                    transition: `transform ${ANIMATION_DURATION}ms ease-in-out`,
                }}
            >
                {/* Current 3 cards */}
                <div className="grid grid-cols-3 gap-4 w-1/2 px-2">
                    {currentWindow.map((r, i) => (
                        <ReviewCard key={`cur-${i}`} r={r} />
                    ))}
                </div>

                {/* Next 3 cards */}
                <div className="grid grid-cols-3 gap-4 w-1/2 px-2">
                    {nextWindow.map((r, i) => (
                        <ReviewCard key={`next-${i}`} r={r} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Card Component
function ReviewCard({ r }: { r: any }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 text-sm min-h-[150px] flex flex-col">
            <div className="flex items-center gap-3">
                <img
                    src={r.image}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-semibold text-gray-800">{r.name}</p>
                    <p className="text-yellow-500">⭐ {r.rating}/5</p>
                </div>
            </div>

            <p className="text-gray-600 mt-3">{r.text}</p>
        </div>
    );
}
