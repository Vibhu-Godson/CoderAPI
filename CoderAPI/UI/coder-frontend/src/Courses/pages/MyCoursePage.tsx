// src/features/course/pages/MyCoursePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    useGetMyCourseDetailQuery,
    useGetTopicDetailsQuery, // 🆕 Import new query hook
} from '../courseApi';
import {
    Topic,
    TopicDetail, // 🆕 Import new types
    TopicAsset
} from '../types/course';
import LoadingSpinner from '../../problem/components/LoadingSpinner';
import VideoPlayer from '../components/VideoPlayer';

// A default asset state to show something initially
const DEFAULT_ASSET: TopicAsset = {
    userTopicAssetId: 0,
    userTopicId: 0,
    topicAssetId: 0,
    status: 'NotStarted',
    progressPercent: 0,
    videoUrl: '', // This will be empty until a real asset is selected
    subtitleUrl: '',
};

// Use an interface for the currently playing asset details, 
// including video URLs (which we currently mock)
interface CurrentAsset extends TopicAsset {
    title: string;
}

export const MyCoursePage: React.FC = () => {
    const { userCourseId: userCourseIdParam } = useParams<{ userCourseId: string }>();
    const userCourseId = Number(userCourseIdParam);

    // Fetch the list of topics (for the sidebar)
    const { data: course, isLoading: loadingCourse } = useGetMyCourseDetailQuery(userCourseId);

    // State for the selected Topic ID (to drive the second query)
    const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(undefined);

    // State for the currently playing asset
    const [currentAsset, setCurrentAsset] = useState<CurrentAsset | null>(null);

    // 🆕 Conditionally fetch Topic Details
    const { data: topicDetail, isLoading: loadingTopicDetail } = useGetTopicDetailsQuery(
        { userCourseId, topicId: selectedTopicId! },
        { skip: selectedTopicId === undefined }
    );

    // 🆕 Effect to select the first topic when the course detail loads
    useEffect(() => {
        if (course && course.topics.length > 0 && selectedTopicId === undefined) {
            // Automatically select the first topic
            setSelectedTopicId(course.topics[0].topicId);
        }
    }, [course, selectedTopicId]);

    // 🆕 Effect to set the first asset when a topic detail loads
    useEffect(() => {
        if (topicDetail && topicDetail.topicAssets.length > 0) {
            const firstAsset = topicDetail.topicAssets[0];
            // ⚠️ MOCK: Assuming the API gives you the URLs. Replace with actual mapping.
            const assetWithUrls: CurrentAsset = {
                ...firstAsset,
                title: 'Video Lesson: ' + firstAsset.topicAssetId, // Replace with real asset title
                videoUrl: "https://mock-video-url/topic.mp4",
                subtitleUrl: "https://mock-subtitle-url/topic.srt",
            };
            setCurrentAsset(assetWithUrls);
        } else {
            setCurrentAsset(null); // Clear asset if topic has none
        }
    }, [topicDetail]);

    // Handler to switch topics (triggered by sidebar click)
    const handleTopicClick = (topicId: number) => {
        if (topicId !== selectedTopicId) {
            setSelectedTopicId(topicId);
        }
    };

    const handleVideoEnd = () => {
        // Here you would call useUpdateTopicAssetStatusMutation to mark the asset as complete
        console.log('Video ended. Ready to mark asset complete:', currentAsset?.userTopicAssetId);
    };

    if (loadingCourse) {
        return <div className="p-6"><LoadingSpinner /></div>;
    }

    if (!course) {
        return <div className="p-6 text-red-600">Failed to load course details.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Header / Course Title */}
            <div className="p-4 border-b bg-white shadow-sm">
                <h1 className="text-3xl font-extrabold text-gray-900">{course.courseName}</h1>
                <p className="text-sm text-gray-500">Overall Progress: {course.overAllProgress}%</p>
            </div>

            {/* Main Learning Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Course Outline */}
                <div className="w-72 bg-gray-800 text-white flex-shrink-0 overflow-y-auto">
                    <nav className="space-y-1 p-4">
                        {course.topics.map((topic: Topic) => (
                            <div key={topic.topicId} className="space-y-1">
                                <h3
                                    className={`font-bold cursor-pointer p-2 rounded-md transition duration-150 flex items-center ${topic.topicId === selectedTopicId
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'hover:bg-gray-700'
                                        }`}
                                    onClick={() => handleTopicClick(topic.topicId)} // 🆕 Click handler
                                >
                                    <span className="mr-2">
                                        {/* Status Icon Placeholder */}
                                        {topic.topicId === selectedTopicId ? '▶' : '•'}
                                    </span>
                                    {topic.topicName}
                                </h3>

                                {/* 🆕 Assets list inside selected topic */}
                                {topic.topicId === selectedTopicId && (
                                    <ul className="ml-4 space-y-1 text-sm bg-gray-700 p-2 rounded-md">
                                        {loadingTopicDetail ? (
                                            <li className='text-gray-400'>Loading assets...</li>
                                        ) : (
                                            topicDetail?.topicAssets.map(asset => (
                                                <li
                                                    key={asset.userTopicAssetId}
                                                    className={`text-gray-300 hover:text-white cursor-pointer p-1 rounded transition duration-100 ${currentAsset?.userTopicAssetId === asset.userTopicAssetId ? 'bg-gray-600 font-medium' : ''
                                                        }`}
                                                    onClick={() => console.log('Asset clicked:', asset.userTopicAssetId)} // Implement asset selection logic here
                                                >
                                                    - Video Asset {asset.topicAssetId} ({asset.status === 'Completed' ? '✅' : '⏳'})
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Main Video Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">

                        {currentAsset ? (
                            <>
                                <h2 className="text-2xl font-bold mb-4">{currentAsset.title}</h2>
                                {/* Video Player Component */}
                                <div className="bg-black rounded-lg shadow-xl aspect-video">
                                    <VideoPlayer
                                        videoUrl={currentAsset.videoUrl || ''}
                                        subtitleUrl={currentAsset.subtitleUrl}
                                        onVideoEnd={handleVideoEnd}
                                    />
                                </div>

                                {/* Bottom Actions */}
                                <div className="flex justify-end mt-4 space-x-4">
                                    <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                                        Mark as Complete
                                    </button>
                                    <button className="px-4 py-2 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50">
                                        Ask AI about this Section 🤖
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-96 flex items-center justify-center border border-dashed rounded-lg text-gray-500">
                                Select a topic and asset to begin learning.
                            </div>
                        )}

                    </div>
                </div>

                {/* Right Panel - AI Chat / Notes (Unchanged from before) */}
                <div className="w-80 bg-white border-l flex-shrink-0 overflow-y-auto p-4 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Learning Tools</h2>
                    {/* ... Chat and Notes components (as defined previously) ... */}
                </div>
            </div>
        </div>
    );
};