import { useState } from "react";
import { ExperienceDto } from "../types";

export default function StepExperience({
    initial,
    onSubmit,
    isSaving,
}: {
    initial?: ExperienceDto;
    onSubmit: (val: ExperienceDto) => void;
    isSaving?: boolean;
}) {
    const [form, setForm] = useState<ExperienceDto>({
        company: initial?.company ?? "",
        role: initial?.role ?? "",
        startDate: initial?.startDate ?? "",
        enddate: initial?.enddate ?? "",
        description: initial?.description ?? "",
    });

    const disabled =
        !form.company || !form.role || !form.startDate || !form.enddate || !!isSaving;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Latest Experience</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Company"
                    value={form.company ?? ""}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Role"
                    value={form.role ?? ""}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <input
                    type="date"
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Start Date"
                    value={form.startDate ?? ""}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
                <input
                    type="date"
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="End Date"
                    value={form.enddate ?? ""}
                    onChange={(e) => setForm({ ...form, enddate: e.target.value })}
                />
                <div className="md:col-span-2">
                    <textarea
                        className="w-full rounded-xl border border-slate-300 px-3 py-2"
                        placeholder="Short description (optional)"
                        rows={3}
                        value={form.description ?? ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
            </div>
            <button
                onClick={() => onSubmit(form)}
                disabled={disabled}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50"
            >
                {isSaving ? "Saving..." : "Save & Continue"}
            </button>
        </div>
    );
}
