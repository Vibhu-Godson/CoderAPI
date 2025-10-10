import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../courseApi';
import LoadingSpinner from '../../problem/components/LoadingSpinner';


export const CourseDetailsPage: React.FC = () => {
    const { id } = useParams();
    const courseId = Number(id);
    const { data, isLoading } = useGetCourseByIdQuery(courseId, { skip: !courseId });


    if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;
    if (!data) return <div className="p-6">Course not found</div>;


    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
                <h1 className="text-3xl font-bold">{data.title}</h1>
                <div className="text-sm text-gray-500">{data.durationInHours} hrs • {data.level}</div>
                <p className="mt-4 text-gray-700">{data.description}</p>


                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold">₹{data.price}</div>
                        <div className="text-sm text-gray-500">Guaranteed outcome after completing course</div>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">Buy Now</button>
                    </div>
                </div>
            </div>


            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-3">What you will learn</h2>
                <ul className="space-y-2">
                    {data?.topics?.map((t) => (
                        <li key={t.topicId} className="p-3 border rounded-md">{t.topicName} <div className="text-xs text-gray-500">{t.topicDescription}</div></li>
                    ))}
                </ul>
            </div>


            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-3">Reviews</h2>
                <div className="text-gray-500">(Use your review component here — example placeholder.)</div>
            </div>
        </div>
    );
};