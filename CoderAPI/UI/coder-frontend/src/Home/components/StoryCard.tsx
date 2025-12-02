import React from "react";

export default function StoryCard({ story }: any) {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white 
                        border border-indigo-200 rounded-xl p-6 
                        hover:shadow-lg transition-shadow">

            <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br 
                                from-indigo-600 to-purple-600 text-white 
                                flex items-center justify-center text-xl font-semibold">
                    {story.avatar}
                </div>

                <div>
                    <p className="text-gray-900 font-medium">{story.name}</p>
                    <p className="text-sm text-gray-600">{story.company}</p>
                </div>
            </div>

            <span className="inline-block px-3 py-1 bg-indigo-100 
                             text-indigo-600 rounded-full text-sm mb-4">
                ✨ {story.achievement}
            </span>

            <p className="text-gray-700 leading-relaxed italic">
                "{story.quote}"
            </p>
        </div>
    );
}
