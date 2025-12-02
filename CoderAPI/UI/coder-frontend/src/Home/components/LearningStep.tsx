import React from "react";

export default function LearningStep({ step, index }: any) {
    return (
        <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color}
                             flex items-center justify-center text-white shadow-lg mb-4
                             cursor-pointer hover:scale-110 transition-transform duration-200`}>
                <span className="text-2xl font-semibold">{index + 1}</span>
            </div>

            <h4 className="text-gray-900 text-center mb-2 font-medium">{step.title}</h4>
            <p className="text-sm text-gray-600 text-center">{step.description}</p>
        </div>
    );
}
