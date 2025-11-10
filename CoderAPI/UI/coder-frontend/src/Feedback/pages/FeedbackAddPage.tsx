// src/feedback/pages/FeedbackAddPage.tsx
import React, { useState } from "react";
import { useAddFeedbackMutation } from "../apis/feedbackApi";

export default function FeedbackAddPage() {
    const [feedbackType, setFeedbackType] = useState("BUG");
    const [feedbackText, setFeedbackText] = useState("");
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const [submitFeedback, { isLoading }] = useAddFeedbackMutation();

    function convertToBase64(file: File) {
        const reader = new FileReader();
        reader.onload = () => setImageBase64(reader.result as string);
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await submitFeedback({ feedbackType, feedbackText, feedbackImages: imageBase64 });
        alert("Feedback submitted!");
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Submit Feedback</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Feedback Type</label>
                    <select
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="BUG">Bug</option>
                        <option value="SUGGESTION">Suggestion</option>
                        <option value="UI_ISSUE">UI Issue</option>
                        <option value="FUNCTIONAL_ERROR">Functional Error</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={4}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Attach Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && convertToBase64(e.target.files[0])}
                    />
                </div>

                {imageBase64 && (
                    <img
                        src={imageBase64}
                        alt="preview"
                        className="w-full max-h-60 rounded-lg shadow"
                    />
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow"
                >
                    {isLoading ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
}