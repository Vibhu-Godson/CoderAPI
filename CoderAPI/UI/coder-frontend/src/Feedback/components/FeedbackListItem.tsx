import React from "react";
import { Link } from "react-router-dom";
import { FeedbackListItem as Item } from "../apis/feedbackApi";


export default function FeedbackListItem({ item }: { item: Item }) {
    return (
        <Link
            to={`/feedback/${item.userFeedbackId}`}
            className="flex justify-between items-center py-4 hover:bg-gray-50 transition px-3 rounded-lg"
        >
            <div>
                <p className="font-medium text-gray-800">{item.feedbackType}</p>
                <p className="text-sm text-gray-500">{new Date(item.createdOn).toLocaleString()}</p>
            </div>


            <span
                className={`px-3 py-1 text-xs rounded-full ${item.status === "PENDING"
                        ? "bg-yellow-200 text-yellow-800"
                        : item.status === "RESOLVED"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                    }`}
            >
                {item.status}
            </span>
        </Link>
    );
}