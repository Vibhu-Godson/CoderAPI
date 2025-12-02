export type ReactionType =
    | "like"
    | "love"
    | "insightful"
    | "celebrate"
    | "funny";

export interface ReactionCount {
    like: number;
    love?: number;
    insightful?: number;
    celebrate?: number;
    funny?: number;

    // allow string index access safely:
    [key: string]: number | undefined;
}

export interface Comment {
    author: string;
    avatar: string;
    content: string;
    reactions: ReactionCount;
}

export interface Post {
    id: number;
    author: string;
    avatar: string;
    time: string;
    content: string;
    media: string[];
    reactions: ReactionCount;
    totalComments: number;
    topComment?: Comment;
}
