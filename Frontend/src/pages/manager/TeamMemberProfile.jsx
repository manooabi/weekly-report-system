import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function TeamMemberProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');

            const [userResponse, reportsResponse] =
                await Promise.all([
                    api.get(`/users/${id}`),
                    api.get(
                        `/reports/manager?userId=${id}&page=1&limit=100`
                    )
                ]);

            setUser(userResponse.data.data);

            setReports(
                reportsResponse.data.data?.reports || []
            );
        } catch (err) {
            console.error(
                'Failed to load team member profile:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to load team member profile.'
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (statusCode) => {
        if (statusCode === 'APPROVED') {
            return 'approved';
        }

        if (statusCode === 'SUBMITTED') {
            return 'submitted';
        }

        if (statusCode === 'CORRECTION_REQUESTED') {
            return 'correction';
        }

        return 'draft';
    };

    const getStatusName = (statusCode) => {
        if (statusCode === 'CORRECTION_REQUESTED') {
            return 'Needs Correction';
        }

        if (statusCode === 'SUBMITTED') {
            return 'Submitted';
        }

        if (statusCode === 'APPROVED') {
            return 'Approved';
        }

        return 'Draft';
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString(
            undefined,
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
    };

    const totalReports = reports.length;

    const approvedReports = reports.filter(
        (report) =>
            report.status?.code === 'APPROVED'
    ).length;

    const submittedReports = reports.filter(
        (report) =>
            report.status?.code === 'SUBMITTED'
    ).length;

    const correctionReports = reports.filter(
        (report) =>
            report.status?.code ===
            'CORRECTION_REQUESTED'
    ).length;

    const draftReports = reports.filter(
        (report) =>
            report.status?.code === 'DRAFT'
    ).length;

    const openReport = (reportId) => {
        navigate(
            `/manager/reports/${reportId}`
        );
    };

    if (loading) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-loading">
                    <div className="manager-loading-spinner"></div>

                    <p>
                        Loading team member profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-error">
                    <div className="manager-error-icon">
                        !
                    </div>

                    <div>
                        <h3>
                            Something went wrong
                        </h3>

                        <p>{error}</p>
                    </div>
                </div>

                <button
                    type="button"
                    className="manager-secondary-button"
                    onClick={() =>
                        navigate('/manager/reports')
                    }
                >
                    Back to Reports
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-error">
                    <div className="manager-error-icon">
                        !
                    </div>

                    <div>
                        <h3>
                            User not found
                        </h3>

                        <p>
                            The requested team member
                            could not be found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="manager-dashboard">

            {/* Page Header */}
            <div className="manager-dashboard-header">
                <div>
                    <h2>
                        Team Member Profile
                    </h2>

                    <p>
                        View team member information,
                        statistics and report history.
                    </p>
                </div>

                <button
                    type="button"
                    className="manager-secondary-button"
                    onClick={() =>
                        navigate('/manager/reports')
                    }
                >
                    Back to Reports
                </button>
            </div>

            {/* Profile Card */}
            <section className="manager-dashboard-card">
                <div className="manager-profile-header">
                    <div className="manager-profile-avatar">
                        {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="manager-profile-info">
                        <h2>
                            {user.name}
                        </h2>

                        <p>
                            {user.email}
                        </p>

                        <div className="manager-profile-meta">
                            <span>
                                {user.role?.name ||
                                    'Team Member'}
                            </span>

                            <span
                                className={
                                    user.isActive
                                        ? 'manager-status-badge approved'
                                        : 'manager-status-badge draft'
                                }
                            >
                                {user.isActive
                                    ? 'Active'
                                    : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="manager-profile-details">
                    <div>
                        <span>
                            User ID
                        </span>

                        <strong>
                            #{user.id}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Role
                        </span>

                        <strong>
                            {user.role?.name ||
                                'Team Member'}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Joined
                        </span>

                        <strong>
                            {formatDate(
                                user.createdAt
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Last Updated
                        </span>

                        <strong>
                            {formatDate(
                                user.updatedAt
                            )}
                        </strong>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="manager-summary-grid">

                <div className="manager-summary-card">
                    <div className="manager-summary-icon">
                        ◫
                    </div>

                    <div>
                        <span>
                            Total Reports
                        </span>

                        <strong>
                            {totalReports}
                        </strong>
                    </div>
                </div>

                <div className="manager-summary-card">
                    <div className="manager-summary-icon">
                        ✓
                    </div>

                    <div>
                        <span>
                            Approved
                        </span>

                        <strong>
                            {approvedReports}
                        </strong>
                    </div>
                </div>

                <div className="manager-summary-card">
                    <div className="manager-summary-icon">
                        →
                    </div>

                    <div>
                        <span>
                            Submitted
                        </span>

                        <strong>
                            {submittedReports}
                        </strong>
                    </div>
                </div>

                <div className="manager-summary-card">
                    <div className="manager-summary-icon">
                        !
                    </div>

                    <div>
                        <span>
                            Needs Correction
                        </span>

                        <strong>
                            {correctionReports}
                        </strong>
                    </div>
                </div>

                <div className="manager-summary-card">
                    <div className="manager-summary-icon">
                        ○
                    </div>

                    <div>
                        <span>
                            Drafts
                        </span>

                        <strong>
                            {draftReports}
                        </strong>
                    </div>
                </div>

            </section>

            {/* Report History */}
            <section className="manager-dashboard-card">

                <div className="manager-card-header">
                    <div>
                        <h3>
                            Report History
                        </h3>

                        <p>
                            Weekly reports submitted by
                            this team member.
                        </p>
                    </div>

                    <span className="manager-card-count">
                        {totalReports}
                    </span>
                </div>

                <div className="manager-table-wrapper">
                    <table className="manager-table">

                        <thead>
                            <tr>
                                <th>
                                    Week
                                </th>

                                <th>
                                    Project
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Last Updated
                                </th>

                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports.length > 0 ? (
                                reports.map(
                                    (report) => (
                                        <tr
                                            key={
                                                report.id
                                            }
                                        >
                                            <td>
                                                <strong>
                                                    {formatDate(
                                                        report.weekStart
                                                    )}
                                                </strong>

                                                <div>
                                                    to{' '}

                                                    {formatDate(
                                                        report.weekEnd
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                {report
                                                    .project
                                                    ?.name ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {report
                                                    .project
                                                    ?.category
                                                    ?.name ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <span
                                                    className={`manager-status-badge ${getStatusClass(
                                                        report
                                                            .status
                                                            ?.code
                                                    )}`}
                                                >
                                                    {getStatusName(
                                                        report
                                                            .status
                                                            ?.code
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    report.updatedAt
                                                )}
                                            </td>

                                            <td>
                                                {report.status
                                                    ?.code ===
                                                'DRAFT' ? (
                                                    <span>
                                                        Not available
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="manager-action-button"
                                                        onClick={() =>
                                                            openReport(
                                                                report.id
                                                            )
                                                        }
                                                    >
                                                        View Report
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="manager-table-empty"
                                    >
                                        No reports found
                                        for this team
                                        member.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </section>

        </div>
    );
}

export default TeamMemberProfile;

