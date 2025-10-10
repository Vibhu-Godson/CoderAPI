// src/features/course/pages/CoursesPage.tsx
import React, { useRef } from 'react';
import {
    useGetPopularBundlesQuery,
    useGetPopularCoursesQuery,
    useGetCategoriesQuery,
} from '../courseApi';
import { CourseCard } from '../components/CourseCard';
import { BundleCard } from '../components/BundleCard';
import { CategoryGrid } from '../components/CategoryGrid';
import LoadingSpinner from '../../problem/components/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CoursesPage: React.FC = () => {
    const { data: bundles, isLoading: loadingBundles } = useGetPopularBundlesQuery();
    const { data: courses, isLoading: loadingCourses } = useGetPopularCoursesQuery();
    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();

    const bundleRef = useRef<HTMLDivElement>(null);
    const courseRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (!ref.current) return;
        const scrollAmount = 300;
        ref.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="p-6 space-y-10">
            {/* ======= Popular Bundles ======= */}
            <section className="relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Most Popular Bundles</h2>
                {loadingBundles ? (
                    <LoadingSpinner />
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => scroll(bundleRef, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100"
                        >
                            <ChevronLeft />
                        </button>
                        <div
                            ref={bundleRef}
                            className="flex overflow-x-hidden gap-4 pb-2 scroll-smooth"
                        >
                            {bundles?.map((b) => (
                                <BundleCard key={b.bundleId} bundle={b} />
                            ))}
                        </div>
                        <button
                            onClick={() => scroll(bundleRef, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </section>

            {/* ======= Popular Courses ======= */}
            <section className="relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular Courses</h2>
                {loadingCourses ? (
                    <LoadingSpinner />
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => scroll(courseRef, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100"
                        >
                            <ChevronLeft />
                        </button>
                        <div
                            ref={courseRef}
                            className="flex overflow-x-hidden gap-4 pb-2 scroll-smooth"
                        >
                            {courses?.map((c) => (
                                <CourseCard key={c.courseId} course={c} />
                            ))}
                        </div>
                        <button
                            onClick={() => scroll(courseRef, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </section>

            {/* ======= Categories ======= */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
                {loadingCategories ? (
                    <LoadingSpinner />
                ) : (
                    <CategoryGrid categories={categories || []} />
                )}
            </section>
        </div>
    );
};
