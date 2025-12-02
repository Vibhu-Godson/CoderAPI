import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/home.api";
import CategoryCard from "./CategoryCard";

export default function ProblemCategoriesSection() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-3xl font-semibold mb-4">
                        Your Problem-Solving Playground
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Master coding through carefully curated problems across all essential topics
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((c) => (
                        <CategoryCard key={c.name} category={c} />
                    ))}
                </div>
            </div>
        </section>
    );
}
