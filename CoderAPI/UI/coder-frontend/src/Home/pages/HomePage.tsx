// src/features/Home/pages/HomePage.tsx
import { useGetDashboardQuery } from "../homeApi";
import ProgressCard from "../components/ProgressCard";
import MentorSuggestions from "../components/MentorSuggestions";
import CommunityHighlights from "../components/CommunityHighlights";
import AnnouncementBanner from "../components/AnnouncementBanner";

export default function HomePage() {
    const { data, isLoading } = useGetDashboardQuery();

    if (isLoading) return <p className="text-center mt-10">Loading dashboard...</p>;
    if (!data) return <p className="text-center mt-10 text-red-500">Failed to load dashboard.</p>;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-6">
            <AnnouncementBanner announcements={data.announcements} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProgressCard {...data.progress} />
                    <MentorSuggestions {...data.mentorSuggestions} />
                </div>

                <div className="space-y-6">
                    <CommunityHighlights highlights={data.communityHighlights} />
                </div>
            </div>
        </div>
    );
}
