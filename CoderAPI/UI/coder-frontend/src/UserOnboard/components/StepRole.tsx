import { RoleKey } from "../types";

const OPTIONS: { key: RoleKey; label: string }[] = [
    { key: "student", label: "Student" },
    { key: "professional_0_2", label: "Working Professional (0–2 yrs)" },
    { key: "professional_2_5", label: "Working Professional (2–5 yrs)" },
    { key: "professional_5_10", label: "Working Professional (5–10 yrs)" },
    { key: "professional_10_plus", label: "Working Professional (10+ yrs)" },
    { key: "job_seeker", label: "Seeking Employment" },
];

export default function StepRole({ onSelect }: { onSelect: (role: RoleKey) => void }) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Select what defines you best</h3>
            <div className="space-y-3">
                {OPTIONS.map(o => (
                    <button
                        key={o.key}
                        onClick={() => onSelect(o.key)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200"
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
