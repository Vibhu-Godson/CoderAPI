import React, { useEffect, useState } from "react";
import { fetchPlans } from "../api/home.api";
import PlanCard from "./PlanCard";

export default function PricingSection() {
    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        fetchPlans().then(setPlans);
    }, []);

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-3xl font-semibold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Start free, upgrade when you're ready. No tricks, no hidden costs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((p) => (
                        <PlanCard key={p.id} plan={p} />
                    ))}
                </div>

            </div>
        </section>
    );
}
