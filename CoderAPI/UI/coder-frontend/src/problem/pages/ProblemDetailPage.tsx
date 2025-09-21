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
    const { data: problem } = useGetProblemByIdQuery(problemId);

    const [startSession] = useNewSessionMutation();
    const [sendPrompt] = useSendPromptMutation();
    const [runOrSubmit] = useRunOrSubmitSolutionMutation();

    const [sessionId, setSessionId] = useState<number | null>(null);
    const [chat, setChat] = useState<{ from: "ai" | "user"; text: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [code, setCode] = useState("// Your solution here");
    const [editorLocked, setEditorLocked] = useState(true);

    useEffect(() => {
        if (problemId) {
            startSession(problemId).unwrap().then((res) => {
                if (res.status) setSessionId(res.userProblemSessionId);
            });
        }
    }, [problemId]);

    const handleSend = async () => {
        if (!sessionId || !userInput.trim()) return;
        setChat((c) => [...c, { from: "user", text: userInput }]);
        const res = await sendPrompt({ problemId, userProblemSessionId: sessionId, userText: userInput }).unwrap();
        setChat((c) => [...c, { from: "user", text: userInput }, { from: "ai", text: res.message }]);
        if (res.accuracy >= 50) setEditorLocked(false);
        setUserInput("");
    };

    const handleRun = async () => {
        if (!sessionId) return;
        const res = await runOrSubmit({ userSolutionId: 0, userProblemSessionId: sessionId, problemId, code, language: "javascript", isSubmit: false }).unwrap();
        alert(res.message);
    };

    const handleSubmit = async () => {
        if (!sessionId) return;
        const res = await runOrSubmit({ userSolutionId: 0, userProblemSessionId: sessionId, problemId, code, language: "javascript", isSubmit: true }).unwrap();
        alert(res.message);
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
                    <CodeEditorPanel code={code} setCode={setCode} onRun={handleRun} onSubmit={handleSubmit} editorLocked={editorLocked} />
                </div>

                <div className="d-flex flex-column p-3 bg-light">
                    <AIChatPanel chat={chat} userInput={userInput} setUserInput={setUserInput} onSend={handleSend} />
                </div>
            </Split>
        </div>
    );
}
