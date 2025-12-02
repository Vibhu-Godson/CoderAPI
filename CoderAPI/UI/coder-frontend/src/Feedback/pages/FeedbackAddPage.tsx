import React, { useState, useEffect } from "react";
import { useAddFeedbackMutation } from "../apis/feedbackApi";
import { useNavigate } from "react-router-dom";

export default function FeedbackAddPage() {
    const navigate = useNavigate();

    const [feedbackType, setFeedbackType] = useState("Review");
    const [feedbackText, setFeedbackText] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [rating, setRating] = useState<number | null>(null);

    const [deviceInfo, setDeviceInfo] = useState("");
    const [browserInfo, setBrowserInfo] = useState("");
    const [appVersion, setAppVersion] = useState("1.0.0");

    const [submitFeedback, { isLoading }] = useAddFeedbackMutation();

    useEffect(() => {
        setDeviceInfo(navigator.platform);
        setBrowserInfo(navigator.userAgent);
    }, []);

    function handleImageUpload(files: FileList) {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            userFeedbackId: 0,
            feedbackType,
            feedbackText,
            feedbackImages: images.length ? images.join("||") : "",
            deviceInfo,
            browserInfo,
            appVersion,
            status: "pending",
            rating,
            createdOn: new Date().toISOString()
        };

        await submitFeedback(payload).unwrap();

        alert("Feedback submitted!");
        navigate("/feedback");
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-semibold mb-4">Submit Feedback</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow space-y-4"
            >
                {/* Feedback Type */}
                <div>
                    <label className="block text-sm font-medium mb-1">Feedback Type</label>
                    <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="Review">Review</option>
                        <option value="Bug">Bug</option>
                        <option value="Suggestion">Suggestion</option>
                        <option value="UI Issue">UI Issue</option>
                        <option value="Functional Error">Functional Error</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={4}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Rating (always visible now) */}
                <div>
                    <label className="block text-sm font-medium mb-1">Your Rating</label>
                    <div className="flex gap-3 text-3xl cursor-pointer">
                        {[1, 2, 3, 4, 5].map((r) => (
                            <span
                                key={r}
                                onClick={() => setRating(r)}
                                className={`transition ${rating === r ? "scale-125" : "opacity-50"
                                    }`}
                            >
                                {["😡", "😕", "🙂", "😃", "🤩"][r - 1]}
                            </span>
                        ))}
                    </div>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload Images
                    </label>

                    <label className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                e.target.files && handleImageUpload(e.target.files)
                            }
                            className="hidden"
                        />
                        <p className="text-gray-600">Click to upload images</p>
                    </label>
                </div>

                {/* Preview Grid */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img}
                                    className="rounded-lg shadow max-h-40 object-cover"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow"
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
