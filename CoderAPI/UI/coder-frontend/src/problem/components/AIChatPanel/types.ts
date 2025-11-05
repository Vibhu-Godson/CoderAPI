export type ChatMessage = {
    from: "ai" | "user";
    text: string;
    meta?: string[];
};

export interface ChatPanelProps {
    chat: ChatMessage[];
    userInput: string;
    setUserInput: (v: string) => void;
    onSend: (
        userMessage: string,
        includeCode: boolean,
        includeBoard: boolean,
        codeContent?: string,
        boardData?: string
    ) => void;
    includeCode: boolean;
    setIncludeCode: (v: boolean) => void;
    includeBoard: boolean;
    setIncludeBoard: (v: boolean) => void;
    isThinking?: boolean;
    code: string; // ✅ added
    tlEditorRef?: any; // ✅ added (for whiteboard)
}
