import React, { useState, useRef, useEffect } from "react";
import { LayoutPanelTop, Brain } from "lucide-react";

export default function Composer({
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
}: any) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Collapse on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"; // max ~4 lines
    }, [userInput]);

    const getBoardData = () => {
        try {
            const editor = tlEditorRef?.current;
            if (!editor) return undefined;
            let boardJson: any = null;
            if (editor?.store?.serialize) boardJson = editor.store.serialize();
            else if (editor?.getSnapshot) boardJson = editor.getSnapshot();
            return boardJson ? JSON.stringify(boardJson) : undefined;
        } catch (err) {
            console.error("Error serializing board:", err);
            return undefined;
        }
    };

    const handleSendClick = () => {
        if (!userInput.trim() || isThinking) return;
        const boardData = includeBoard ? getBoardData() : undefined;
        onSend(userInput, includeCode, includeBoard, code, boardData);
    };

    const handlePaperclipClick = () => {
        setIncludeCode(false);
        setIncludeBoard(false);
        setOpen(false);
    };

    return (
        <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
            {(includeCode || includeBoard) && (
                <div className="mb-2 flex flex-wrap gap-2 px-2">
                    {includeCode && <Tag label="Code" onRemove={() => setIncludeCode(false)} />}
                    {includeBoard && <Tag label="Whiteboard" onRemove={() => setIncludeBoard(false)} />}
                </div>
            )}

            <div
                ref={wrapperRef}
                className={`relative flex items-end gap-2 rounded-lg bg-white px-3 py-2.5 shadow-sm border border-zinc-200 focus-within:border-blue-500 focus-within:shadow-md focus-within:shadow-blue-100 transition dark:bg-zinc-900 dark:border-zinc-700 dark:focus-within:border-blue-400 dark:focus-within:shadow-blue-900/30 ${
                    isThinking ? "animate-pulse border-blue-400" : ""
                }`}
            >
                {/* 📎 Paperclip */}
                <button
                    onClick={handlePaperclipClick}
                    aria-label="Select context"
                    className={`relative rounded-full p-1 transition ${
                        includeCode || includeBoard
                            ? "text-blue-600"
                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.44 11.05l-9.19 9.19a5.25 5.25 0 01-7.43-7.43l9.19-9.19a3.75 3.75 0 115.3 5.3L9.88 18.43a2.25 2.25 0 01-3.18-3.18l8.13-8.13"
                        />
                    </svg>
                    {(includeCode || includeBoard) && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 text-[8px] text-white">
                            ✓
                        </span>
                    )}
                </button>

                {/* 🧩 Dropdown for Code/Board */}
                {open && (
                    <div className="absolute bottom-10 left-0 z-50 flex flex-col rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                        <ContextOption
                            icon={<LayoutPanelTop className="h-4 w-4 text-blue-600" />}
                            label="Code"
                            active={includeCode}
                            onClick={() => setIncludeCode(!includeCode)}
                        />
                        <ContextOption
                            icon={<Brain className="h-4 w-4 text-emerald-600" />}
                            label="Whiteboard"
                            active={includeBoard}
                            onClick={() => setIncludeBoard(!includeBoard)}
                        />
                    </div>
                )}

                {/* 🗨️ Textarea */}
                <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendClick();
                        }
                    }}
                    placeholder="Ask anything…"
                    className="flex-1 resize-none bg-transparent px-1 py-1 text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500 scrollbar-hide"
                    rows={1}
                    disabled={isThinking}
                />

                {/* 🚀 Send */}
                <button
                    onClick={handleSendClick}
                    disabled={!userInput.trim() || isThinking}
                    className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white transition enabled:hover:bg-blue-700 disabled:opacity-50"
                    aria-label="Send message"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l14-8-5 8 5 8-14-8z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-100">
            {label}
            <button
                onClick={onRemove}
                className="ml-1 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                aria-label={`Remove ${label}`}
            >
                ✕
            </button>
        </div>
    );
}

function ContextOption({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between px-3 py-2 text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                active ? "text-blue-600 font-medium" : "text-zinc-700 dark:text-zinc-200"
            }`}
        >
            <span className="flex items-center gap-2">
                {icon}
                {label}
            </span>
            {active && <span className="text-blue-600">✓</span>}
        </button>
    );
}
