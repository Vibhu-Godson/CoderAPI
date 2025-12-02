// src/features/course/pages/CoursesPage.tsx
import React, { useRef } from 'react';
import {
    useGetPopularBundlesQuery,
    useGetPopularCoursesQuery,
    useGetCategoriesQuery,
    useGetMyCoursesQuery,
} from '../courseApi';
import { CourseCard } from '../components/CourseCard';
import { BundleCard } from '../components/BundleCard';
import { CategoryGrid } from '../components/CategoryGrid';
import LoadingSpinner from '../../problem/components/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// ⚠️ FIX 1: Use Link instead of useNavigate for navigation links inside JSX
import { Link } from 'react-router-dom';

export const CoursesPage: React.FC = () => {
    // useNavigate is not strictly needed since we are using <Link>
    // const navigate = useNavigate(); // Removed, as Link is better for UI elements

    const { data: bundles, isLoading: loadingBundles } = useGetPopularBundlesQuery();
    const { data: courses, isLoading: loadingCourses } = useGetPopularCoursesQuery();
    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
    const { data: myCourses, isLoading: loadingMyCourses } = useGetMyCoursesQuery();

    const bundleRef = useRef<HTMLDivElement>(null);
    const courseRef = useRef<HTMLDivElement>(null);
    const myCourseRef = useRef<HTMLDivElement>(null); // Ref for My Courses scroll

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (!ref.current) return;
        // Scroll 300px horizontally
        const scrollAmount = 300;
        ref.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        // ⚠️ FIX 2: Removed the duplicate outer <div> wrapper that caused the error.
        <div className="p-6 space-y-10">

            {/* ======= My Courses Section ======= */}
            <section className="relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">My Courses 🚀</h2>

                {/* 1. Loading State */}
                {loadingMyCourses ? (
                    <LoadingSpinner />
                ) :

                    /* 2. Content with Courses */
                    myCourses?.items?.length ? (
                        <div className="relative">
                            <button
                                onClick={() => scroll(myCourseRef, 'left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition duration-150"
                            >
                                <ChevronLeft />
                            </button>

                            {/* Scrollable Container */}
                            <div
                                ref={myCourseRef}
                                className="flex overflow-x-scroll gap-4 pb-2 scroll-smooth no-scrollbar" // 'no-scrollbar' for better aesthetics
                            >
                                {myCourses.items.map((c) => (
                                    // This Link makes the whole card clickable and navigates to the course page
                                    <Link
                                        to={`/myCourses/${c.userCourseId}`}
                                        key={c.userCourseId}
                                        className="min-w-[250px] max-w-[300px] bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-xl transition duration-200 cursor-pointer"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                                                {c.courseName}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Progress: {c.overAllProgress}%
                                            </p>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 h-2 rounded-full mt-3 mb-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${c.overAllProgress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 mt-1 self-start">
                                            Continue Learning →
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            <button
                                onClick={() => scroll(myCourseRef, 'right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition duration-150"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    ) : (

                        /* 3. Empty State */
                        <p className="text-gray-500">You haven’t enrolled in any courses yet. Start your journey!</p>
                    )}
            </section>

            {/* --- */}

            {/* ======= Popular Bundles ======= */}
            <section className="relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Most Popular Bundles</h2>
                {loadingBundles ? (
                    <LoadingSpinner />
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => scroll(bundleRef, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition duration-150"
                        >
                            <ChevronLeft />
                        </button>
                        <div
                            ref={bundleRef}
                            className="flex overflow-x-scroll gap-4 pb-2 scroll-smooth no-scrollbar"
                        >
                            {bundles?.map((b) => (
                                <BundleCard key={b.bundleId} bundle={b} />
                            ))}
                        </div>
                        <button
                            onClick={() => scroll(bundleRef, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition duration-150"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </section>

            {/* --- */}

            {/* ======= Popular Courses ======= */}
            <section className="relative">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Popular Courses</h2>
                {loadingCourses ? (
                    <LoadingSpinner />
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => scroll(courseRef, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition duration-150"
                        >
                            <ChevronLeft />
                        </button>
                        <div
                            ref={courseRef}
                            className="flex overflow-x-scroll gap-4 pb-2 scroll-smooth no-scrollbar"
                        >
                            {courses?.map((c) => (
                                <CourseCard key={c.courseId} course={c} />
                            ))}
                        </div>
                        <button
                            onClick={() => scroll(courseRef, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition duration-150"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </section>

            {/* --- */}

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