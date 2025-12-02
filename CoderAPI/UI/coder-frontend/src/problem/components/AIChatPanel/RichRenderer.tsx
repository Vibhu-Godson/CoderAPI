// src/problem/components/AIChatPanel/RichRenderer.tsx
import React, { useState, useEffect } from "react";

export default function RichRenderer({ text }: { text: string }) {
    if (!text || typeof text !== "string") {
        return <div className="italic text-zinc-500 dark:text-zinc-400">(No response)</div>;
    }

    const parts = splitByCodeBlocks(text);
    return (
        <div className="prose max-w-full dark:prose-invert">
            {parts.map((part, i) =>
                part.type === "code" ? (
                    <CodeBlock key={i} code={part.content} />
                ) : (
                    <div key={i} className="whitespace-pre-wrap">
                        {renderInlineFormatting(part.content)}
                    </div>
                )
            )}
        </div>
    );
}

/* Helper functions */
function splitByCodeBlocks(input: string) {
    const regex = /```([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    const out: { type: "text" | "code"; content: string }[] = [];
    while ((match = regex.exec(input)) !== null) {
        if (match.index > lastIndex) out.push({ type: "text", content: input.slice(lastIndex, match.index) });
        out.push({ type: "code", content: match[1] });
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < input.length) out.push({ type: "text", content: input.slice(lastIndex) });
    return out;
}

function renderInlineFormatting(text: string) {
    const safeText = text ?? "";
    const boldSplit = safeText.split(/(\*\*.*?\*\*)/g);
    return boldSplit.map((segment, i) => {
        if (/^\*\*(.*?)\*\*$/.test(segment)) return <strong key={i}>{segment.replace(/\*\*/g, "")}</strong>;
        const inlineParts = segment.split(/(`[^`]+`)/g);
        return inlineParts.map((chunk, j) =>
            /^`[^`]+`$/.test(chunk) ? (
                <code key={`${i}-${j}`} className="rounded px-1 py-0.5 bg-zinc-100 text-sm dark:bg-zinc-800">
                    {chunk.slice(1, -1)}
                </code>
            ) : (
                <span key={`${i}-${j}`}>{chunk}</span>
            )
        );
    });
}

function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(t);
    }, [copied]);

    return (
        <div className="relative my-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <pre className="whitespace-pre-wrap overflow-x-auto">
                <code>{code}</code>
            </pre>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(code);
                    setCopied(true);
                }}
                className="absolute right-2 top-2 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
            >
                {copied ? "Copied ✓" : "Copy"}
            </button>
        </div>
    );
}
