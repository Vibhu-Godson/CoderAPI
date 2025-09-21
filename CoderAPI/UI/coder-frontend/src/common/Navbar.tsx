import { Link, useNavigate } from "react-router-dom";

interface Props {
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;
}

export default function Navbar({ isAuthenticated, setIsAuthenticated }: Props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">CoderApp</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/problems">Problems</Link>
                            </li>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
