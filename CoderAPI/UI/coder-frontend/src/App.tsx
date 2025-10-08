import React from 'react';
import PlansPage from './Plan/pages/PlansPage';
import HomePage from './Home/pages/HomePage';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ProblemsPage from './problem/pages/ProblemsPage';
import ProblemDetailPage from './problem/pages/ProblemDetailPage';
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
            </Routes>
        </>
    );
}
