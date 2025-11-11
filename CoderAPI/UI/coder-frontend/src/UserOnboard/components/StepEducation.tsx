import { useState } from "react";
import { EducationDto } from "../types";

export default function StepEducation({
    initial,
    onSubmit,
    onBack,
    isSaving,
}: {
    initial?: EducationDto;
    onSubmit: (val: EducationDto) => void;
    onBack?: () => void;
    isSaving?: boolean;
}) {
    const [form, setForm] = useState<EducationDto>({
        institute: initial?.institute ?? "",
        degree: initial?.degree ?? "",
        fieldOfStudy: initial?.fieldOfStudy ?? "",
        completionYear: initial?.completionYear ?? "",
    });

    const disabled =
        !form.institute || !form.degree || !form.fieldOfStudy || !form.completionYear || !!isSaving;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Highest Qualification (Latest)</h3>

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Institute"
                    value={form.institute ?? ""}
                    onChange={(e) => setForm({ ...form, institute: e.target.value })}
                />
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Degree"
                    value={form.degree ?? ""}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                />
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Field of Study"
                    value={form.fieldOfStudy ?? ""}
                    onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                />
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Completion Year"
                    value={form.completionYear ?? ""}
                    onChange={(e) => setForm({ ...form, completionYear: e.target.value })}
                />
            </div>

            <div className="flex gap-3 mt-4">
                {onBack && (
                    <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded-xl">
                        Back
                    </button>
                )}

                <button
                    onClick={() => onSubmit(form)}
                    disabled={disabled}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save & Continue"}
                </button>
            </div>
        </div>
    );
}
