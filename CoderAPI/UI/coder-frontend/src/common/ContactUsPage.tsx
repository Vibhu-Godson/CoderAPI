import React from "react";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Contact Us
                </h1>

                <p className="text-gray-600 mb-6">
                    We'd love to hear from you! Whether you have feedback, a question,
                    or want to collaborate — drop us a message anytime.
                </p>

                {/* Contact Email */}
                <div className="bg-gray-100 p-4 rounded-xl mb-6">
                    <p className="text-gray-700 font-medium">Email:</p>
                    <p className="text-blue-600 font-semibold text-lg">
                        support@amcoder.in
                    </p>
                </div>

                {/* Optional social area */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Connect with Us
                    </h2>

                    <div className="flex gap-4 mt-3">
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 transition"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 transition"
                        >
                            Instagram
                        </a>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 transition"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-sm text-gray-500 mt-8">
                    We usually respond within 24 hours 🙂
                </p>
            </div>
        </div>
    );
}
