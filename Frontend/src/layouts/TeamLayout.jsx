import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../services/auth.storage';

function TeamLayout({ children }) {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <div>
            <header>
                <h2>Weekly Work Reporting System</h2>

                <p>Welcome, {user?.name}</p>

                <nav>
                    <Link to="/team">Dashboard</Link>
                    {' | '}
                    <Link to="/team/reports">My Reports</Link>
                    {' | '}
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
}

export default TeamLayout;