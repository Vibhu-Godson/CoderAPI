import React from "react";

export default function MissionSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                    Why AmCoder Exists
                </h2>

                <p className="text-gray-600 text-lg mb-6">
                    Most students don’t struggle because they are weak.
                    They struggle because no one gave them a mental map.
                </p>

                <p className="text-gray-600 text-lg mb-6">
                    AmCoder is built to help you understand before you memorise,
                    think before you rush, and grow without fear of being left behind.
                </p>

                <p className="text-gray-900 font-medium text-lg">
                    This is not a shortcut.  
                    This is a steady path.
                </p>
            </div>
        </section>
    );
}
