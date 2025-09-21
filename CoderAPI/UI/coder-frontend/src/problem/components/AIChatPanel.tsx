interface ChatMessage {
    from: "ai" | "user";
    text: string;
}

interface Props {
    chat: ChatMessage[];
    userInput: string;
    setUserInput: (val: string) => void;
    onSend: () => void;
}

export default function AIChatPanel({ chat, userInput, setUserInput, onSend }: Props) {
    return (
        <div className="d-flex flex-column h-100">
            <div className="flex-grow-1 overflow-auto mb-2">
                {chat.map((m, idx) => (
                    <div key={idx} className={`p-1 rounded mb-1 ${m.from === "ai" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                        <strong>{m.from === "ai" ? "AI" : "You"}:</strong> {m.text}
                    </div>
                ))}
            </div>
            <div className="d-flex">
                <input
                    className="form-control me-2"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button className="btn btn-success" onClick={onSend}>Send</button>
            </div>
        </div>
    );
}
