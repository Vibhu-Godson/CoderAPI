// src/Settings/pages/SettingsPage.tsx

import ProfileSettings from "../components/ProfileSettings";
import SecuritySettings from "../components/SecuritySettings";
import NotificationSettings from "../components/NotificationSettings";
import PrivacySettings from "../components/PrivacySettings";
import DangerZone from "../components/DangerZone";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <ProfileSettings />
            <SecuritySettings />
            <NotificationSettings />
            <PrivacySettings />
            <DangerZone />
        </div>
    );
}
