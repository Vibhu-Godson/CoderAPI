import React, { useState } from "react";

import HeroSection from "../components/HeroSection";
//import ProblemCategoriesSection from "../components/ProblemCategoriesSection";
import LearningPathSection from "../components/LearningPathSection";
import CommunitySection from "../components/CommunitySection";
//import PricingSection from "../components/PricingSection";
import WorkshopsSection from "../components/WorkshopsSection";
import MissionSection from "../components/MissionSection";
import SuccessStoriesSection from "../components/SuccessStoriesSection";
import Footer from "../components/Footer";

export default function HomePage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        setMousePosition({
            x: clientX / window.innerWidth,
            y: clientY / window.innerHeight,
        });
    };

    return (
        <div className="min-h-screen">
            <HeroSection
                mousePosition={mousePosition}
                onMouseMove={handleMouseMove}
            />

            {/*<ProblemCategoriesSection />*/}

            <LearningPathSection />

            <CommunitySection />

            {/*<PricingSection />*/}

            <WorkshopsSection />

            <MissionSection />

            <SuccessStoriesSection />

            <Footer />
        </div>
    );
}
