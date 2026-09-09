import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../services/auth.storage';

function TeamLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const isDashboardActive = location.pathname === '/team';

    const isReportsActive =
        location.pathname === '/team/reports' ||
        location.pathname.startsWith('/team/reports/');

    return (
        <div className="team-layout">
            <aside className="team-sidebar">
                <div className="team-brand">
                    <div className="team-brand-icon">
                        WR
                    </div>

                    <div>
                        <h2>WorkReport</h2>
                        <span>Reporting System</span>
                    </div>
                </div>

                <nav className="team-navigation">
                    <p className="team-nav-title">MENU</p>

                    <Link
                        to="/team"
                        className={`team-nav-link ${
                            isDashboardActive
                                ? 'active'
                                : ''
                        }`}
                    >
                        <span className="team-nav-icon">
                            ▦
                        </span>
                        Dashboard
                    </Link>

                    <Link
                        to="/team/reports"
                        className={`team-nav-link ${
                            isReportsActive
                                ? 'active'
                                : ''
                        }`}
                    >
                        <span className="team-nav-icon">
                            ☷
                        </span>
                        My Reports
                    </Link>
                </nav>

                <div className="team-sidebar-bottom">
                    <div className="team-user-card">
                        <div className="team-user-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div className="team-user-info">
                            <strong>{user?.name}</strong>
                            <span>Team Member</span>
                        </div>
                    </div>

                    <button
                        className="team-logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <div className="team-main">
                <header className="team-topbar">
                    <div>
                        <p className="team-topbar-label">
                            WEEKLY WORK REPORTING
                        </p>
                        <h1>
                            {isDashboardActive
                                ? 'Dashboard'
                                : 'My Reports'}
                        </h1>
                    </div>

                    <div className="team-topbar-user">
                        <div className="team-topbar-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>
                            <strong>{user?.name}</strong>
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </header>

                <main className="team-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default TeamLayout;