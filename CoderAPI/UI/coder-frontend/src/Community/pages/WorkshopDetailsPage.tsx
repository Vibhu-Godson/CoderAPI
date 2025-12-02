"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkshops } from "../api/workshops.api";
import WorkshopHeader from "../components/WorkshopHeader";
import type { Workshop } from "../types/workshop.types";

export default function WorkshopDetailsPage() {
    const { id } = useParams();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);

    useEffect(() => {
        getWorkshops().then((ws) => {
            const found = ws.find((w) => w.id === Number(id));
            setWorkshop(found || null);
        });
    }, [id]);

    if (!workshop) {
        return <div className="p-10 text-gray-500">Loading workshop…</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <WorkshopHeader workshop={workshop} />

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-medium mb-2">About This Workshop</h2>
                <p className="text-gray-700">{workshop.description}</p>
            </div>

            {/* TEAMS SECTION */}
            {workshop.teams.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-medium mb-4">Teams Overview</h2>

                    <div className="space-y-4">
                        {workshop.teams.map((team) => (
                            <div
                                key={team.id}
                                className="border p-4 rounded-lg flex justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold">{team.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Members: {team.members.join(", ")}
                                    </p>

                                    {team.gitHubUrl && (
                                        <a
                                            href={team.gitHubUrl}
                                            className="text-indigo-600 text-sm underline"
                                            target="_blank"
                                        >
                                            GitHub Repo
                                        </a>
                                    )}

                                    {team.figmaUrl && (
                                        <a
                                            href={team.figmaUrl}
                                            className="text-indigo-600 text-sm underline ml-4"
                                            target="_blank"
                                        >
                                            Figma File
                                        </a>
                                    )}
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-700">
                                        Progress: {team.progress}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
