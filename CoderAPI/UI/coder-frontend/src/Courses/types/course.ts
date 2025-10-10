export interface Course {
    courseId: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    durationInHours: number;
    level: string;
    isActive: boolean;
    createdOn?: string;
    topics?: Topic[]; 
}

export interface Bundle {
    bundleId: number;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    courses?: Course[];
}

export interface Category {
    categoryId: number;
    categoryName: string;
    description?: string;
    iconUrl?: string;
}

export interface Topic {
    topicId: number;
    topicName: string;
    topicDescription: string;
    sortOrder: number;
}
