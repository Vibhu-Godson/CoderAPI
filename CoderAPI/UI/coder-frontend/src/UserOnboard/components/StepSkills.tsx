import { useState } from "react";

export default function StepSkills({
    initial,
    onSubmit,
    onBack,
    onSkip,
    isSaving,
}: {
    initial?: string | null;
    onSubmit: (val: string) => void;
    onBack?: () => void;
    onSkip?: () => void;
    isSaving?: boolean;
}) {
    const [value, setValue] = useState(initial ?? "");

    const disabled = !value.trim() || !!isSaving;

    const suggestedSkills = [
        "React", "Vue.js", "Angular", "Node.js", ".NET", "Python",
        "Java", "Go", "Rust", "TypeScript", "JavaScript",
        "SQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "GCP",
        "Docker", "Kubernetes", "CI/CD", "Git"
    ];

    const addSkill = (skill: string) => {
        const skills = value.split(",").map(s => s.trim()).filter(s => s);
        if (!skills.includes(skill)) {
            skills.push(skill);
            setValue(skills.join(", "));
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                Your Technical Skills
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-3">
                List your programming languages, frameworks, and tools
            </p>

            <div className="mb-3 sm:mb-4">
                <label className="block text-xs text-slate-600 mb-2 font-medium">
                    Quick Add Suggestions:
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {suggestedSkills.map(skill => (
                        <button
                            key={skill}
                            onClick={() => addSkill(skill)}
                            className="px-2 sm:px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-lg text-xs transition-colors"
                        >
                            + {skill}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-xs text-slate-600 mb-2 font-medium">Your Skills *</label>
                <textarea
                    className="w-full border border-slate-300 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    rows={3}
                    placeholder="React, Node.js, SQL, AWS..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>

            {value && (
                <div className="mb-3 p-2 sm:p-3 bg-slate-100 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1.5">Preview:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {value.split(",").map((skill, idx) => {
                            const trimmed = skill.trim();
                            return trimmed ? (
                                <span key={idx} className="px-2 sm:px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs">
                                    {trimmed}
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        disabled={isSaving}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-300 hover:bg-slate-400 disabled:opacity-50 text-slate-900 rounded-lg font-medium transition-colors text-xs sm:text-sm"
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
                    className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors text-xs sm:text-sm"
                    onClick={() => onSubmit(value)}
                    disabled={disabled}
                >
                    {isSaving ? "Saving..." : "Continue"}
                </button>
            </div>
        </div>
    );
}
