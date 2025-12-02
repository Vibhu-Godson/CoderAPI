import { useEffect, useState } from "react";
import { SettingsService } from "../services/settings.service";

export default function PrivacySettings() {
    const [data, setData] = useState({
        publicProfile: true,
        showActivity: true,
    });

    useEffect(() => {
        SettingsService.loadAll().then((res) => setData(res.privacy));
    }, []);

    const update = (key: string, value: boolean) => {
        const updated = { ...data, [key]: value };
        setData(updated);
        SettingsService.savePrivacy(updated);
    };

    return (
        <div className="bg-white rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-semibold">Privacy</h2>

            {[
                ["Public Profile", "Allow others to view your profile", "publicProfile"],
                ["Show Activity", "Display your recent submissions", "showActivity"],
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
