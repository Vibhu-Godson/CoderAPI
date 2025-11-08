// src/features/Auth/LoginPage.tsx
import { useState } from "react";
import { useLoginMutation, useSocialLoginMutation } from "./authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Toast } from "./component/Toast";

const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
        className="h-5 w-5 text-slate-500"
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

const GoogleIcon = () => (
    <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="w-5 h-5"
    />
);

const FacebookIcon = () => (
    <img
        src="https://www.svgrepo.com/show/475647/facebook-color.svg"
        alt="fb"
        className="w-5 h-5"
    />
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
    const [socialLogin] = useSocialLoginMutation();

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
                setToast({ open: true, msg: `Welcome ${result.userName}!`, kind: "success" });
                setTimeout(() => navigate(from, { replace: true }), 300);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-slate-200 p-6">
                <h2 className="text-center text-2xl font-semibold text-slate-900">
                    Welcome back
                </h2>
                <p className="text-center text-sm text-slate-500">
                    Sign in to continue
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">Username</label>
                        <input
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="your_username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                            <input
                                type={showPass ? "text" : "password"}
                                className="w-full outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                <EyeIcon open={showPass} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-xs text-slate-500">or</span>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 border border-slate-300 py-2 rounded-xl hover:bg-slate-50">
                        <GoogleIcon /> Google
                    </button>

                    <button className="flex items-center justify-center gap-2 border border-slate-300 py-2 rounded-xl hover:bg-slate-50">
                        <FacebookIcon /> Facebook
                    </button>
                </div>

                <p className="text-center text-sm text-slate-600 mt-6">
                    New user?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>

            <Toast
                open={toast.open}
                title={toast.msg}
                kind={toast.kind}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
            />
        </div>
    );
}
