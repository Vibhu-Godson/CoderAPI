import React, { useEffect, useState } from "react";

interface Props {
    message: string;
    duration?: number;
}

export default function SuccessNotification({ message, duration = 3500 }: Props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl text-green-600 dark:text-green-400 
        px-6 py-4 rounded-xl shadow-xl text-lg font-semibold border border-green-300 dark:border-green-600
        animate-fadeInOut">
                {message}
            </div>
            <style>
                {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: scale(0.9); }
            10%, 90% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.9); }
          }
          .animate-fadeInOut {
            animation: fadeInOut ${duration}ms ease-in-out forwards;
          }
        `}
            </style>
        </div>
    );
}
