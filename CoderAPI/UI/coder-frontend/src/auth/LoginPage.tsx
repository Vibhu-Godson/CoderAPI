import { useState } from 'react';
import { useLoginMutation } from './authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login({ userName, password }).unwrap();
        if (result.status) {
            dispatch(setCredentials({ token: result.token, userName: result.userName }));
            navigate('/problems');
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
                {error && <div className="alert alert-danger mt-2">Login failed</div>}
            </div>
        </div>
    );
}
