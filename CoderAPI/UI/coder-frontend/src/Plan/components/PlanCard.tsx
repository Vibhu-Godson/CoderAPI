// src/features/Plans/components/PlanCard.tsx
import { Check, X } from "lucide-react";

interface Feature {
    feature: string;
    included: boolean;
}

interface PlanCardProps {
    name: string;
    price: number;
    description: string;
    features: Feature[];
    isPopular?: boolean;
    onSubscribe?: () => void;
}

export default function PlanCard({
    name,
    price,
    description,
    features,
    isPopular = false,
    onSubscribe,
}: PlanCardProps) {
    return (
        <div
            className={`rounded-2xl shadow-lg p-6 border ${isPopular ? "border-blue-500 bg-blue-50" : "border-gray-200"
                } w-full max-w-sm`}
        >
            {isPopular && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                </span>
            )}
            <h2 className="text-2xl font-bold mt-2">{name}</h2>
            <p className="text-gray-600 text-sm mt-1">{description}</p>

            <p className="text-3xl font-extrabold mt-4">
                ₹{price}
                <span className="text-base text-gray-600 font-normal"> only </span>
            </p>

            <ul className="mt-4 space-y-2">
                {features.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                        {f.included ? (
                            <Check className="text-green-500 w-4 h-4" />
                        ) : (
                            <X className="text-red-500 w-4 h-4" />
                        )}
                        <span>{f.feature}</span>
                    </li>
                ))}
            </ul>

            {onSubscribe && (
                <button
                    onClick={onSubscribe}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                >
                    Subscribe Now
                </button>
            )}
        </div>
    );
}
