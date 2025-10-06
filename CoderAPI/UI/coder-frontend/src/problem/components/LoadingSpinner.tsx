import React from "react";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "80vh" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Fetching problem details...</p>
        </div>
    );
};

export default LoadingSpinner;
