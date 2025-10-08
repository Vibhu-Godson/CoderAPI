// src/features/Home/components/CommunityHighlights.tsx
interface HighlightProps {
    highlights: { id: number; title: string; author: string }[];
}

export default function CommunityHighlights({ highlights }: HighlightProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Community Highlights</h2>
            <ul className="space-y-3">
                {highlights.map((h) => (
                    <li
                        key={h.id}
                        className="border-b pb-2 hover:text-blue-600 cursor-pointer transition"
                    >
                        <p className="font-semibold">{h.title}</p>
                        <p className="text-sm text-gray-500">by {h.author}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
