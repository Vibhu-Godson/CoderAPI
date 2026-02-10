import { RoleKey } from "../types";

const OPTIONS: { key: RoleKey; label: string }[] = [
    { key: "student", label: "Student" },
    { key: "professional_0_2", label: "Working Professional (0-2 yrs)" },
    { key: "professional_2_5", label: "Working Professional (2-5 yrs)" },
    { key: "professional_5_10", label: "Working Professional (5-10 yrs)" },
    { key: "professional_10_plus", label: "Working Professional (10+ yrs)" },
    { key: "job_seeker", label: "Seeking Employment" },
];

export default function StepRole({ onSelect, onSkip }: { onSelect: (role: RoleKey) => void; onSkip?: () => void }) {
    return (
        <div className="w-full">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                    Welcome! Let's get to know you
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base">
                    Select what best describes your current situation
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {OPTIONS.map((o) => (
                    <button
                        key={o.key}
                        onClick={() => onSelect(o.key)}
                        className="text-left p-2.5 sm:p-3 md:p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group text-xs sm:text-sm md:text-base"
                        aria-label={`Select ${o.label}`}
                    >
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                            {o.label}
                        </div>
                    </button>
                ))}
            </div>

            {onSkip && (
                <div className="mt-4 sm:mt-6 flex gap-2">
                    <button
                        onClick={onSkip}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-slate-600 hover:text-slate-900 font-medium text-xs sm:text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Skip
                    </button>
                </div>
            )}
        </div>
    );
}
