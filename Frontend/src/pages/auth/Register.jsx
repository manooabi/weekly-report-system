import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(formData);

            setSuccess(
                'Registration successful. Please login.'
            );

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Registration failed. Please try again.'
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
                    <h1>Create your account</h1>

                    <p>
                        Set up your account to start managing
                        weekly work reports.
                    </p>
                </div>

                {error && (
                    <div className="auth-alert auth-alert-error">
                        <span className="auth-alert-icon">!</span>

                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="auth-alert auth-alert-success">
                        <span className="auth-alert-icon">✓</span>

                        <span>{success}</span>
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="auth-form-group">
                        <label htmlFor="name">
                            Full name
                        </label>

                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">
                                ●
                            </span>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
                                minLength="8"
                                autoComplete="new-password"
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

                        <span className="auth-field-hint">
                            Password must contain at least 8 characters.
                        </span>
                    </div>

                    <button
                        className="auth-submit-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="auth-button-spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            'Create account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>

                    <Link to="/login">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;