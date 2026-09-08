import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const result = await authService.login(formData);

            const role = result.data.user.role;

            if (role === 'TEAM_MEMBER') {
                navigate('/team');
            } else if (role === 'MANAGER' || role === 'ADMIN') {
                navigate('/manager');
            } else {
                setError('Invalid user role.');
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Weekly Work Reporting System</h1>

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p>
                    Don't have an account?{' '}
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;