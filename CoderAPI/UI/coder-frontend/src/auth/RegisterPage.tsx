// RegisterPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    useRegisterMutation,
    useCheckUserNameMutation,
    useGenerateOtpMutation,
    useValidateOtpMutation,
} from "./authApi";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "./component/Toast";

const COUNTRIES = [
    "India",
    "United States",
    "United Kingdom",
    "Australia",
    "Canada",
    "Germany",
    "France",
    "Sri Lanka",
    "Nepal",
];

const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
        className={`h-5 w-5 text-slate-500 transform transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"
            }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
    >
        {open ? (
            <>
                <path d="M2 2l20 20" />
                <path d="M9.88 9.88a3 3 0 104.24 4.24" />
                <path d="M6.1 6.1C3.9 7.6 2.3 9.6 1 12c2 4 6 7 11 7 2.3 0 4.5-.6 6.4-1.8" />
            </>
        ) : (
            <>
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

function OtpInputs({
    idPrefix,
    value,
    setValue,
    onComplete,
    disabled,
}: {
    idPrefix: string;
    value: string[];
    setValue: (v: string[]) => void;
    onComplete?: (otp: string) => void;
    disabled?: boolean;
}) {
    const refs = useRef<HTMLInputElement[]>([]);
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        const isComplete = value.every((d) => d.length === 1);
        if (isComplete && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onComplete?.(value.join(""));
        }
        if (!isComplete) hasTriggeredRef.current = false;
    }, [value, onComplete]);

    const handleChange = (ch: string, idx: number) => {
        if (!/^\d?$/.test(ch)) return;
        const next = [...value];
        next[idx] = ch;
        setValue(next);
        if (ch && idx < 5) refs.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        const k = e.key;
        if (k === "Backspace") {
            if (value[idx]) {
                const next = [...value];
                next[idx] = "";
                setValue(next);
            } else if (idx > 0) {
                refs.current[idx - 1]?.focus();
                const next = [...value];
                next[idx - 1] = "";
                setValue(next);
            }
        } else if (k === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus();
        else if (k === "ArrowRight" && idx < 5) refs.current[idx + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(text)) {
            const arr = text.split("");
            setValue(arr);
            refs.current[5]?.focus();
        }
    };

    return (
        <div className="flex gap-2 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    id={`${idPrefix}-otp-${i}`}
                    ref={(el) => {
                        if (el) refs.current[i] = el;
                    }}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(e.target.value.replace(/\D/g, ""), i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    maxLength={1}
                    disabled={disabled}
                    className="w-11 h-11 text-center text-lg rounded-xl border border-slate-300 focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.12)] outline-none transition-shadow duration-150"
                />
            ))}
        </div>
    );
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [checkUserName] = useCheckUserNameMutation();
    const [generateOtp] = useGenerateOtpMutation();
    const [validateOtp] = useValidateOtpMutation();

    const [form, setForm] = useState({
        profileImageBase64: null as string | null,
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        loginPassword: "",
        confirmPassword: "",
        country: "",
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [touched, setTouched] = useState<any>({});
    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        msg: "",
        kind: "success" as "success" | "error",
    });

    const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
    const usernameDebounceRef = useRef<number | null>(null);

    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [phoneOtpValue, setPhoneOtpValue] = useState(["", "", "", "", "", ""]);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneVerifying, setPhoneVerifying] = useState(false);
    const [phoneCooldown, setPhoneCooldown] = useState(0);

    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtpValue, setEmailOtpValue] = useState(["", "", "", "", "", ""]);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailCooldown, setEmailCooldown] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        if (phoneCooldown > 0) {
            timer = setInterval(() => {
                setPhoneCooldown((sec) => Math.max(0, sec - 1));
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [phoneCooldown]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null;
        if (emailCooldown > 0) {
            timer = setInterval(() => {
                setEmailCooldown((sec) => Math.max(0, sec - 1));
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [emailCooldown]);

    function toBase64(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve((reader.result as string).split(",")[1] ?? "");
            reader.readAsDataURL(file);
        });
    }

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}<>])[A-Za-z\d@$!%*?&#^()[\]{}<>]{8,}$/;

    const canSubmit = useMemo(() => {
        return (
            !!form.firstName &&
            !!form.lastName &&
            !!form.userName &&
            /.+@.+\..+/.test(form.email) &&
            /^(?:\+?\d{7,15})$/.test(form.phoneNumber) &&
            strongPasswordRegex.test(form.loginPassword) &&
            form.loginPassword === form.confirmPassword &&
            !!form.country &&
            phoneVerified &&
            emailVerified
        );
    }, [form, phoneVerified, emailVerified]);

    const handleImage = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const base64 = await toBase64(file);
        setPreview(URL.createObjectURL(file));
        setForm({ ...form, profileImageBase64: base64 });
    };

    const handleChange = (e: any) => {
        setTouched({ ...touched, [e.target.name]: true });
        setForm({ ...form, [e.target.name]: e.target.value });

        if (e.target.name === "userName") {
            setUsernameAvailable(null);
            if (usernameDebounceRef.current)
                window.clearTimeout(usernameDebounceRef.current);
            usernameDebounceRef.current = window.setTimeout(async () => {
                const v = e.target.value?.trim();
                if (!v || v.length < 3) {
                    setUsernameAvailable(null);
                    return;
                }
                try {
                    const res: any = await checkUserName({ value: v }).unwrap();
                    setUsernameAvailable(!!res.status);
                } catch {
                    setUsernameAvailable(false);
                }
            }, 450);
        }
    };

    useEffect(() => {
        const e: any = {};
        if (touched.userName && form.userName.length < 3)
            e.userName = "Username too short";
        if (touched.email && !/.+@.+\..+/.test(form.email))
            e.email = "Invalid email";
        if (
            touched.phoneNumber &&
            !/^(?:\+?\d{7,15})$/.test(form.phoneNumber)
        )
            e.phoneNumber = "Invalid phone number";
        if (touched.loginPassword && !strongPasswordRegex.test(form.loginPassword))
            e.loginPassword =
                "Password must be strong (8 chars, upper, lower, number, symbol)";
        if (
            touched.confirmPassword &&
            form.confirmPassword &&
            form.loginPassword !== form.confirmPassword
        )
            e.confirmPassword = "Passwords do not match";
        setErrors(e);
    }, [form, touched]);

    const handleSendOtp = async (target: "phone" | "email") => {
        const value = target === "phone" ? form.phoneNumber : form.email;
        if (!value) {
            setToast({
                open: true,
                msg: `Enter ${target === "phone" ? "phone" : "email"}`,
                kind: "error",
            });
            return;
        }

        if (target === "phone" && phoneCooldown > 0) return;
        if (target === "email" && emailCooldown > 0) return;

        try {
            const res: any = await generateOtp({ value }).unwrap();
            if (res.status) {
                setToast({
                    open: true,
                    msg: `OTP sent to ${target}`,
                    kind: "success",
                });

                if (target === "phone") {
                    setPhoneOtpSent(true);
                    setPhoneOtpValue(["", "", "", "", "", ""]);
                    setPhoneCooldown(30);
                } else {
                    setEmailOtpSent(true);
                    setEmailOtpValue(["", "", "", "", "", ""]);
                    setEmailCooldown(30);
                }
            } else {
                setToast({
                    open: true,
                    msg: res.message || "Could not send OTP",
                    kind: "error",
                });
            }
        } catch {
            setToast({
                open: true,
                msg: "Could not send OTP",
                kind: "error",
            });
        }
    };

    const handleValidateOtp = async (target: "phone" | "email", otp: string) => {
        if (!otp || otp.length !== 6) {
            setToast({
                open: true,
                msg: "Enter 6 digit OTP",
                kind: "error",
            });
            return;
        }
        try {
            if (target === "phone") setPhoneVerifying(true);
            else setEmailVerifying(true);

            const payload = {
                otp,
                phone: target === "phone" ? form.phoneNumber : form.email,
            };
            const res: any = await validateOtp(payload).unwrap();

            if (res.status) {
                setToast({
                    open: true,
                    msg: `${target} verified`,
                    kind: "success",
                });
                if (target === "phone") {
                    setPhoneVerified(true);
                    setPhoneOtpSent(false);
                } else {
                    setEmailVerified(true);
                    setEmailOtpSent(false);
                }
            } else {
                setToast({
                    open: true,
                    msg: res.message || "Invalid OTP",
                    kind: "error",
                });
            }
        } catch {
            setToast({
                open: true,
                msg: "OTP validation failed",
                kind: "error",
            });
        } finally {
            if (target === "phone") setPhoneVerifying(false);
            else setEmailVerifying(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!canSubmit) {
            setToast({
                open: true,
                msg: "Fix errors & verify OTPs before submitting",
                kind: "error",
            });
            return;
        }
        const { confirmPassword, ...payload } = form;
        try {
            const result = await registerUser(payload).unwrap();
            if (result.status) {
                setToast({
                    open: true,
                    msg: "Account created successfully!",
                    kind: "success",
                });
                setTimeout(() => navigate("/login"), 500);
            } else {
                setToast({
                    open: true,
                    msg: result.message || "Registration failed",
                    kind: "error",
                });
            }
        } catch {
            setToast({
                open: true,
                msg: "Registration failed",
                kind: "error",
            });
        }
    };

    return (
        <div
            style={{
                fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-indigo-50 px-4"
        >
            <div
                className="w-full max-w-3xl bg-white rounded-3xl p-6"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
                <h2 className="text-3xl tracking-tight text-center font-semibold text-[#0F172A]">
                    Create your account
                </h2>

                <div className="mt-6 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border shadow-sm">
                        {preview ? (
                            <img
                                src={preview}
                                className="w-full h-full object-cover"
                                alt="profile preview"
                            />
                        ) : (
                            <span className="text-xs text-slate-500">No Image</span>
                        )}
                    </div>

                    <label className="cursor-pointer mt-3 px-3 py-1 text-sm bg-white border rounded-xl hover:bg-slate-50 shadow-sm">
                        Upload
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </label>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            First Name
                        </label>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.08)] outline-none transition-shadow duration-150"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            Last Name
                        </label>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.08)] outline-none transition-shadow duration-150"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            Username
                        </label>
                        <input
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            className={`mt-1 w-full px-3 py-2 rounded-xl border ${errors.userName
                                    ? "border-red-500"
                                    : "border-slate-300"
                                } focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.08)] outline-none transition-shadow duration-150`}
                        />
                        {errors.userName && (
                            <p className="text-xs text-red-500">
                                {errors.userName}
                            </p>
                        )}

                        {form.userName.length >= 3 &&
                            usernameAvailable === true && (
                                <p className="text-xs text-green-600 mt-1">
                                    Username is available ✓
                                </p>
                            )}
                        {form.userName.length >= 3 &&
                            usernameAvailable === false && (
                                <p className="text-xs text-red-600 mt-1">
                                    Username already taken ✗
                                </p>
                            )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`mt-1 w-full px-3 py-2 rounded-xl border ${errors.email
                                        ? "border-red-500"
                                        : "border-slate-300"
                                    } focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.08)] outline-none transition-shadow duration-150`}
                            />
                            {!emailVerified  && (
                                <button
                                    type="button"
                                    onClick={() => handleSendOtp("email")}
                                    disabled={!form.email || errors.email || emailCooldown > 0}
                                    className={`mt-1 px-3 py-2 rounded-xl shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 bg-[#4F46E5] text-white`}
                                >
                                    {emailCooldown > 0 ? `${emailCooldown}s` : "Send OTP"}
                                </button>
                            )}
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}

                        {emailVerified ? (
                            <p className="text-xs text-green-600 mt-1">
                                Email verified ✓
                            </p>
                        ) : (
                            emailOtpSent && (
                                <div>
                                    <OtpInputs
                                        idPrefix="email"
                                        value={emailOtpValue}
                                        setValue={setEmailOtpValue}
                                        onComplete={(otp) =>
                                            handleValidateOtp("email", otp)
                                        }
                                    />
                                    <div className="flex gap-2 mt-2 items-center">
                                        <button
                                            type="button"
                                            disabled={emailCooldown > 0}
                                            className="text-sm text-[#4F46E5] underline disabled:opacity-50"
                                            onClick={() => handleSendOtp("email")}
                                        >
                                            {emailCooldown > 0
                                                ? `Resend in ${emailCooldown}s`
                                                : "Resend"}
                                        </button>
                                        {emailVerifying && (
                                            <p className="text-xs text-slate-500">
                                                Verifying...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            WhatsApp Number
                        </label>
                        <div className="flex gap-2">
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                className={`mt-1 w-full px-3 py-2 rounded-xl border ${errors.phoneNumber
                                        ? "border-red-500"
                                        : "border-slate-300"
                                    } focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.08)] outline-none transition-shadow duration-150`}
                            />
                            {!phoneVerified && (
                                <button
                                    type="button"
                                    onClick={() => handleSendOtp("phone")}
                                    disabled={!form.phoneNumber || errors.phoneNumber || phoneCooldown > 0}
                                    className="mt-1 px-3 py-2 rounded-xl bg-[#4F46E5] text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
                                >
                                    {phoneCooldown > 0 ? `${phoneCooldown}s` : "Send OTP"}
                                </button>
                            )}
                        </div>
                        {errors.phoneNumber && (
                            <p className="text-xs text-red-500">
                                {errors.phoneNumber}
                            </p>
                        )}

                        {phoneVerified ? (
                            <p className="text-xs text-green-600 mt-1">
                                WhatsApp verified ✓
                            </p>
                        ) : (
                            phoneOtpSent && (
                                <div>
                                    <OtpInputs
                                        idPrefix="phone"
                                        value={phoneOtpValue}
                                        setValue={setPhoneOtpValue}
                                        onComplete={(otp) =>
                                            handleValidateOtp("phone", otp)
                                        }
                                    />
                                    <div className="flex gap-2 mt-2 items-center">
                                        <button
                                            type="button"
                                            disabled={phoneCooldown > 0}
                                            className="text-sm text-[#4F46E5] underline disabled:opacity-50"
                                            onClick={() => handleSendOtp("phone")}
                                        >
                                            {phoneCooldown > 0
                                                ? `Resend in ${phoneCooldown}s`
                                                : "Resend"}
                                        </button>
                                        {phoneVerifying && (
                                            <p className="text-xs text-slate-500">
                                                Verifying...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            Password
                        </label>
                        <div className="mt-1 flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:shadow-[0_6px_18px_rgba(79,70,229,0.08)] transition-shadow duration-150">
                            <input
                                name="loginPassword"
                                type={showPass1 ? "text" : "password"}
                                value={form.loginPassword}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass1((s) => !s)}
                                className="p-1 rounded hover:bg-slate-100 transition-colors"
                            >
                                <EyeIcon open={showPass1} />
                            </button>
                        </div>
                        {errors.loginPassword && (
                            <p className="text-xs text-red-500">
                                {errors.loginPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            Confirm Password
                        </label>
                        <div className="mt-1 flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:shadow-[0_6px_18px_rgba(79,70,229,0.08)] transition-shadow duration-150">
                            <input
                                name="confirmPassword"
                                type={showPass2 ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass2((s) => !s)}
                                className="p-1 rounded hover:bg-slate-100 transition-colors"
                            >
                                <EyeIcon open={showPass2} />
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">
                            Country
                        </label>
                        <select
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.08)] outline-none transition-shadow duration-150"
                        >
                            <option value="">Select country</option>
                            {COUNTRIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={!canSubmit || isLoading}
                            className={`w-full py-2.5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-150 ${!canSubmit || isLoading
                                    ? "opacity-50 bg-slate-200"
                                    : "bg-[#4F46E5] text-white hover:-translate-y-0.5"
                                }`}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>

                        <p className="text-xs text-slate-500 mt-2">
                            Verify WhatsApp and Email to complete your
                            registration.
                        </p>
                    </div>
                </form>

                <p className="text-center text-sm text-slate-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#4F46E5] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            <Toast
                kind={toast.kind}
                open={toast.open}
                title={toast.msg}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
            />
        </div>
    );
}
