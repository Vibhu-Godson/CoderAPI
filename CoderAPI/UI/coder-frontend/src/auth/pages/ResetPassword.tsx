import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../auth/component/Toast";

import {
    useSendPasswordResetOtpMutation,
    useValidateOtpMutation,
    useResetPasswordMutation
} from "../authApi";

const ResetPassword = () => {
    const navigate = useNavigate();

    // Toast state
    const [toastOpen, setToastOpen] = useState(false);
    const [toastTitle, setToastTitle] = useState("");
    const [toastKind, setToastKind] = useState<"success" | "error" | "info">("success");

    const showToast = (
        title: string,
        kind: "success" | "error" | "info" = "success"
    ) => {
        setToastTitle(title);
        setToastKind(kind);
        setToastOpen(true);
    };

    // Steps: 1 = Enter identifier, 2 = OTP, 3 = New password
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [value, setValue] = useState(""); // Email or Phone
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // API hooks
    const [sendOtp, { isLoading: sendingOtp }] = useSendPasswordResetOtpMutation();
    const [validateOtpFn, { isLoading: validatingOtp }] = useValidateOtpMutation();
    const [resetPasswordFn, { isLoading: resettingPassword }] = useResetPasswordMutation();

    // Step 1: Send OTP
    const handleSendOtp = async () => {
        if (!value.trim()) {
            showToast("Please enter email or WhatsApp number.", "error");
            return;
        }

        try {
            const res = await sendOtp({ value }).unwrap();
            if (res.status) {
                showToast("OTP sent successfully!", "success");
                setStep(2);
            } else {
                showToast(res.message, "error");
            }
        } catch (err: any) {
            showToast(err?.data?.message || "Failed to send OTP.", "error");
        }
    };

    // Step 2: Validate OTP
    const handleValidateOtp = async () => {
        if (!otp.trim()) {
            showToast("Enter the OTP.", "error");
            return;
        }

        try {
            const res = await validateOtpFn({
                otp,
                phone: value
            }).unwrap();

            if (res.status) {
                showToast("OTP verified!", "success");
                setStep(3);
            } else {
                showToast(res.message, "error");
            }
        } catch (err: any) {
            showToast(err?.data?.message || "OTP verification failed.", "error");
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            showToast("Both password fields are required.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        try {
            const res = await resetPasswordFn({
                userName: value,
                password: password,
            }).unwrap();

            if (res.status) {
                showToast("Password updated! Please log in.", "success");
                navigate("/login");
            } else {
                showToast(res.message, "error");
            }
        } catch (err: any) {
            showToast(err?.data?.message || "Password reset failed.", "error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md transition-all">

                <h1 className="text-2xl font-semibold text-center mb-6">
                    Reset Password
                </h1>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter Email or WhatsApp Number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            onClick={handleSendOtp}
                            disabled={sendingOtp}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {sendingOtp ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            onClick={handleValidateOtp}
                            disabled={validatingOtp}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {validatingOtp ? "Validating..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="space-y-4">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            onClick={handleResetPassword}
                            disabled={resettingPassword}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {resettingPassword ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                )}
            </div>

            {/* Toast Component */}
            <Toast
                open={toastOpen}
                onClose={() => setToastOpen(false)}
                title={toastTitle}
                kind={toastKind}
            />
        </div>
    );
};

export default ResetPassword;
