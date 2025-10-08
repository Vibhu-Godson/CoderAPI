import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface Props {
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;
}

export default function Navbar({ isAuthenticated, setIsAuthenticated }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // 🔒 Hide navbar on login & signup pages
    if (!isAuthenticated || location.pathname === "/login" || location.pathname === "/signup") {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/login");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
        }
    };

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="text-xl font-semibold">
                    AmCoder
                </Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>

                {/* Navigation Links */}
                <div
                    className={`${isMenuOpen ? "block" : "hidden"
                        } md:flex md:items-center md:space-x-6 w-full md:w-auto mt-3 md:mt-0`}
                >
                    <Link to="/" className="block py-2 hover:text-blue-400">
                        Home
                    </Link>
                    <Link to="/problems" className="block py-2 hover:text-blue-400">
                        Problems
                    </Link>
                    <Link to="/courses" className="block py-2 hover:text-blue-400">
                        Courses
                    </Link>
                    <Link to="/community" className="block py-2 hover:text-blue-400">
                        Community
                    </Link>
                    <Link to="/plans" className="block py-2 hover:text-blue-400">
                        Plans
                    </Link>
                </div>

                {/* Right-side controls */}
                <div className="flex items-center space-x-4">
                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-800 rounded-md px-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm px-2 py-1 text-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>User Name</span>
                            <span>▼</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
