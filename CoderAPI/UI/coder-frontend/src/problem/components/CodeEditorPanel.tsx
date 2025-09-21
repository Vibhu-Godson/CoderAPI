import Editor from "@monaco-editor/react";

interface Props {
    code: string;
    setCode: (val: string) => void;
    onRun: () => void;
    onSubmit: () => void;
    editorLocked: boolean;
}

export default function CodeEditorPanel({ code, setCode, onRun, onSubmit, editorLocked }: Props) {
    return (
        <div className="d-flex flex-column h-100">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{ readOnly: editorLocked, minimap: { enabled: false } }}
            />
            <div className="p-2 d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={onRun} disabled={editorLocked}>Run</button>
                <button className="btn btn-primary" onClick={onSubmit} disabled={editorLocked}>Submit</button>
            </div>
        </div>
    );
}
