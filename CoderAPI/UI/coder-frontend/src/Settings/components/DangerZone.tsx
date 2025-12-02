import { SettingsService } from "../services/settings.service";

export default function DangerZone() {
    const onDelete = async () => {
        await SettingsService.deleteAccount();
        alert("Account deleted.");
    };

    return (
        <div className="bg-white border border-red-300 rounded-lg p-6">
            <h2 className="text-red-600 text-lg font-semibold mb-4">Danger Zone</h2>

            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-500">
                        This action is permanent and cannot be undone.
                    </p>
                </div>

                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
