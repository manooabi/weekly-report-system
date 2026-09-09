import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import TeamLayout from '../layouts/TeamLayout';
import ManagerLayout from '../layouts/ManagerLayout';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import EditReport from '../pages/team/EditReport';

import TeamDashboard from '../pages/team/TeamDashboard';
import MyReports from '../pages/team/MyReports';
import CreateReport from '../pages/team/CreateReport';
import ReportDetails from '../pages/team/ReportDetails';

import ManagerDashboard from '../pages/manager/ManagerDashboard';
import ManagerReports from '../pages/manager/ManagerReports';
import ManagerReportDetails from '../pages/manager/ManagerReportDetails';
import ProtectedRoute from './ProtectedRoute';
import ProjectManagement from '../pages/manager/ProjectManagement';
import UserManagement from '../pages/manager/UserManagement';
import TeamMemberProfile from '../pages/manager/TeamMemberProfile';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route
                    path="/login"
                    element={
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <AuthLayout>
                            <Register />
                        </AuthLayout>
                    }
                />

                {/* Team Member */}
                <Route
                    path="/team"
                    element={
                         <ProtectedRoute allowedRoles={['TEAM_MEMBER']}>
                        <TeamLayout>
                            <TeamDashboard />
                        </TeamLayout>
                        </ProtectedRoute>
                        
                    }
                />

                <Route
                    path="/team/reports"
                    element={
                         <ProtectedRoute allowedRoles={['TEAM_MEMBER']}>
                            <TeamLayout>
                                <MyReports />
                            </TeamLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/team/reports/create"
                    element={
                        <ProtectedRoute allowedRoles={['TEAM_MEMBER']}>
                            <TeamLayout>
                                <CreateReport />
                            </TeamLayout>
                        </ProtectedRoute>
                    }
                />
<Route
    path="/team/reports/:id/edit"
    element={
        <ProtectedRoute allowedRoles={['TEAM_MEMBER']}>
            <TeamLayout>
                <EditReport />
            </TeamLayout>
        </ProtectedRoute>
    }
/>
                <Route
                    path="/team/reports/:id"
                    element={
                        <ProtectedRoute allowedRoles={['TEAM_MEMBER']}>
                            <TeamLayout>
                                <ReportDetails />
                            </TeamLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Manager */}
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                            <ManagerLayout>
                                <ManagerDashboard />
                            </ManagerLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/reports"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                            <ManagerLayout>
                                <ManagerReports />
                            </ManagerLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager/reports/:id"
                    element={
                        <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                            <ManagerLayout>
                                <ManagerReportDetails />
                            </ManagerLayout>
                        </ProtectedRoute>
                    }
                />
<Route
    path="/manager/projects"
    element={
        <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <ManagerLayout>
                <ProjectManagement />
            </ManagerLayout>
        </ProtectedRoute>
    }
/>
<Route
    path="/manager/users"
    element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManagerLayout>
                <UserManagement />
            </ManagerLayout>
        </ProtectedRoute>
    }
/>
<Route
    path="/manager/users/:id"
    element={
        <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <ManagerLayout>
                <TeamMemberProfile />
            </ManagerLayout>
        </ProtectedRoute>
    }
/>
                {/* Default */}
                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;