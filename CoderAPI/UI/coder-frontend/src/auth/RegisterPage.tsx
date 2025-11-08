import { useEffect, useState, useMemo } from "react";
import { useRegisterMutation } from "./authApi";
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

export default function RegisterPage() {
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterMutation();

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

    function toBase64(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve((reader.result as string).split(",")[1] ?? "");
            reader.readAsDataURL(file);
        });
    }

    const canSubmit = useMemo(() => {
        return (
            form.firstName &&
            form.lastName &&
            form.userName &&
            /.+@.+\..+/.test(form.email) &&
            /^(?:\+?\d{7,15})$/.test(form.phoneNumber) &&
            form.loginPassword.length >= 6 &&
            form.loginPassword === form.confirmPassword &&
            form.country
        );
    }, [form]);

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
    };

    useEffect(() => {
        const e: any = {};

        if (touched.userName && form.userName.length < 3)
            e.userName = "Username too short";

        if (touched.email && !/.+@.+\..+/.test(form.email))
            e.email = "Invalid email";

        if (touched.phoneNumber && !/^(?:\+?\d{7,15})$/.test(form.phoneNumber))
            e.phoneNumber = "Invalid phone number";

        if (
            touched.confirmPassword &&
            form.confirmPassword &&
            form.loginPassword !== form.confirmPassword
        )
            e.confirmPassword = "Passwords do not match";

        setErrors(e);
    }, [form, touched]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!canSubmit) {
            setToast({
                open: true,
                msg: "Fix errors before submitting",
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
            setToast({ open: true, msg: "Registration failed", kind: "error" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4">
            <div className="w-full max-w-3xl bg-white shadow-xl border rounded-2xl p-6">

                <h2 className="text-center text-2xl font-semibold text-slate-800">
                    Create your account
                </h2>

                {/* PROFILE IMAGE BLOCK */}
                <div className="mt-6 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border shadow">
                        {preview ? (
                            <img src={preview} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-slate-500">No Image</span>
                        )}
                    </div>

                    <label className="cursor-pointer mt-3 px-3 py-1 text-sm bg-slate-100 border rounded-xl hover:bg-slate-200">
                        Upload
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </label>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* First Name */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            First Name
                        </label>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Last Name
                        </label>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Username
                        </label>
                        <input
                            name="userName"
                            value={form.userName}
                            onChange={handleChange}
                            className={`mt-1 w-full px-3 py-2 rounded-xl border ${errors.userName ? "border-red-500" : "border-slate-300"
                                }`}
                        />
                        {errors.userName && (
                            <p className="text-xs text-red-500">{errors.userName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`mt-1 w-full px-3 py-2 rounded-xl border ${errors.email ? "border-red-500" : "border-slate-300"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Phone Number
                        </label>
                        <input
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            className={`mt-1 w-full px-3 py-2 rounded-xl border ${errors.phoneNumber ? "border-red-500" : "border-slate-300"
                                }`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <div className="mt-1 flex items-center border border-slate-300 rounded-xl px-3 py-2">
                            <input
                                name="loginPassword"
                                type={showPass1 ? "text" : "password"}
                                value={form.loginPassword}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            <button type="button" onClick={() => setShowPass1(!showPass1)}>
                                <EyeIcon open={showPass1} />
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>

                        <div className="mt-1 flex items-center border border-slate-300 rounded-xl px-3 py-2">
                            <input
                                name="confirmPassword"
                                type={showPass2 ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                            <button type="button" onClick={() => setShowPass2(!showPass2)}>
                                <EyeIcon open={showPass2} />
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Country */}
                    <div>
                        <label className="text-sm font-medium text-slate-700">Country</label>
                        <select
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
                        >
                            <option value="">Select country</option>
                            {COUNTRIES.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={!canSubmit || isLoading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-slate-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
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
