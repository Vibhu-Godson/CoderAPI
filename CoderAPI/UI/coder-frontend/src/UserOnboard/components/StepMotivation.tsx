import { useState } from "react";

export default function StepMotivation({
    initial,
    onSubmit,
    onBack,
    onSkip,
    isSaving,
}: {
    initial?: string;
    onSubmit: (val: string) => void;
    onBack?: () => void;
    onSkip?: () => void;
    isSaving?: boolean;
}) {
    const [value, setValue] = useState(initial || "");

    const suggestions = [
        "Build better software solutions that help people",
        "Learn new technologies and stay ahead in tech",
        "Solve challenging problems and grow my skills",
        "Work on meaningful projects that impact society",
        "Earn competitive salary and career advancement",
        "Achieve work-life balance and personal growth",
        "Be part of an innovative team and culture",
        "Make a difference in the tech industry"
    ];

    const addSuggestion = (suggestion: string) => {
        setValue(suggestion);
    };

    return (
        <div className="w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                What drives you?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-3">
                Tell us what motivates you in your career
            </p>

            <div className="mb-3 sm:mb-4">
                <label className="block text-xs text-slate-600 mb-2 font-medium">
                    Motivation Suggestions:
                </label>
                <div className="space-y-1.5">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => addSuggestion(suggestion)}
                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 bg-white hover:bg-indigo-50 hover:border-indigo-500 rounded-lg text-xs sm:text-sm md:text-base transition-colors"
                        >
                            <span className="text-indigo-600">✓</span> {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-xs text-slate-600 mb-2 font-medium">
                    Your answer
                </label>
                <textarea
                    className="w-full border border-slate-300 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Share what inspires and motivates you..."
                />
            </div>

            <div className="mb-3 text-xs text-slate-500">
                {value.length} characters | Share authentically!
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
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
                    disabled={!value.trim() || isSaving}
                >
                    {isSaving ? "Completing..." : "Finish"}
                </button>
            </div>
        </div>
    );
}
