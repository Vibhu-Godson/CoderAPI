import type { Workshop } from "../types/workshop.types";

export default function WorkshopHeader({ workshop }: { workshop: Workshop }) {
    return (
        <div className="rounded-xl overflow-hidden shadow bg-white">
            <img src={workshop.banner} className="h-56 w-full object-cover" />

            <div className="p-6">
                <h1 className="text-2xl font-semibold">{workshop.title}</h1>

                <div className="mt-2 text-sm text-gray-600">
                    <p>{workshop.college}</p>
                    <p>
                        {workshop.startDate} → {workshop.endDate}
                    </p>
                    <p>Track: {workshop.track}</p>
                </div>

                {workshop.userStatus === "not_joined" && (
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                        Request to Join
                    </button>
                )}

                {workshop.userStatus === "pending" && (
                    <div className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg text-center">
                        Pending Approval
                    </div>
                )}

                {workshop.userStatus === "joined" && (
                    <div className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-center">
                        Joined
                    </div>
                )}
            </div>
        </div>
    );
}
