import React from "react";
import { ArrowRight } from "lucide-react";

interface Props {
    category: {
        name: string;
        icon: string;
        problems: number;
        solved: number;
        difficulty: string;
    }
}

export default function CategoryCard({ category }: Props) {
    const percent = (category.solved / category.problems) * 100;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 
                        hover:shadow-lg hover:border-indigo-300 transition-all 
                        duration-200 cursor-pointer group">

            <div className="text-4xl mb-4">{category.icon}</div>

            <h3 className="text-gray-900 mb-2 font-semibold">{category.name}</h3>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{category.solved} solved</span>
                    <span>{category.problems} total</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 
                                   h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                    {category.difficulty}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 
                                       group-hover:text-indigo-600 
                                       group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
}
