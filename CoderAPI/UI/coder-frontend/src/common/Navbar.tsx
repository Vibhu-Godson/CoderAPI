import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";

import {
    Home,
    Grid,
    BookOpen,
    Users,
    IndianRupee,
    Menu,
    X
} from "lucide-react"; // ✅ No TS errors

function getInitials(name?: string | null) {
    if (!name) return "U";
    const parts = name.trim().split(/\s+|_/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useSelector((s: any) => s.auth?.isAuthenticated);
    const userName = useSelector((s: any) => s.auth?.userName);
    const avatar = useSelector((s: any) => s.auth?.profileImageBase64);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // ✅ Close dropdown when authentication state changes
    useEffect(() => {
        setDropdownOpen(false);
        setIsMenuOpen(false);
    }, [isAuthenticated]);

    useEffect(() => {
        const clickOutside = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", clickOutside);
        return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    // Hide navbar on auth pages
    if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/reset-password") {
        return null;
    }

    const navClass = ({ isActive }: any) =>
        `px-3 py-2 rounded-lg transition font-medium ${isActive ? "text-indigo-600" : "text-slate-700"
        } hover:text-indigo-600`;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="backdrop-blur bg-white/80 shadow-lg border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                {/* Brand */}
                <Link
                    to="/"
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                >
                    AmCoder
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={navClass}>
                        <div className="flex items-center gap-1">
                            <Home size={18} /> Home
                        </div>
                    </NavLink>

                    <NavLink to="/problems" className={navClass}>
                        <div className="flex items-center gap-1">
                            <Grid size={18} /> Problems
                        </div>
                    </NavLink>

                    {/*<NavLink to="/courses" className={navClass}>*/}
                    {/*    <div className="flex items-center gap-1">*/}
                    {/*        <BookOpen size={18} /> Courses*/}
                    {/*    </div>*/}
                    {/*</NavLink>*/}

                    <NavLink to="/community" className={navClass}>
                        <div className="flex items-center gap-1">
                            <Users size={18} /> Community
                        </div>
                    </NavLink>

                    <NavLink to="/plans" className={navClass}>
                        <div className="flex items-center gap-1">
                            <IndianRupee size={18} /> Plans
                        </div>
                    </NavLink>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Avatar dropdown / Login button */}
                {isAuthenticated ? (
                    <div className="hidden md:block relative" ref={dropdownRef}>
                        <button
                            className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition"
                            onClick={() => setDropdownOpen((v) => !v)}
                        >
                            {avatar ? (
                                <img
                                    src={`data:image/*;base64,${avatar}`}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center font-semibold">
                                    {getInitials(userName)}
                                </div>
                            )}

                            <span className="font-medium text-slate-700">{userName}</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border rounded-xl overflow-hidden">
                            <Link to={`/profile/${userName}`} className="block px-4 py-3 hover:bg-slate-100">
                                Profile
                            </Link>
                            <Link to="/settings" className="block px-4 py-3 hover:bg-slate-100">
                                Settings
                            </Link>
                            <Link to="/feedback" className="block px-4 py-3 hover:bg-slate-100">
                                Feedback
                            </Link>
                            <Link to="/contact-us" className="block px-4 py-3 hover:bg-slate-100">
                                Contact Us
                            </Link>
                            
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="hidden md:inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                        Login
                    </Link>
                )}

            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur">
                    <div className="flex flex-col space-y-1 px-4 py-2">
                        <NavLink to="/" className={({ isActive }) => `block px-3 py-2 rounded-lg transition font-medium ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-700"} hover:text-indigo-600`}>
                            <div className="flex items-center gap-1">
                                <Home size={18} /> Home
                            </div>
                        </NavLink>

                        <NavLink to="/problems" className={({ isActive }) => `block px-3 py-2 rounded-lg transition font-medium ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-700"} hover:text-indigo-600`}>
                            <div className="flex items-center gap-1">
                                <Grid size={18} /> Problems
                            </div>
                        </NavLink>

                        <NavLink to="/plans" className={({ isActive }) => `block px-3 py-2 rounded-lg transition font-medium ${isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-700"} hover:text-indigo-600`}>
                            <div className="flex items-center gap-1">
                                <IndianRupee size={18} /> Plans
                            </div>
                        </NavLink>

                        {/* Mobile user menu */}
                        {isAuthenticated ? (
                        <div className="border-t border-slate-200 pt-2 mt-2">
                            <Link to={`/profile/${userName}`} className="block px-3 py-2 rounded-lg hover:bg-slate-100">
                                Profile
                            </Link>
                            <Link to="/settings" className="block px-3 py-2 rounded-lg hover:bg-slate-100">
                                Settings
                            </Link>
                            <Link to="/feedback" className="block px-3 py-2 rounded-lg hover:bg-slate-100">
                                Feedback
                            </Link>
                            <Link to="/contact-us" className="block px-3 py-2 rounded-lg hover:bg-slate-100">
                                Contact Us
                            </Link>
                            
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                Logout
                            </button>
                        </div>                        ) : (
                        <Link
                            to="/login"
                            className="block px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-center mt-2"
                        >
                            Login
                        </Link>
                        )}                    </div>
                </div>
            )}
        </nav>
    );
}
