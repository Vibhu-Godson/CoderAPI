import React, { useState } from "react";

const ResetPassword: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        setLoading(true);
        try {
            await fetch("/auth/send-reset-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: identifier, whatsapp: identifier }),
            });
            setStep(2);
        } catch (err) {
            console.error(err);
            alert("Failed to send OTP.");
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        setLoading(true);
        try {
            await fetch("/auth/verify-reset-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, otp }),
            });
            setStep(3);
        } catch (err) {
            console.error(err);
            alert("Incorrect OTP.");
        }
        setLoading(false);
    };

    const resetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await fetch("/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, newPassword: password }),
            });

            alert("Password changed successfully!");
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            alert("Failed to reset password.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Reset Password
                </h2>

                {/* Step 1 - Enter Email / WhatsApp */}
                {step === 1 && (
                    <>
                        <input
                            type="text"
                            placeholder="Email or WhatsApp"
                            className="w-full p-3 border rounded-lg mb-4"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* Step 2 - Verify OTP */}
                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full p-3 border rounded-lg mb-4"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {/* Step 3 - Create New Password */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full p-3 border rounded-lg mb-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full p-3 border rounded-lg mb-4"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            onClick={resetPassword}
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                        >
                            {loading ? "Saving..." : "Update Password"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
