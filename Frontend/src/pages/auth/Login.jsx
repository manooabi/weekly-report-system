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
    const [showPassword, setShowPassword] = useState(false);

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
            <div className="auth-background-shape auth-shape-one"></div>
            <div className="auth-background-shape auth-shape-two"></div>

            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        WR
                    </div>

                    <div>
                        <div className="auth-brand-name">
                            WorkReport
                        </div>

                        <div className="auth-brand-subtitle">
                            Weekly Work Reporting System
                        </div>
                    </div>
                </div>

                <div className="auth-heading">
                    <h1>Welcome back</h1>

                    <p>
                        Sign in to continue to your workspace.
                    </p>
                </div>

                {error && (
                    <div className="auth-alert auth-alert-error">
                        <span className="auth-alert-icon">!</span>

                        <span>{error}</span>
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="auth-form-group">
                        <label htmlFor="email">
                            Email address
                        </label>

                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                @
                            </span>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                •
                            </span>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        className="auth-submit-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="auth-button-spinner"></span>
                                Logging in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account?</span>

                    <Link to="/register">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;