import React from "react";

export default function PlanCard({ plan }: any) {
    const highlight = plan.highlight;

    return (
        <div className={
            highlight
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-xl transform scale-105"
                : "bg-white border-2 border-gray-200 rounded-xl p-8"
        }>
            {highlight && (
                <div className="inline-block px-3 py-1 bg-white text-indigo-600 rounded-full text-sm mb-4">
                    Most Popular
                </div>
            )}

            <h3 className={highlight ? "mb-2 text-white" : "text-gray-900 mb-2"}>{plan.name}</h3>

            <div className="mb-6">
                <span className={highlight ? "text-white text-3xl" : "text-gray-900 text-3xl"}>
                    ₹{plan.price}
                </span>
                <span className={highlight ? "opacity-90" : "text-gray-600"}>/month</span>
            </div>

            <ul className="space-y-3 mb-8">
                {plan.features.map((f: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className={highlight ? "text-white" : "text-gray-700"}>✔</span>
                        <span className={highlight ? "text-white" : "text-gray-700"}>{f}</span>
                    </li>
                ))}
            </ul>

            <button className={
                highlight
                    ? "w-full py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition"
                    : "w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            }>
                {plan.highlight ? "Upgrade to Pro" : plan.name === "Mentor+" ? "Contact" : "Get Started"}
            </button>
        </div>
    );
}
