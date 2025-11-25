import { useState, useRef, useEffect } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import CodeEditorPanel from "../../components/CodeEditorPanel";
import "@tldraw/tldraw/tldraw.css";
import { LayoutPanelTop, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProblemSessionContext } from "../../context/ProblemSessionContext";

export default function MiddlePanel({
    code,
    setCode,
    language,
    setLanguage,
    languagesData,
    problemId,
    setSelectedProblemDetailId
}: any) {
    const {
        wrappedRun,
        wrappedSubmit,
        editorLocked,
        setEditorLocked,
        signalRConnected,
        setBoardRef,
        setCodeRef
    } = useProblemSessionContext();

    const [activeTab, setActiveTab] = useState<"code" | "board">("code");
    const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));

    const tlEditorRef = useRef<any>(null);

    useEffect(() => {
        setBoardRef(tlEditorRef);
    }, []);

    useEffect(() => {
        setCodeRef(() => code);
    }, [code]);

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 bg-zinc-50">
                <button
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${activeTab === "code"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                >
                    <LayoutPanelTop className="h-4 w-4" /> Code
                </button>

                <button
                    onClick={() => setActiveTab("board")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition ${activeTab === "board"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                >
                    <Brain className="h-4 w-4" /> Whiteboard
                </button>
            </div>

            <div className="relative flex-1 min-h-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeTab === "code" ? (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.25 }}
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
                                    const found = languagesData?.items?.find(
                                        (x: any) => x.value === lang
                                    );
                                    setSelectedProblemDetailId(found?.problemDetailId ?? null);
                                }}
                                signalRConnected={signalRConnected}
                                sessionId={null}
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
                            transition={{ duration: 0.25 }}
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
