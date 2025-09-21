import { useState } from 'react';
import { useRegisterMutation } from './authApi';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const [form, setForm] = useState({
        userId: 0,
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        loginPassword: '',
        profileImage: '',
        country: '',
    });
    const [registerUser, { isLoading, error }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await registerUser(form).unwrap();
        if (result.status) {
            navigate('/login');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="mb-4 text-center">Register</h3>
                <form onSubmit={handleSubmit}>
                    {Object.keys(form).map((key) => (
                        <input
                            key={key}
                            className="form-control mb-3"
                            placeholder={key}
                            name={key}
                            value={(form as any)[key]}
                            onChange={handleChange}
                        />
                    ))}
                    <button className="btn btn-success w-100" type="submit" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="mt-3 text-center">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                {error && <div className="alert alert-danger mt-2">Registration failed</div>}
            </div>
        </div>
    );
}
