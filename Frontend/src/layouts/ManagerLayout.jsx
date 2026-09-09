import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../services/auth.storage';

function ManagerLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    const getPageTitle = () => {
        if (location.pathname === '/manager') {
            return 'Manager Dashboard';
        }

        if (location.pathname.startsWith('/manager/reports')) {
            return 'Reports';
        }
         if (location.pathname.startsWith('/manager/projects')) {
        return 'Projects & Categories';
    }
    if (location.pathname.startsWith('/manager/users')) {
    return 'User Management';
}

        return 'Manager Dashboard';
    };

    const getPageDescription = () => {
        if (location.pathname === '/manager') {
            return 'Overview of team reporting activity and performance.';
        }

        if (location.pathname.startsWith('/manager/reports')) {
            return 'Review and manage weekly team reports.';
        }
        if (location.pathname.startsWith('/manager/projects')) {
    return 'Manage projects and categories used by the reporting system.';
}
if (location.pathname.startsWith('/manager/users')) {
    return 'Manage users, roles and account status.';
}

        return 'Manage your team reporting activity.';
    };

    const getInitials = (name) => {
        if (!name) {
            return 'U';
        }

        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="manager-layout">
            <aside className="manager-sidebar">
                <div className="manager-brand">
                    <div className="manager-brand-icon">
                        WR
                    </div>

                    <div className="manager-brand-text">
                        <strong>WorkReport</strong>
                        <span>Management Portal</span>
                    </div>
                </div>

                <div className="manager-sidebar-section">
                    <span className="manager-sidebar-label">
                        WORKSPACE
                    </span>

                    <nav className="manager-navigation">
                        <NavLink
                            to="/manager"
                            end
                            className={({ isActive }) =>
                                `manager-nav-link ${
                                    isActive ? 'active' : ''
                                }`
                            }
                        >
                            <span className="manager-nav-icon">
                                ▦
                            </span>

                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink
                            to="/manager/reports"
                            className={({ isActive }) =>
                                `manager-nav-link ${
                                    isActive ? 'active' : ''
                                }`
                            }
                        >
                            <span className="manager-nav-icon">
                                ≡
                            </span>

                            <span>Reports</span>
                        </NavLink>
                        <NavLink
    to="/manager/projects"
    className={({ isActive }) =>
        `manager-nav-link ${
            isActive ? 'active' : ''
        }`
    }
>
    <span className="manager-nav-icon">
        ▣
    </span>

    <span>Projects & Categories</span>
</NavLink>
{user?.role === 'ADMIN' && (
    <NavLink
        to="/manager/users"
        className={({ isActive }) =>
            `manager-nav-link ${
                isActive ? 'active' : ''
            }`
        }
    >
        <span className="manager-nav-icon">
            ◉
        </span>

        <span>User Management</span>
    </NavLink>
)}
                    </nav>
                </div>

                <div className="manager-sidebar-bottom">
                    <div className="manager-user-card">
                        <div className="manager-user-avatar">
                            {getInitials(user?.name)}
                        </div>

                        <div className="manager-user-info">
                            <strong>{user?.name || 'User'}</strong>
                            <span>{user?.role || 'MANAGER'}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="manager-logout-button"
                        onClick={handleLogout}
                    >
                        <span className="manager-logout-icon">
                            ↪
                        </span>

                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="manager-main">
                <header className="manager-topbar">
                    <div>
                        <h1>{getPageTitle()}</h1>
                        <p>{getPageDescription()}</p>
                    </div>

                    <div className="manager-topbar-user">
                        <div className="manager-topbar-avatar">
                            {getInitials(user?.name)}
                        </div>

                        <div className="manager-topbar-user-info">
                            <strong>{user?.name || 'User'}</strong>
                            <span>Manager</span>
                        </div>
                    </div>
                </header>

                <main className="manager-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default ManagerLayout;