import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../services/auth.storage';

function ProtectedRoute({ children, allowedRoles }) {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;