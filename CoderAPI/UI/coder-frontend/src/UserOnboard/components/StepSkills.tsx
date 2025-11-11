import { useState } from "react";

export default function StepSkills({
    initial,
    onSubmit,
    onBack,
    isSaving,
}: {
    initial?: string | null;
    onSubmit: (val: string) => void;
    onBack: () => void;
    isSaving?: boolean;
}) {
    const [value, setValue] = useState(initial ?? "");

    const disabled = !value.trim() || !!isSaving;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
                Your Skills (comma separated)
            </h3>

            <textarea
                className="w-full border rounded-xl px-3 py-2"
                rows={3}
                placeholder="React, .NET, SQL, AWS..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
                <button
                    className="px-4 py-2 rounded-xl bg-gray-300"
                    onClick={onBack}
                    disabled={isSaving}
                >
                    Back
                </button>

                <button
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
                    onClick={() => onSubmit(value)}
                    disabled={disabled}
                >
                    {isSaving ? "Saving..." : "Save & Continue"}
                </button>
            </div>
        </div>
    );
}
