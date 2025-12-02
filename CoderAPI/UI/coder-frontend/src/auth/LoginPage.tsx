// src/features/Auth/LoginPage.tsx
import { useState } from "react";
import { useLoginMutation, useLazyUserOnboardDoneQuery } from "./authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Toast } from "./component/Toast";

const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
        className={`h-5 w-5 text-slate-500 transform transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"
            }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
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

export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    const [toast, setToast] = useState({
        open: false,
        msg: "",
        kind: "success" as "success" | "error",
    });

    const [login, { isLoading }] = useLoginMutation();
    const [triggerOnboardCheck] = useLazyUserOnboardDoneQuery();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/home";

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const result = await login({ userName, password }).unwrap();

            if (result.status) {
                dispatch(
                    setCredentials({
                        token: result.token,
                        userName: result.userName,
                        profileImageBase64: result.profileImageBase64,
                    })
                );

                setToast({
                    open: true,
                    msg: `Welcome ${result.userName}!`,
                    kind: "success",
                });

                // small delay for UX; then trigger onboarding check via RTK Query lazy trigger
                setTimeout(async () => {
                    try {
                        // trigger expects an argument; pass undefined
                        const onboardResAny = await triggerOnboardCheck(undefined);
                        // trigger returns an object; if using unwrap pattern, you can do:
                        // const onboardResAny = await triggerOnboardCheck(undefined).unwrap();
                        // but to be robust across RTK versions, check .data or the object directly:

                        // possible shapes:
                        // - if trigger returned plain data: onboardResAny === { status: boolean, message: string }
                        // - if RTK returns { data: ... } use onboardResAny.data
                        const onboardData =
                            (onboardResAny && (onboardResAny as any).data) ||
                            (onboardResAny as any);

                        if (onboardData?.status === true) {
                            navigate("/", { replace: true });
                        } else {
                            navigate("/onboarding", { replace: true });
                        }
                    } catch (err) {
                        // fallback to onboarding on any failure
                        navigate("/", { replace: true });
                    }
                }, 300);
            } else {
                setToast({
                    open: true,
                    msg: result.message || "Incorrect username or password",
                    kind: "error",
                });
            }
        } catch {
            setToast({ open: true, msg: "Login failed", kind: "error" });
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
                className="w-full max-w-md bg-white rounded-3xl p-8"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
                <h2 className="text-3xl tracking-tight text-center font-semibold text-[#0F172A]">
                    Welcome back 👋
                </h2>
                <p className="text-center text-sm text-slate-500">
                    Sign in to continue your coding journey
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-[#334155]">Username</label>
                        <input
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 focus:shadow-[0_6px_18px_rgba(79,70,229,0.10)] transition-shadow duration-150"
                            placeholder="your_username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#334155]">Password</label>
                        <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 focus-within:border-indigo-600 focus-within:shadow-[0_6px_18px_rgba(79,70,229,0.10)] transition-shadow duration-150">
                            <input
                                type={showPass ? "text" : "password"}
                                className="w-full outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                                <EyeIcon open={showPass} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2.5 bg-[#4F46E5] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-transform duration-150 ${isLoading ? "opacity-50" : "hover:-translate-y-0.5"}`}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-xs text-slate-500">or</span>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                <p className="text-center text-sm text-slate-600 mt-6">
                    New user?{" "}
                    <Link to="/register" className="text-[#4F46E5] hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>

            <Toast open={toast.open} title={toast.msg} kind={toast.kind} onClose={() => setToast((t) => ({ ...t, open: false }))} />
        </div>
    );
}
