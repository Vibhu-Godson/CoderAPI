// src/Settings/api/settings.api.ts

import {
    ProfileInfo,
    SecurityInfo,
    NotificationsInfo,
    PrivacyInfo,
} from "../types/settings.types";

export const SettingsAPI = {
    getProfile: async (): Promise<ProfileInfo> => {
        return new Promise(resolve =>
            setTimeout(() => {
                resolve({
                    displayName: "Vishup",
                    bio: "Software Engineer | Coding Enthusiast",
                    location: "Delhi, India",
                });
            }, 300)
        );
    },

    updateProfile: async (data: ProfileInfo) => {
        console.log("Updating profile...", data);
        return { success: true };
    },

    getSecurity: async (): Promise<SecurityInfo> => ({
        email: "vishup@example.com",
        twoFactorEnabled: false,
    }),

    updateEmail: async (email: string) => {
        console.log("Email updated:", email);
        return { success: true };
    },

    getNotifications: async (): Promise<NotificationsInfo> => ({
        emailNotifications: true,
        pushNotifications: true,
        contestReminders: true,
    }),

    updateNotifications: async (data: NotificationsInfo) => {
        console.log("Notifications updated:", data);
        return { success: true };
    },

    getPrivacy: async (): Promise<PrivacyInfo> => ({
        publicProfile: true,
        showActivity: true,
    }),

    updatePrivacy: async (data: PrivacyInfo) => {
        console.log("Privacy updated:", data);
        return { success: true };
    },

    deleteAccount: async () => {
        console.log("Account Deleted!");
        return { success: true };
    },
};
