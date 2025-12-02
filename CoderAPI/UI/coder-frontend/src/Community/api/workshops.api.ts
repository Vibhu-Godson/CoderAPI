import type { Workshop } from "../types/workshop.types";

export const getWorkshops = async (): Promise<Workshop[]> => {
    return [
        {
            id: 1,
            title: "Advanced DSA Masterclass",
            banner: "/images/banner1.jpg",
            college: "IIT Bombay",
            track: "DSA",
            startDate: "2025-11-28",
            endDate: "2025-11-29",
            time: "Live Now",
            mode: "Online",
            attendees: 234,
            isLive: true,
            description: "A masterclass on Data Structures & Algorithms.",
            userStatus: "not_joined",
            teams: [],
        },
        {
            id: 2,
            title: "System Design Fundamentals",
            banner: "/images/banner2.jpg",
            college: "IIIT Delhi",
            track: "System Design",
            startDate: "2025-12-01",
            endDate: "2025-12-01",
            time: "Today, 4 PM",
            mode: "Offline",
            attendees: 45,
            isLive: false,
            description: "A crash course on designing scalable systems.",
            userStatus: "joined",
            teams: [
                {
                    id: 1,
                    name: "Team Alpha",
                    members: ["Raj", "Kunal"],
                    progress: 50,
                },
            ],
        },
    ];
};
