import React, { useEffect, useState } from "react";
import { fetchLearningPath } from "../api/home.api";
import LearningStep from "./LearningStep";

export default function LearningPathSection() {
    const [steps, setSteps] = useState<any[]>([]);

    useEffect(() => {
        fetchLearningPath().then(setSteps);
    }, []);

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h2 className="text-gray-900 text-3xl font-semibold mb-4">
                        The AmCoder Learning Path
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Your structured journey from beginner to expert.
                    </p>
                </div>

                <div className="relative">
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1
                                    bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200
                                    transform -translate-y-1/2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 relative">
                        {steps.map((step, idx) => (
                            <LearningStep key={step.id} step={step} index={idx} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
