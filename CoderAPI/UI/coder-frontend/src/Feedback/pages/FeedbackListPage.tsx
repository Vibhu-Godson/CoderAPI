import React from "react";
import { useGetFeedbackListQuery } from "../apis/feedbackApi";
import FeedbackListItem from "../components/FeedbackListItem";
import { Link } from "react-router-dom";


export default function FeedbackListPage() {
    const { data, isLoading } = useGetFeedbackListQuery();


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">User Feedback</h1>
                <Link
                    to="/feedback/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                    + Add Feedback
                </Link>
            </div>


            {isLoading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="bg-white rounded-xl shadow p-4 divide-y">
                    {data?.items?.map((item) => (
                        <FeedbackListItem key={item.userFeedbackId} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}