import React from 'react';
import { Link } from 'react-router-dom';
import type { Bundle } from '../types/course';

export const BundleCard: React.FC<{ bundle: Bundle }> = ({ bundle }) => (
    <Link
        to={`/bundle/${bundle.bundleId}`}
        className="group w-80 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-transform transform hover:-translate-y-1"
    >
        <div className="relative h-40 rounded-t-2xl overflow-hidden bg-gray-100">
            {bundle.imageUrl ? (
                <img src={bundle.imageUrl} alt={bundle.title} className="h-full w-full object-cover" />
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-pink-400" />
            )}
        </div>
        <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg truncate">{bundle.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{bundle.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-indigo-600">₹{bundle.price}</span>
            </div>
        </div>
    </Link>
);
