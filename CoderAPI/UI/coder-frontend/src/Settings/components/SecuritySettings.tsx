import { useState, useEffect } from "react";
import { SettingsService } from "../services/settings.service";

export default function SecuritySettings() {
    const [email, setEmail] = useState("");
    const [twoFA, setTwoFA] = useState(false);

    useEffect(() => {
        SettingsService.loadAll().then((res) => {
            setEmail(res.security.email);
            setTwoFA(res.security.twoFactorEnabled);
        });
    }, []);

    return (
        <div className="bg-white border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold">Account Security</h2>

            <div>
                <label className="text-sm block mb-2">Email</label>
                <div className="flex gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={() => SettingsService.saveEmail(email)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Change
                    </button>
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add extra protection</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={twoFA}
                            onChange={(e) => setTwoFA(e.target.checked)}
                        />
                        <div
                            className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600
              after:content-[''] after:absolute after:top-[3px] after:left-[3px]
              after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all
              peer-checked:after:translate-x-5"
                        ></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
