import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../services/auth.storage';

function ManagerLayout({ children }) {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <div>
            <header>
                <h2>Manager Dashboard</h2>

                <p>Welcome, {user?.name}</p>

                <nav>
                    <Link to="/manager">Dashboard</Link>
                    {' | '}
                    <Link to="/manager/reports">Reports</Link>
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

export default ManagerLayout;