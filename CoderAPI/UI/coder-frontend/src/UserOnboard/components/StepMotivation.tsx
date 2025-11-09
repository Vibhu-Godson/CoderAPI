import { useState } from "react";

export default function StepMotivation({
    initial,
    onSubmit,
    isSaving,
}: {
    initial?: string;
    onSubmit: (motivation: string) => void;
    isSaving?: boolean;
}) {
    const [value, setValue] = useState(initial || "");

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">What’s driving you right now?</h3>
            <textarea
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Tell us in a few lines..."
                rows={5}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button
                onClick={() => onSubmit(value)}
                disabled={!value.trim() || isSaving}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
            >
                {isSaving ? "Saving..." : "Finish"}
            </button>
        </div>
    );
}
