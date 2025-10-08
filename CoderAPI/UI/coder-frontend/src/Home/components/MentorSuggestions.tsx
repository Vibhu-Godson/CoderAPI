// src/features/Home/components/MentorSuggestions.tsx
interface SuggestionProps {
    problems: { id: number; title: string; difficulty: string }[];
    courses: { id: number; title: string }[];
}

export default function MentorSuggestions({ problems, courses }: SuggestionProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Mentor Suggestions</h2>

            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Problems</h3>
                <ul className="space-y-2">
                    {problems.map((p) => (
                        <li
                            key={p.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer"
                        >
                            <span>{p.title}</span>
                            <span className="text-sm text-gray-500">{p.difficulty}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Courses</h3>
                <ul className="space-y-2">
                    {courses.map((c) => (
                        <li
                            key={c.id}
                            className="p-2 bg-gray-50 rounded-lg hover:bg-green-50 cursor-pointer"
                        >
                            {c.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
