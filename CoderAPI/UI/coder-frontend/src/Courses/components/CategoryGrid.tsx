import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types/course';

export const CategoryGrid: React.FC<{ categories: Category[] }> = ({ categories }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((c) => (
            <Link
                key={c.categoryId}
                to={`/category/${c.categoryId}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white shadow hover:shadow-lg hover:bg-indigo-50 transition"
            >
                {c.iconUrl ? (
                    <img src={c.iconUrl} alt={c.categoryName} className="h-12 w-12 object-contain" />
                ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                        {c.categoryName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="text-center text-sm font-medium">{c.categoryName}</div>
            </Link>
        ))}
    </div>
);
