import React from 'react';
import PlansPage from './Plan/pages/PlansPage';
import HomePage from './Home/pages/HomePage';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ProblemsPage from './problem/pages/ProblemsPage';
import ProblemDetailPage from './problem/pages/ProblemDetailPage';
import { CoursesPage } from './Courses/pages/CoursesPage';
import { CourseDetailsPage } from './Courses/pages/CourseDetailsPage';
import { BundleDetailsPage } from './Courses/pages/BundleDetailsPage';
import { CategoryCoursesPage } from './Courses/pages/CategoryCoursesPage';
import { MyCoursePage } from './Courses/pages/MyCoursePage';
import Navbar from './common/Navbar';

export default function App() {
    return (
        <>
            <Navbar isAuthenticated={true} setIsAuthenticated={() => { }} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/problems/:id" element={<ProblemDetailPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:id" element={<CourseDetailsPage />} />
                <Route path="/bundle/:id" element={<BundleDetailsPage />} />
                <Route path="/category/:id" element={<CategoryCoursesPage />} />
                <Route path="/myCourses/:userCourseId" element={<MyCoursePage />} />
            </Routes>
        </>
    );
}
