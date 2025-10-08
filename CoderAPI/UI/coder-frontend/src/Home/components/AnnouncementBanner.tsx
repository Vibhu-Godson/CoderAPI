// src/features/Home/components/AnnouncementBanner.tsx
import { useState } from "react";

interface BannerProps {
    announcements: { id: number; message: string }[];
}

export default function AnnouncementBanner({ announcements }: BannerProps) {
    const [visible, setVisible] = useState(true);
    if (!visible || announcements.length === 0) return null;

    return (
        <div className="bg-blue-600 text-white p-4 rounded-xl mb-6 flex justify-between items-center shadow-md">
            <span className="font-medium">{announcements[0].message}</span>
            <button onClick={() => setVisible(false)} className="text-white text-sm">
                ?
            </button>
        </div>
    );
}
