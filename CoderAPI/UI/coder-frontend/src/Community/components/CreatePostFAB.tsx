import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatePostFAB() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/community/create")}
            className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center z-50"
        >
            <Plus className="w-6 h-6" />
        </button>
    );
}
