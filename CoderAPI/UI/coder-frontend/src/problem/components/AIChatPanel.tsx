// src/components/AIChatPanel.tsx

import React from "react";

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

    // Handler to send message on Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter allows a newline
            e.preventDefault(); // Prevent default newline
            onSend();
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            <div className="flex-grow-1 overflow-auto mb-2">
                {chat.map((m, idx) => (
                    <div key={idx} className={`p-1 rounded mb-1 ${m.from === "ai" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                        <strong>{m.from === "ai" ? "AI" : "You"}:</strong> {m.text}
                    </div>
                ))}
            </div>
            <div className="d-flex align-items-end">
                {/* Replaced input with a scrollable textarea */}
                <textarea
                    className="form-control me-2"
                    rows={1} // Start with 1 row
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress} // Use onKeyDown for better handling of Enter/Shift+Enter combo
                    placeholder="Type your message (Enter to send, Shift+Enter for newline)..."
                    style={{
                        resize: 'none', // Prevent manual resizing by user
                        overflowY: 'auto', // Enable vertical scrollbar when content overflows
                        maxHeight: '150px' // Set a maximum height for the growing textarea
                    }}
                />
                <button className="btn btn-success" onClick={onSend} disabled={!userInput.trim()}>Send</button>
            </div>
        </div>
    );
}
