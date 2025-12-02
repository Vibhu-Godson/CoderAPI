// src/Settings/types/settings.types.ts

export interface ProfileInfo {
    displayName: string;
    bio: string;
    location: string;
}

export interface SecurityInfo {
    email: string;
    twoFactorEnabled: boolean;
}

export interface NotificationsInfo {
    emailNotifications: boolean;
    pushNotifications: boolean;
    contestReminders: boolean;
}

export interface PrivacyInfo {
    publicProfile: boolean;
    showActivity: boolean;
}
