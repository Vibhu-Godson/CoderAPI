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
export interface PaymentResponse {
    price: number;
    razorPayOrderId: string;
    key: string;
    userPlanId: number;
    userCourseId: number;
    currency: string;
}

export interface MyCourse {
    userCourseId: number;
    courseId: number;
    courseName: string;
    overAllProgress: number;
}

export interface MyCourseResponse {
    items: MyCourse[];
    totalCount: number;
}

export interface Topic {
    topicId: number;
    topicName: string;
    topicDescription: string;
    sortOrder: number;
    // Add fields for assets later if you use them here, for now, just the topic structure
}

export interface MyCourseDetail {
    userCourseId: number;
    courseId: number;
    courseName: string;
    overAllProgress: number;
    topics: Topic[];
    // We'll assume the currently selected asset/video details will be handled in a sub-query or state
}
export interface TopicAsset {
    userTopicAssetId: number;
    userTopicId: number;
    topicAssetId: number;
    status: string; // e.g., 'Completed', 'InProgress', 'NotStarted'
    progressPercent: number;
    videoUrl?: string;
    subtitleUrl?: string;
}

export interface TopicDetail {
    topicId: number;
    userTopicId: number;
    userCourseId: number;
    status: string; // e.g., 'Completed', 'InProgress', 'NotStarted'
    progressPercent: number;
    lastAccessedOn: string; // Date string
    topicAssets: TopicAsset[];
}

export interface UpdateStatusResponse {
    status: boolean;
    message: string;
}
