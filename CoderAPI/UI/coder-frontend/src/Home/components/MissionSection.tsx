import React from "react";

export default function MissionSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">

            {/* Soft background glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-[450px] h-[450px] bg-gradient-to-br 
                                from-indigo-500 to-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-br 
                                from-indigo-300 to-purple-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 text-center">

                {/* Tag */}
                <div className="inline-block px-5 py-2 bg-white border border-indigo-200 rounded-full shadow-sm mb-6">
                    <span className="text-indigo-600 font-medium">Our Mission</span>
                </div>

                {/* Heading */}
                <h2 className="text-gray-900 text-4xl sm:text-5xl font-semibold mb-6 leading-tight">
                    Empowering India's next million engineers for <span className="text-indigo-600">Viksit Bharat @2047</span>
                </h2>

                {/* Subtext */}
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
                    Computer Science and AI are reshaping the world.
                    Our mission is to ensure India doesn't just ride the wave - we lead it.
                </p>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-xl">
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        AmCoder exists for every curious mind who dreams of building, solving, creating.
                        We believe world-class engineering education should not depend on privilege,
                        postcode, or polished English - only on passion and willingness to learn.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        Coding is not just syntax. It is a medium of nation-building.
                        Every young Indian who learns algorithms, systems, AI, or problem-solving
                        becomes a contributor to a stronger, faster, future-ready Bharat.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        By 2047, India will be home to the world's largest pool of software talent.
                        AmCoder's mission is to guide, mentor, and uplift the next generation
                        so they can build the products, companies, and technologies
                        that shape a Viksit Bharat.
                    </p>

                    <p className="text-gray-600 text-lg">
                        - <span className="text-gray-900 font-medium">The AmCoder Team</span>
                    </p>
                </div>

            </div>
        </section>
    );
}
