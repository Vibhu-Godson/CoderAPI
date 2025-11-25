import { useState, useEffect } from "react";

export default function StepMotivation({
    initial,
    onSubmit,
    onBack,
    isSaving,
}: {
    initial?: string;
    onSubmit: (val: string) => void;
    onBack?: () => void;
    isSaving?: boolean;
}) {
    const [value, setValue] = useState(initial || "");

    // 🔥 AUTO-FILL FIX
    useEffect(() => {
        if (initial !== undefined) {
            setValue(initial || "");
        }
    }, [initial]);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">What’s driving you right now?</h3>

            <textarea
                className="w-full border rounded-xl px-3 py-2"
                rows={4}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Tell us in a few lines..."
            />

            <div className="flex gap-3 mt-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-xl bg-gray-300"
                    >
                        Back
                    </button>
                )}

                <button
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
                    onClick={() => onSubmit(value)}
                    disabled={!value.trim()}
                >
                    {isSaving ? "Saving..." : "Finish"}
                </button>
            </div>
        </div>
    );
}
