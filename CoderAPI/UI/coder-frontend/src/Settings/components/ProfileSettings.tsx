// src/Settings/components/ProfileSettings.tsx

import { useEffect, useState } from "react";
import { SettingsService } from "../services/settings.service";
import { ProfileInfo } from "../types/settings.types";

export default function ProfileSettings() {
    const [form, setForm] = useState<ProfileInfo>({
        displayName: "",
        bio: "",
        location: "",
    });

    useEffect(() => {
        SettingsService.loadAll().then((data) => setForm(data.profile));
    }, []);

    const save = async () => {
        await SettingsService.saveProfile(form);
        alert("Profile saved");
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile Info</h2>

            <input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Display Name"
            />

            <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full border px-3 py-2 rounded"
            />

            <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border px-3 py-2 rounded"
            />

            <button
                onClick={save}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Save
            </button>
        </div>
    );
}
