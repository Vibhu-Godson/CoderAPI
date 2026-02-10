import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";

interface WhiteboardEditorProps {
    onError?: (error: Error) => void;
}

export interface WhiteboardEditorHandle {
    getSnapshot: () => any;
    loadSnapshot: (snapshot: any) => void;
}

const WhiteboardEditor = forwardRef<WhiteboardEditorHandle, WhiteboardEditorProps>(
    ({ onError }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const editorRef = useRef<Editor | null>(null);

        useImperativeHandle(ref, () => ({
            getSnapshot: () => {
                try {
                    if (editorRef.current?.store) {
                        return JSON.stringify(editorRef.current.store.serialize());
                    }
                    return null;
                } catch (err) {
                    console.error("Error getting whiteboard snapshot:", err);
                    return null;
                }
            },
            loadSnapshot: (snapshot: any) => {
                try {
                    if (editorRef.current?.store && snapshot) {
                        const data = typeof snapshot === "string" ? JSON.parse(snapshot) : snapshot;
                        // Use put method to load shapes from snapshot
                        if (data && Array.isArray(data)) {
                            editorRef.current.store.put(data);
                        } else if (data) {
                            editorRef.current.store.put(Object.values(data));
                        }
                    }
                } catch (err) {
                    console.error("Error loading whiteboard snapshot:", err);
                }
            },
        }));

        useEffect(() => {
            // Suppress ResizeObserver errors
            const originalError = console.error;
            const errorHandler = (...args: any[]) => {
                if (
                    args[0]?.message?.includes?.("ResizeObserver") ||
                    args[0]?.includes?.("ResizeObserver")
                ) {
                    return; // Suppress ResizeObserver errors
                }
                originalError(...args);
            };

            const errorListener = (event: ErrorEvent) => {
                if (
                    event.message.includes("ResizeObserver loop") ||
                    event.message.includes("ResizeObserver")
                ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            };

            console.error = errorHandler;
            window.addEventListener("error", errorListener, true);

            return () => {
                console.error = originalError;
                window.removeEventListener("error", errorListener, true);
            };
        }, []);

        return (
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} className="tldraw-wrapper">
                <Tldraw
                    onMount={(editor: Editor) => {
                        editorRef.current = editor;
                    }}
                    hideUi={false}
                    autoFocus={false}
                />
            </div>
        );
    }
);

WhiteboardEditor.displayName = "WhiteboardEditor";

export default WhiteboardEditor;
