import { useState } from "react";
import { ProjectDto } from "../types";

export default function StepProject({
    initial,
    onSubmit,
    onBack,
    onSkip,
    isSaving,
}: {
    initial?: ProjectDto;
    onSubmit: (val: ProjectDto) => void;
    onBack?: () => void;
    onSkip?: () => void;
    isSaving?: boolean;
}) {
    const [form, setForm] = useState<ProjectDto>({
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        techStacks: initial?.techStacks ?? "",
        projectLink: initial?.projectLink ?? "",
    });

    const disabled =
        !form.title || !form.description || !form.techStacks || !!isSaving;

    return (
        <div className="w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                Showcase Your Project
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                Share one of your favorite projects
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Project Title *</label>
                    <input
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        placeholder="e.g., E-commerce Platform"
                        value={form.title ?? ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 mb-1">Tech Stack *</label>
                    <input
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        placeholder="e.g., React, Node.js, MongoDB"
                        value={form.techStacks ?? ""}
                        onChange={(e) => setForm({ ...form, techStacks: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 mb-1">Project Link (Optional)</label>
                    <input
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        placeholder="https://github.com/..."
                        value={form.projectLink ?? ""}
                        onChange={(e) =>
                            setForm({ ...form, projectLink: e.target.value })
                        }
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Description *</label>
                    <textarea
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        rows={3}
                        placeholder="What did you build? What problem does it solve?"
                        value={form.description ?? ""}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-300 hover:bg-slate-400 text-slate-900 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                    >
                        Back
                    </button>
                )}

                {onSkip && (
                    <button
                        onClick={onSkip}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-slate-600 hover:text-slate-900 font-medium text-xs sm:text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Skip
                    </button>
                )}

                <button
                    onClick={() => onSubmit(form)}
                    disabled={disabled}
                    className="px-4 sm:px-5 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-xs sm:text-sm"
                >
                    {isSaving ? "Saving..." : "Continue"}
                </button>
            </div>
        </div>
    );
}
