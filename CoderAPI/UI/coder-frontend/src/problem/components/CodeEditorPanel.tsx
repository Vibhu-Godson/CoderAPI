import Editor from "@monaco-editor/react";

interface Props {
    code: string;
    setCode: (val: string) => void;
    onRun: () => void;
    onSubmit: () => void;
    editorLocked: boolean;
    setEditorLocked: (val: boolean) => void;
    language: string;
    setLanguage: (val: string) => void;
}

export default function CodeEditorPanel({
    code,
    setCode,
    onRun,
    onSubmit,
    editorLocked,
    setEditorLocked,
    language,
    setLanguage,
}: Props) {
    return (
        <div className="d-flex flex-column h-100">
            <div className="p-2 d-flex justify-content-between align-items-center border-bottom">
                <select
                    className="form-select w-auto"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={editorLocked}
                >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="csharp">C#</option>
                    <option value="javascript">JavaScript</option>
                </select>

                {editorLocked && (
                    <button
                        className="btn btn-warning ms-2"
                        onClick={() => setEditorLocked(false)}
                    >
                        Unlock Editor
                    </button>
                )}
            </div>

            <Editor
                height="100%"
                language={language}  
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{ readOnly: editorLocked, minimap: { enabled: false } }}
            />

            <div className="p-2 d-flex justify-content-end">
                <button
                    className="btn btn-secondary me-2"
                    onClick={onRun}
                    disabled={editorLocked}
                >
                    Run
                </button>
                <button
                    className="btn btn-primary"
                    onClick={onSubmit}
                    disabled={editorLocked}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
