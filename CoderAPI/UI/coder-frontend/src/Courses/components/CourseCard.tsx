import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types/course';

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <Link
        to={`/course/${course.courseId}`}
        className="group block w-64 shrink-0 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
    >
        <div className="relative h-36 bg-gray-200">
            {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2 font-semibold truncate">
                {course.title}
            </div>
        </div>

        <div className="p-4 space-y-1">
            <p className="text-gray-600 line-clamp-2 text-sm">{course.description}</p>
            <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-lg font-bold text-indigo-600">₹{course.price}</span>
                <span className="text-gray-500">{course.level ?? 'All Levels'}</span>
            </div>
        </div>
    </Link>
);
