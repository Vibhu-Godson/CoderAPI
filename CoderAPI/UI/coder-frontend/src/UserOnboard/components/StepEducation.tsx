import { useState } from "react";
import { EducationDto } from "../types";

export default function StepEducation({
    initial,
    onSubmit,
    onBack,
    onSkip,
    isSaving,
}: {
    initial?: EducationDto;
    onSubmit: (val: EducationDto) => void;
    onBack?: () => void;
    onSkip?: () => void;
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
        <div className="w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                Highest Qualification (Latest)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <input
                    className="rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Institute / University"
                    value={form.institute ?? ""}
                    onChange={(e) => setForm({ ...form, institute: e.target.value })}
                />
                <input
                    className="rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Degree (B.Tech, MBA, etc.)"
                    value={form.degree ?? ""}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                />
                <input
                    className="rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Field of Study"
                    value={form.fieldOfStudy ?? ""}
                    onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                />
                <input
                    className="rounded-lg border border-slate-300 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    placeholder="Completion Year (2023)"
                    value={form.completionYear ?? ""}
                    onChange={(e) => setForm({ ...form, completionYear: e.target.value })}
                />
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
