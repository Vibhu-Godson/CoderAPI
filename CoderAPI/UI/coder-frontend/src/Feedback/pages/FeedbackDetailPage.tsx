import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFeedbackDetailQuery } from "../apis/feedbackApi";

export default function FeedbackDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const feedbackId = Number(id);

    const { data, isLoading } = useGetFeedbackDetailQuery(feedbackId);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
            >
                ← Back
            </button>

            {isLoading ? (
                <p className="text-gray-500">Loading...</p>
            ) : (
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">{data?.feedbackType}</h2>
                    <p className="text-gray-700 whitespace-pre-line">{data?.feedbackText}</p>

                    {data?.rating && (
                        <p className="text-lg mt-2">⭐ {data.rating}/5</p>
                    )}

                    {data?.feedbackImages?.length ? (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {data.feedbackImages.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt="attachment"
                                    className="rounded-lg shadow max-h-80 object-cover"
                                />
                            ))}
                        </div>
                    ) : null}

                    <div className="text-sm text-gray-500 pt-4 border-t">
                        <p>Device: {data?.deviceInfo}</p>
                        <p>Browser: {data?.browserInfo}</p>
                        <p>App Version: {data?.appVersion}</p>
                        <p className="mt-2">Created On: {new Date(data?.createdOn || "").toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
