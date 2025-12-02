import React from "react";

interface Activity {
    user: string;
    action: string;
    time: string;
    streak: number;
}

export default function LiveActivityCard({ activity }: { activity: Activity }) {
    return (
        <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br 
                            from-indigo-500 to-purple-600 text-white 
                            flex items-center justify-center text-lg font-semibold">
                {activity.user.charAt(0)}
            </div>

            <div className="flex-1">
                <p className="text-gray-900 text-sm">
                    <span>{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
            </div>

            <div className="text-right">
                <div className="text-sm text-indigo-600">🔥 {activity.streak}</div>
                <div className="text-xs text-gray-500">day streak</div>
            </div>
        </div>
    );
}
