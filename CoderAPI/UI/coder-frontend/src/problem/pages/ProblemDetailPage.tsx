import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Split from "react-split";
import {
    useGetProblemByIdQuery,
    useNewSessionMutation,
    useSendPromptMutation,
    useRunOrSubmitSolutionMutation,
} from "../problemApi";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import AIChatPanel from "../components/AIChatPanel";

export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const problemId = Number(id);

    // ✅ fetch problem first
    const { data: problem, isSuccess } = useGetProblemByIdQuery(problemId);

    const [startSession] = useNewSessionMutation();
    const [sendPrompt] = useSendPromptMutation();
    const [runOrSubmit] = useRunOrSubmitSolutionMutation();

    const [sessionId, setSessionId] = useState<number | null>(null);
    const [chat, setChat] = useState<{ from: "ai" | "user"; text: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [code, setCode] = useState("// Your solution here");
    const [editorLocked, setEditorLocked] = useState(true);
    const [language, setLanguage] = useState("javascript"); // default

    // ✅ create session once after problem is successfully loaded
    useEffect(() => {
        if (isSuccess && problem?.problemId && !sessionId) {
            (async () => {
                try {
                    const res = await startSession(problem.problemId).unwrap(); // ✅ pass number directly

                    if (res.status) {
                        setSessionId(res.userProblemSessionId);
                        console.log("✅ Session started:", res.userProblemSessionId);
                    } else {
                        console.warn("⚠️ Failed to create session:", res.message);
                    }
                } catch (err) {
                    console.error("❌ Error creating session:", err);
                }
            })();
        }
    }, [isSuccess, problem, startSession, sessionId]);


    const handleSend = async () => {
        if (!sessionId || !userInput.trim()) return;

        // add user message first
        setChat((c) => [...c, { from: "user", text: userInput }]);

        try {
            const res = await sendPrompt({
                problemId,
                userProblemSessionId: sessionId,
                userText: userInput,
            }).unwrap();

            // add AI response
            setChat((c) => [
                ...c,
                { from: "ai", text: res.message },
            ]);

            // unlock editor if AI says accuracy >= 50
            if (res.accuracy >= 50) setEditorLocked(false);
        } catch (err) {
            console.error("❌ Error sending prompt:", err);
        } finally {
            setUserInput("");
        }
    };

    const handleRun = async () => {
        if (!sessionId) return;
        try {
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: false,
            }).unwrap();
            alert(res.message);
        } catch (err) {
            console.error("❌ Error running code:", err);
        }
    };

    const handleSubmit = async () => {
        if (!sessionId) return;
        try {
            const res = await runOrSubmit({
                userSolutionId: 0,
                userProblemSessionId: sessionId,
                problemId,
                code,
                language,
                isSubmit: true,
            }).unwrap();
            alert(res.message);
        } catch (err) {
            console.error("❌ Error submitting code:", err);
        }
    };

    return (
        <div className="container-fluid mt-3">
            <Split
                className="d-flex border rounded shadow-sm"
                sizes={[30, 40, 30]}
                minSize={200}
                expandToMin={false}
                gutterSize={6}
                gutterAlign="center"
                style={{ height: "85vh" }}
            >
                <div className="p-3 bg-light overflow-auto">
                    <ProblemDescription problem={problem} />
                </div>

                <div className="d-flex flex-column">
                    <CodeEditorPanel
                        code={code}
                        setCode={setCode}
                        onRun={handleRun}
                        onSubmit={handleSubmit}
                        editorLocked={editorLocked}
                        setEditorLocked={setEditorLocked}
                        language={language}
                        setLanguage={setLanguage}
                    />
                </div>

                <div className="d-flex flex-column p-3 bg-light">
                    <AIChatPanel
                        chat={chat}
                        userInput={userInput}
                        setUserInput={setUserInput}
                        onSend={handleSend}
                    />
                </div>
            </Split>
        </div>
    );
}
