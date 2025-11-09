import { useState } from "react";
import { ProjectDto } from "../types";

export default function StepProject({
    initial,
    onSubmit,
    isSaving,
}: {
    initial?: ProjectDto;
    onSubmit: (val: ProjectDto) => void;
    isSaving?: boolean;
}) {
    const [form, setForm] = useState<ProjectDto>({
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        techStacks: initial?.techStacks ?? "",
        projectLink: initial?.projectLink ?? "",
    });

    const disabled = !form.title || !form.description || !form.techStacks || !!isSaving;

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">One Project (Latest)</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Project Title"
                    value={form.title ?? ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Tech Stacks (comma separated)"
                    value={form.techStacks ?? ""}
                    onChange={(e) => setForm({ ...form, techStacks: e.target.value })}
                />
                <div className="md:col-span-2">
                    <textarea
                        className="w-full rounded-xl border border-slate-300 px-3 py-2"
                        placeholder="Short description"
                        rows={3}
                        value={form.description ?? ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <input
                    className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2"
                    placeholder="Project Link (optional)"
                    value={form.projectLink ?? ""}
                    onChange={(e) => setForm({ ...form, projectLink: e.target.value })}
                />
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
