import { useEffect } from "react";

export function Toast({
    open,
    onClose,
    title,
    kind = "success",
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    kind?: "success" | "error" | "info";
}) {
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(onClose, 2500);
        return () => clearTimeout(t);
    }, [open, onClose]);

    if (!open) return null;

    const base =
        "fixed bottom-4 right-4 z-50 rounded-xl shadow-lg px-4 py-3 text-sm font-medium transition-all";
    const color =
        kind === "success"
            ? "bg-green-600 text-white"
            : kind === "error"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-white";

    return (
        <div className={`${base} ${color} animate-[slideIn_.2s_ease-out]`}>{title}</div>
    );
}