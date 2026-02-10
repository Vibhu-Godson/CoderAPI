import { useState } from "react";
import { ExperienceDto } from "../types";

export default function StepExperience({
    initial,
    onSubmit,
    onBack,
    onSkip,
    isSaving,
}: {
    initial?: ExperienceDto;
    onSubmit: (val: ExperienceDto) => void;
    onBack?: () => void;
    onSkip?: () => void;
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
        <div className="w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Latest Work Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <input
                    className="rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Company Name"
                    value={form.company ?? ""}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
                <input
                    className="rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Job Role / Title"
                    value={form.role ?? ""}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <div>
                    <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                    <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        value={form.startDate ?? ""}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 mb-1">End Date</label>
                    <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        value={form.enddate ?? ""}
                        onChange={(e) => setForm({ ...form, enddate: e.target.value })}
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-600 mb-1">Description (Optional)</label>
                    <textarea
                        className="w-full rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                        rows={2}
                        placeholder="Briefly describe your role and achievements..."
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
