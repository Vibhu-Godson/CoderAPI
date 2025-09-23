import { useState } from 'react';
import { useLoginMutation } from './authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ userName, password }).unwrap();
            if (result.status) {
                // ✅ Success case
                dispatch(setCredentials({ token: result.token, userName: result.userName }));
                setToastType('success');
                setToastMessage(`Welcome ${result.userName}!`);
                setTimeout(() => {
                    setToastMessage(null);
                    navigate('/problems');
                }, 2000); // auto-close after 2s then navigate
            } else {
                // ❌ Incorrect username/password
                setToastType('error');
                setToastMessage(result.message || 'Incorrect username or password');
                setTimeout(() => setToastMessage(null), 2500);
            }
        } catch {
            setToastType('error');
            setToastMessage('Something went wrong, please try again.');
            setTimeout(() => setToastMessage(null), 2500);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="mb-4 text-center">Login</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        className="form-control mb-3"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Don’t have an account? <Link to="/register">Register</Link>
                </p>
            </div>

            {/* ✅ Toast Notification */}
            {toastMessage && (
                <div
                    className={`toast align-items-center text-white position-fixed bottom-0 end-0 m-3 show ${toastType === 'success' ? 'bg-success' : 'bg-danger'
                        }`}
                    role="alert"
                >
                    <div className="d-flex">
                        <div className="toast-body">{toastMessage}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
