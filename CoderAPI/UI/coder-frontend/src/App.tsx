import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './common/Navbar';

import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ResetPassword from './auth/pages/ResetPassword';
import RequireAuth from "./auth/RequireAuth";

import HomePage from './Home/pages/HomePage';
import PlansPage from './Plan/pages/PlansPage';
import ProblemsPage from './problem/pages/ProblemsPage';
import ProblemDetailPage from './problem/pages/ProblemDetailPage';
import { CoursesPage } from './Courses/pages/CoursesPage';
import { CourseDetailsPage } from './Courses/pages/CourseDetailsPage';
import { BundleDetailsPage } from './Courses/pages/BundleDetailsPage';
import { CategoryCoursesPage } from './Courses/pages/CategoryCoursesPage';
import { MyCoursePage } from './Courses/pages/MyCoursePage';

import NotFoundImage from "./S3/404.png"
import Community from "./Community/index"; // index.tsx
import FeedPage from "./Community/pages/FeedPage";
import PostDetailsPage from "./Community/pages/PostDetailsPage";
import CreatePostPage from "./Community/pages/CreatePostPage";
import WorkshopDetailsPage from "./Community/pages/WorkshopDetailsPage";
import RDLabPage from "./Community/pages/RDLabPage";

import FeedbackListPage from './Feedback/pages/FeedbackListPage';
import FeedbackAddPage from './Feedback/pages/FeedbackAddPage';
import FeedbackDetailPage from './Feedback/pages/FeedbackDetailPage';

import ContactUsPage from './common/ContactUsPage';
import OnboardingPage from "./UserOnboard/pages/OnboardingPage";

import SettingsPage from "./Settings/pages/SettingsPage"; 
import ProfilePage from "./common/profile";
export default function App() {
    return (
        <>
            <Navbar />

            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reset-password" element={<ResetPassword/> }/>

                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/plans" element={<PlansPage />} />
                    <Route path="/problems" element={<ProblemsPage />} />
                    <Route path="/problems/:idSlug" element={<ProblemDetailPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/course/:id" element={<CourseDetailsPage />} />
                    <Route path="/bundle/:id" element={<BundleDetailsPage />} />
                    <Route path="/category/:id" element={<CategoryCoursesPage />} />
                    <Route path="/myCourses/:userCourseId" element={<MyCoursePage />} />
                    <Route path="/feedback" element={<FeedbackListPage />} />
                    <Route path="/feedback/add" element={<FeedbackAddPage />} />
                    <Route path="/feedback/:id" element={<FeedbackDetailPage />} />
                    <Route path="/contact-us" element={<ContactUsPage />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/feed" element={<FeedPage />} />
                    <Route path="/community/post/:id" element={<PostDetailsPage />} />
                    <Route path="/community/create" element={<CreatePostPage />} />
                    <Route path="/community/lab" element={<RDLabPage />}/>
                    <Route path="/community/hashtag/:tag" element={<FeedPage />} />
                    <Route path="/community/user/:username" element={<FeedPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route
                        path="/community/workshop/:id"
                        element={<WorkshopDetailsPage />}
                    />
                    <Route path="/profile/:username" element={<ProfilePage user={{
                        name: "Unknown",
                        avatar: "?",
                    }} /> }/>
                </Route>
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen w-full flex items-start justify-center bg-[#c7e3ff]">
                            <img
                                src={NotFoundImage}
                                alt="404"
                                className="w-full h-auto object-cover max-w-none"
                            />
                        </div>
                    }
                />
            </Routes>
        </>
    );
}
