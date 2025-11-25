import { useState, useEffect } from "react";
import { ProjectDto } from "../types";

export default function StepProject({
    initial,
    onSubmit,
    onBack,
    isSaving,
}: {
    initial?: ProjectDto;
    onSubmit: (val: ProjectDto) => void;
    onBack?: () => void;
    isSaving?: boolean;
}) {
    const [form, setForm] = useState<ProjectDto>({
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        techStacks: initial?.techStacks ?? "",
        projectLink: initial?.projectLink ?? "",
    });

    // 🔥 AUTO-FILL FIX
    useEffect(() => {
        if (initial) {
            setForm({
                title: initial.title ?? "",
                description: initial.description ?? "",
                techStacks: initial.techStacks ?? "",
                projectLink: initial.projectLink ?? "",
            });
        }
    }, [initial]);

    const disabled =
        !form.title || !form.description || !form.techStacks || !!isSaving;

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
                    placeholder="Tech Stacks"
                    value={form.techStacks ?? ""}
                    onChange={(e) => setForm({ ...form, techStacks: e.target.value })}
                />

                <div className="md:col-span-2">
                    <textarea
                        className="w-full rounded-xl border border-slate-300 px-3 py-2"
                        rows={3}
                        placeholder="Short Description"
                        value={form.description ?? ""}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </div>

                <input
                    className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2"
                    placeholder="Project Link"
                    value={form.projectLink ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, projectLink: e.target.value })
                    }
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
