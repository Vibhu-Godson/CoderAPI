// src/features/course/pages/CategoryCoursesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCoursesByCategoryQuery } from '../courseApi';
import { CourseCard } from '../components/CourseCard';
import LoadingSpinner from '../../problem/components/LoadingSpinner';

export const CategoryCoursesPage: React.FC = () => {
    const { id } = useParams();
    const categoryId = Number(id);
    const { data: courses, isLoading } = useGetCoursesByCategoryQuery(categoryId, { skip: !categoryId });

    if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;
    if (!courses?.length) return <div className="p-6">No courses found for this category.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courses.map((c) => (
                    <CourseCard key={c.courseId} course={c} />
                ))}
            </div>
        </div>
    );
};
