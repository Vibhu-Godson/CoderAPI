import { ChatMessage } from "../types";

export default function MessageBubble({ m }: { m: ChatMessage }) {
    const isBot = m.role === "bot";
    return (
        <div className={`mb-3 flex ${isBot ? "" : "justify-end"}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow
          ${isBot ? "bg-slate-100 text-slate-800" : "bg-indigo-600 text-white"}`}
            >
                {m.text}
            </div>
        </div>
    );
}
