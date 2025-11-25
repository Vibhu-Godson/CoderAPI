import React, { useRef, useEffect } from "react";
import { ChatPanelProps } from "./types";
import MessageList from "./MessageList";
import Composer from "./Composer";

export default function AIChatPanel({
    chat,
    userInput,
    setUserInput,
    onSend,
    includeCode,
    setIncludeCode,
    includeBoard,
    setIncludeBoard,
    isThinking,
    code,
    tlEditorRef,
}: ChatPanelProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [chat, isThinking]);

    const getBoardData = () => {
        if (!tlEditorRef?.current) return undefined;
        try {
            const e = tlEditorRef.current;
            if (e.store?.serialize) return JSON.stringify(e.store.serialize());
            if (e.getSnapshot) return JSON.stringify(e.getSnapshot());
        } catch { }
        return undefined;
    };

    const handleSendMessage = () => {
        if (!userInput.trim()) return;
        const boardData = includeBoard ? getBoardData() : undefined;
        onSend(userInput, includeCode, includeBoard, code, boardData);
    };

    return (
        <div className="flex h-full flex-col">
            <div
                ref={listRef}
                className="flex-1 overflow-y-auto scrollbar-hide"
            >
                <MessageList chat={chat} isThinking={isThinking} />
            </div>

            <Composer
                userInput={userInput}
                setUserInput={setUserInput}
                onSend={handleSendMessage}
                includeCode={includeCode}
                setIncludeCode={setIncludeCode}
                includeBoard={includeBoard}
                setIncludeBoard={setIncludeBoard}
                isThinking={isThinking}
                code={code}
                tlEditorRef={tlEditorRef}
            />
        </div>
    );
}
