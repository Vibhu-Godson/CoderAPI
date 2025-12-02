import { useEffect, useState } from "react";
import { SettingsService } from "../services/settings.service";

export default function NotificationSettings() {
    const [data, setData] = useState({
        emailNotifications: true,
        pushNotifications: true,
        contestReminders: true,
    });

    useEffect(() => {
        SettingsService.loadAll().then((res) => setData(res.notifications));
    }, []);

    const update = (key: string, value: boolean) => {
        const updated = { ...data, [key]: value };
        setData(updated);
        SettingsService.saveNotifications(updated);
    };

    return (
        <div className="bg-white rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-semibold">Notifications</h2>

            {[
                ["Email Notifications", "Receive updates via email", "emailNotifications"],
                ["Push Notifications", "Stay updated about activity", "pushNotifications"],
                ["Contest Reminders", "Get reminded before contests", "contestReminders"],
            ].map(([title, subtitle, key]) => (
                <div className="flex items-center justify-between" key={key}>
                    <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={data[key as keyof typeof data]}
                            onChange={(e) => update(key, e.target.checked)}
                        />
                        <div
                            className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 
              peer-focus:ring-2 peer-focus:ring-blue-500 after:content-[''] 
              after:absolute after:top-[3px] after:left-[3px] after:bg-white 
              after:h-5 after:w-5 after:rounded-full after:transition-all
              peer-checked:after:translate-x-5"
                        ></div>
                    </label>
                </div>
            ))}
        </div>
    );
}
