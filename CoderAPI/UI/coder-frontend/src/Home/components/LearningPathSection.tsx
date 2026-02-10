import React from "react";

const journey = [
    {
        phase: "FOUNDATION",
        title: "Learn how Computer Science actually works",
        description:
            "Before writing code, you’ll understand where computers came from, how software evolved, and why systems are designed the way they are.",
        items: [
            "How humans became computers before machines existed",
            "What it really means to compute (Turing, steps, limits)",
            "How hardware and software were separated",
            "Why operating systems exist",
            "Why UNIX changed everything",
            "How instructions, memory, and processes work together",
        ],
    },
    {
        phase: "THINKING",
        title: "Learn to think like a problem-solver",
        description:
            "This is where fear disappears. You stop guessing and start reasoning.",
        items: [
            "How logic turns into algorithms",
            "Data Structures as tools, not topics",
            "Why arrays, stacks, queues, trees, and graphs exist",
            "How to approach problems step-by-step",
            "Why time and space matter",
            "How engineers break problems before coding",
        ],
    },
    {
        phase: "ENGINEERING CORE",
        title: "Understand the backbone of real software",
        description:
            "You’ll see how real applications are built under the hood — not toy examples.",
        items: [
            "How data is stored: memory vs disk",
            "Relational databases and schemas",
            "Why SQL still runs the world",
            "How APIs work (requests, responses, failures)",
            "Backend fundamentals and server thinking",
            "Why systems fail — and how engineers prevent it",
        ],
    },
    {
        phase: "BUILDING",
        title: "Learn how products are actually built",
        description:
            "Frontend and backend are no longer buzzwords — they become understandable systems.",
        items: [
            "How browsers think",
            "Why JavaScript changed the internet",
            "Frontend architecture and state",
            "Backend services and communication",
            "Connecting frontend, backend, and data",
            "How real features are planned and shipped",
        ],
    },
    {
        phase: "DESIGN",
        title: "Think beyond code — design systems",
        description:
            "This is where you stop being just a coder and start becoming an engineer.",
        items: [
            "Low-level design: responsibilities and boundaries",
            "High-level system design: scale, traffic, failures",
            "Why caching exists",
            "Why load balancers exist",
            "How large systems stay alive",
            "How to explain your design decisions confidently",
        ],
    },
    {
        phase: "ENGINEER’S TOOLKIT",
        title: "Learn how engineers work together",
        description:
            "Great engineers don’t work alone. They collaborate, plan, track, and improve.",
        items: [
            "Git and GitHub as thinking tools, not commands",
            "How real teams use Jira",
            "Why design starts in Figma",
            "Reading other people’s code confidently",
            "Communicating ideas clearly",
            "Being ready to sit confidently in any interview",
        ],
    },
];

export default function LearningPathSection() {
    return (
        <section className="py-28 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                        Your Journey to Becoming a Software Engineer
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        This is not a crash course.
                        <br />
                        This is a transformation of how you see computer science.
                        <br /><br />
                        You are the hero of this journey.
                        <br />
                        AmCoder is your mentor — the map that keeps you from getting lost.
                    </p>
                </div>

                {/* Journey Cards */}
                <div className="space-y-16">
                    {journey.map((phase, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Left */}
                                <div className="lg:w-1/3">
                                    <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full mb-4 text-sm font-medium">
                                        {phase.phase}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                        {phase.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {phase.description}
                                    </p>
                                </div>

                                {/* Right */}
                                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {phase.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                                        >
                                            <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full"></div>
                                            <p className="text-gray-700">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing */}
                <div className="text-center mt-24">
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        By the time you finish this journey, you won’t just know more.
                        <br />
                        You’ll <span className="font-medium text-gray-900">understand more</span>.
                        <br /><br />
                        And when you sit in front of an interviewer,
                        you won’t be trying to impress.
                        <br />
                        You’ll be calmly explaining how things work.
                    </p>
                </div>

            </div>
        </section>
    );
}
