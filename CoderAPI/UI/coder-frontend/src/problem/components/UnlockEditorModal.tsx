// src/components/UnlockEditorModal.tsx

import React from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    onUnlockAnyway: () => void;
}

export default function UnlockEditorModal({ show, onClose, onUnlockAnyway }: Props) {
    if (!show) return null;

    return (
        <div
            className="modal d-block"
            tabIndex={-1}
            style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'absolute', // Ensures modal is positioned correctly over the CodeEditorPanel
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1050 // Bootstrap modal z-index
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Unlock Editor?</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>First, you should explain your approach to the chatbot. If your approach is correct (accuracy &gt; 50%), the editor will be unlocked automatically.</p>
                        <p className="fw-bold text-danger">Are you sure you want to unlock it without AI validation?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            OK
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => { onUnlockAnyway(); onClose(); }}>
                            Unlock Anyway
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
