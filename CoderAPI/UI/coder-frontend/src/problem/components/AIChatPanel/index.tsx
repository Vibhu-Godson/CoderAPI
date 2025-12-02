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
    code,           // ✅ receive
    tlEditorRef,    // ✅ receive
}: ChatPanelProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [chat, isThinking]);

    // ✅ Collect current whiteboard JSON
    const getBoardData = () => {
        if (!tlEditorRef?.current) return undefined;
        const editor = tlEditorRef.current;
        try {
            if (editor.store?.serialize) {
                return JSON.stringify(editor.store.serialize());
            }
            if (editor.getSnapshot) {
                return JSON.stringify(editor.getSnapshot());
            }
        } catch (err) {
            console.error("Error serializing whiteboard:", err);
        }
        return undefined;
    };

    const handleSendMessage = () => {
        if (!userInput.trim()) return;
        const boardData = includeBoard ? getBoardData() : undefined;
        onSend(userInput, includeCode, includeBoard, code, boardData);
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-full flex-col px-2 pb-3">
            {/* Scrollable message list */}
            <div
                ref={listRef}
                className="flex-1 overflow-y-auto scrollbar-hide pr-1"
                style={{
                    minHeight: "120px",
                    maxHeight: "calc(100vh - 230px)", // prevents overflow beyond viewport
                }}
            >
                <MessageList chat={chat} isThinking={isThinking} />
            </div>

            {/* Composer stays visible */}
            <div className="sticky bottom-0 bg-white dark:bg-zinc-900 pt-2">
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
        </div>
    );
}
