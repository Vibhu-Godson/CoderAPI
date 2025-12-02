import React from "react";

export default function WorkshopCard({ workshop }: any) {
    const type = workshop.type;

    const badgeColor =
        type === "live"
            ? "bg-indigo-500"
            : type === "upcoming"
                ? "bg-purple-500"
                : "bg-gray-500";

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[180px]">

            <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${badgeColor}`}></div>
                <span className="text-sm text-gray-600">{workshop.time}</span>
            </div>

            <h3 className="text-gray-900 font-semibold mb-2">{workshop.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{workshop.description}</p>

            <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                {workshop.type === "live" ? "Join Now" : workshop.type === "upcoming" ? "Register" : "Browse Library"}
            </button>
        </div>
    );
}
