// src/Settings/services/settings.service.ts

import { SettingsAPI } from "../api/settings.api";
import {
    ProfileInfo,
    NotificationsInfo,
    PrivacyInfo,
} from "../types/settings.types";

export const SettingsService = {
    loadAll: async () => {
        const [profile, security, notifications, privacy] = await Promise.all([
            SettingsAPI.getProfile(),
            SettingsAPI.getSecurity(),
            SettingsAPI.getNotifications(),
            SettingsAPI.getPrivacy(),
        ]);

        return { profile, security, notifications, privacy };
    },

    saveProfile: (data: ProfileInfo) => SettingsAPI.updateProfile(data),

    saveNotifications: (data: NotificationsInfo) =>
        SettingsAPI.updateNotifications(data),

    savePrivacy: (data: PrivacyInfo) => SettingsAPI.updatePrivacy(data),

    saveEmail: (email: string) => SettingsAPI.updateEmail(email),

    deleteAccount: () => SettingsAPI.deleteAccount(),
};
