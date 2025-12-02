export type WorkshopMode = "Online" | "Offline";

export interface Workshop {
    id: number;
    title: string;
    banner: string;
    isLive: boolean;
    time: string;
    mode: WorkshopMode;
    attendees: number;
    college: string;
    track: string;
    startDate: string;
    endDate: string;

    // detailed page fields
    description: string;
    teams: Team[];
    userStatus: "not_joined" | "pending" | "joined";
}

export interface Team {
    id: number;
    name: string;
    members: string[];
    gitHubUrl?: string;
    figmaUrl?: string;
    progress: number;
}
