import React, { useState } from "react";
import HeroSection from "../components/HeroSection";
import LearningPathSection from "../components/LearningPathSection";
import MissionSection from "../components/MissionSection";
import Footer from "../components/Footer";

export default function HomePage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setMousePosition({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
        });
    };

    return (
        <div className="min-h-screen">
            <HeroSection
                mousePosition={mousePosition}
                onMouseMove={handleMouseMove}
            />

            <LearningPathSection />

            <MissionSection />

            <Footer />
        </div>
    );
}
