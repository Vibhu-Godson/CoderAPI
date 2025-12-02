"use client";

import { useNavigate } from "react-router-dom";
import WorkshopCard from "./WorkshopCard";
import type { Workshop } from "../types/workshop.types";

export default function WorkshopsPanel({ workshops }: { workshops: Workshop[] }) {
    const navigate = useNavigate();

    return (
        <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20">
                <h2 className="mb-4 text-gray-900">Live & Upcoming</h2>

                <div className="space-y-3">
                    {workshops.map((workshop) => (
                        <WorkshopCard
                            key={workshop.id}
                            workshop={workshop}
                            onClick={() => navigate(`/community/workshop/${workshop.id}`)}
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
}
