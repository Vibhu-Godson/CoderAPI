import React, { useEffect, useState } from "react";
import { fetchWorkshops } from "../api/home.api";
import WorkshopCard from "./WorkshopCard";

export default function WorkshopsSection() {
    const [workshops, setWorkshops] = useState<any[]>([]);

    useEffect(() => {
        fetchWorkshops().then(setWorkshops);
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-3xl font-semibold mb-4">
                        Workshops & Live Learning
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Learn from experts, ask questions live, and grow with your peers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {workshops.map((w) => (
                        <WorkshopCard key={w.id} workshop={w} />
                    ))}
                </div>

            </div>
        </section>
    );
}
