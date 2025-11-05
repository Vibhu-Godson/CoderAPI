import { useState, useRef, useEffect } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import CodeEditorPanel from "../../components/CodeEditorPanel";
import "@tldraw/tldraw/tldraw.css";
import { LayoutPanelTop, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    code: string;
    setCode: (v: string) => void;
    wrappedRun: () => Promise<{ ok: boolean; message?: string; userSolutionId?: number }>;
    wrappedSubmit: () => Promise<{ ok: boolean; message?: string; userSolutionId?: number }>;
    editorLocked: boolean;
    setEditorLocked: (v: boolean) => void;
    language: string;
    setLanguage: (v: string) => void;
    languagesData: any;
    signalRConnected: boolean;
    sessionId: number | null;
    problemId: number;
    setSelectedProblemDetailId: (v: number | null) => void;
    setTlEditorRef: (ref: any) => void; // ✅ new
};

export default function MiddlePanel({
    code,
    setCode,
    wrappedRun,
    wrappedSubmit,
    editorLocked,
    setEditorLocked,
    language,
    setLanguage,
    languagesData,
    signalRConnected,
    sessionId,
    problemId,
    setSelectedProblemDetailId,
    setTlEditorRef, // ✅ new
}: Props) {
    const [activeTab, setActiveTab] = useState<"code" | "board">("code");
    const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));
    const tlEditorRef = useRef<any>(null);

    // ✅ Pass ref up to ProblemDetailPage
    useEffect(() => {
        setTlEditorRef(tlEditorRef);
    }, [tlEditorRef, setTlEditorRef]);

    return (
        <div className="flex flex-col h-full rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                <button
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${activeTab === "code"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                >
                    <LayoutPanelTop className="h-4 w-4" /> Code
                </button>
                <button
                    onClick={() => setActiveTab("board")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${activeTab === "board"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }`}
                >
                    <Brain className="h-4 w-4" /> Whiteboard
                </button>
            </div>

            <div className="relative flex-1 overflow-hidden min-h-0">
                <AnimatePresence mode="wait">
                    {activeTab === "code" ? (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <CodeEditorPanel
                                code={code}
                                setCode={setCode}
                                onRun={wrappedRun}
                                onSubmit={wrappedSubmit}
                                editorLocked={editorLocked}
                                setEditorLocked={setEditorLocked}
                                language={language}
                                setLanguage={(lang: string) => {
                                    setLanguage(lang);
                                    const found = languagesData?.items.find((x: any) => x.value === lang);
                                    setSelectedProblemDetailId(found?.problemDetailId ?? null);
                                }}
                                signalRConnected={signalRConnected}
                                sessionId={sessionId}
                                problemId={problemId}
                                languages={languagesData?.items || []}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="board"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Tldraw
                                store={store}
                                onMount={(editor) => {
                                    tlEditorRef.current = editor;
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
