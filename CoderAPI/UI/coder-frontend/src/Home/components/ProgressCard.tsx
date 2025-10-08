// src/features/Home/components/ProgressCard.tsx
interface ProgressCardProps {
    problemsSolved: number;
    coursesCompleted: number;
    badges: number;
}

export default function ProgressCard({
    problemsSolved,
    coursesCompleted,
    badges,
}: ProgressCardProps) {
    const progressPercent = (problemsSolved / 500) * 100;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Progress</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold text-blue-600">{problemsSolved}</p>
                    <p className="text-sm text-gray-600">Problems Solved</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-green-600">{coursesCompleted}</p>
                    <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-yellow-500">{badges}</p>
                    <p className="text-sm text-gray-600">Badges</p>
                </div>
            </div>

            <div className="mt-4 bg-gray-200 rounded-full h-3">
                <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1 text-right">
                {Math.floor(progressPercent)}% of 500 problems
            </p>
        </div>
    );
}
