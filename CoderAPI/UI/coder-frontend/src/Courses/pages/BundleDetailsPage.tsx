import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetBundleByIdQuery, useCreateBundleOrderMutation, useVerifyBundlePaymentMutation } from '../courseApi';
import  LoadingSpinner  from '../../problem/components/LoadingSpinner';
import { CourseCard } from '../components/CourseCard';
import { handleRazorpayBundlePayment } from '../../Utils/razorpayHandler';


export const BundleDetailsPage: React.FC = () => {
    const { id } = useParams();
    const bundleId = Number(id);
    const { data, isLoading } = useGetBundleByIdQuery(bundleId, { skip: !bundleId });
    const [createBundleOrder] = useCreateBundleOrderMutation();
    const [verifyBundlePayment] = useVerifyBundlePaymentMutation();

    if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;
    if (!data) return <div className="p-6">Bundle not found</div>;


    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
                <h1 className="text-3xl font-bold">{data.title}</h1>
                <p className="mt-2 text-gray-600">{data.description}</p>
                <div className="mt-4 text-2xl font-bold">₹{data.price}</div>
                <button
                    onClick={() =>
                        handleRazorpayBundlePayment(bundleId, createBundleOrder, verifyBundlePayment)
                    }
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                >
                    Buy Now
                </button>
            </div>


            <section>
                <h2 className="text-2xl font-semibold mb-3">Courses in this bundle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.courses?.map((c) => <CourseCard key={c.courseId} course={c} />)}
                </div>
            </section>
        </div>
    );
};