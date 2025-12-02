import { Calendar, MapPin, Video } from "lucide-react";
import type { Workshop } from "../types/workshop.types";

export default function WorkshopCard({
    workshop,
    onClick,
}: {
    workshop: Workshop;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${workshop.isLive ? "border-red-500" : "border-indigo-500"
                }`}
        >
            {workshop.isLive && (
                <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-600 text-xs uppercase tracking-wide">
                        Live Now
                    </span>
                </div>
            )}

            <h3 className="text-gray-900 mb-2">{workshop.title}</h3>

            <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{workshop.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    {workshop.mode === "Online" ? (
                        <Video className="w-4 h-4" />
                    ) : (
                        <MapPin className="w-4 h-4" />
                    )}
                    <span>{workshop.mode}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                    {workshop.attendees} attending
                </span>
            </div>
        </div>
    );
}
