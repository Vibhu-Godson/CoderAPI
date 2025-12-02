import { X, Image } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
    const navigate = useNavigate();
    const [postContent, setPostContent] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imgUrls = Array.from(files).map((f) => URL.createObjectURL(f));
            setUploadedImages([...uploadedImages, ...imgUrls]);
        }
    };

    return (
        <div className="flex justify-center px-4 py-10">
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-gray-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-gray-900 font-medium">Create Post</h3>

                    <button
                        onClick={() => navigate("/community")}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">

                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex justify-center items-center text-xl">
                            V
                        </div>
                        <div>
                            <p className="text-gray-900">Vishup</p>
                            <p className="text-sm text-gray-500">Posting to Public Space</p>
                        </div>
                    </div>

                    {/* Input */}
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind? Use #hashtags and @mentions..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[150px] resize-none"
                    />

                    {/* Images */}
                    {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {uploadedImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    className="rounded-lg h-40 w-full object-cover"
                                />
                            ))}
                        </div>
                    )}

                    {/* Tip */}
                    <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm">
                        💡 <span className="font-medium">#Hashtags</span> help others discover your post.
                        <span className="font-medium"> @Mentions </span> notify specific users.
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">

                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 flex items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Image className="w-5 h-5 text-gray-600" />
                                <span className="text-sm">Add Photo</span>
                            </button>
                        </div>

                        <button
                            disabled={!postContent.trim() && uploadedImages.length === 0}
                            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
                        >
                            Post
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}
