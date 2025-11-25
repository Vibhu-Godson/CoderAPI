export default function DiscussionThread({ thread }: any) {
    return (
        <div className="p-3 border rounded bg-white shadow-sm hover:bg-zinc-50 cursor-pointer">
            <div className="flex gap-2 flex-wrap">
                {thread.tags?.map((t: any) => (
                    <span key={t.problemDiscussionTagId} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {t.tagName}
                    </span>
                ))}
            </div>

            <h3 className="font-semibold text-lg mt-1">{thread.header}</h3>

            <div className="text-xs text-zinc-500 mt-1">
                {thread.viewCount} views · {thread.commentCount} comments
            </div>

            <div className="flex items-center gap-2 mt-2">
                <img
                    src={thread.userImage || "/default.png"}
                    className="h-6 w-6 rounded-full"
                />
                <span className="text-sm text-zinc-700">{thread.userName}</span>
            </div>
        </div>
    );
}
