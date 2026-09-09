import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function TeamDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/reports');
                setReports(response.data.data || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load reports.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const totalReports = reports.length;

    const draftReports = reports.filter(
        (report) => report.status?.code === 'DRAFT'
    ).length;

    const submittedReports = reports.filter(
        (report) => report.status?.code === 'SUBMITTED'
    ).length;

    const approvedReports = reports.filter(
        (report) => report.status?.code === 'APPROVED'
    ).length;

    const correctionReports = reports.filter(
        (report) =>
            report.status?.code ===
            'CORRECTION_REQUESTED'
    ).length;

    const getStatusClass = (statusCode) => {
        switch (statusCode) {
            case 'DRAFT':
                return 'status-badge status-draft';

            case 'SUBMITTED':
                return 'status-badge status-submitted';

            case 'APPROVED':
                return 'status-badge status-approved';

            case 'CORRECTION_REQUESTED':
                return 'status-badge status-correction';

            default:
                return 'status-badge';
        }
    };

    if (loading) {
        return (
            <div className="page-state">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-state error-state">
                <div className="state-icon">!</div>
                <h3>Unable to load dashboard</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-welcome">
                <div>
                    <p className="page-eyebrow">
                        OVERVIEW
                    </p>

                    <h2>
                        Welcome back!
                    </h2>

                    <p>
                        Here is an overview of your
                        weekly work reports.
                    </p>
                </div>

                <Link
                    to="/team/reports/create"
                    className="primary-button"
                >
                    <span>+</span>
                    Create Report
                </Link>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon total-icon">
                            ▦
                        </div>
                    </div>

                    <div className="stat-value">
                        {totalReports}
                    </div>

                    <div className="stat-label">
                        Total Reports
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon draft-icon">
                            ◷
                        </div>
                    </div>

                    <div className="stat-value">
                        {draftReports}
                    </div>

                    <div className="stat-label">
                        Draft Reports
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon submitted-icon">
                            ↑
                        </div>
                    </div>

                    <div className="stat-value">
                        {submittedReports}
                    </div>

                    <div className="stat-label">
                        Submitted
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon approved-icon">
                            ✓
                        </div>
                    </div>

                    <div className="stat-value">
                        {approvedReports}
                    </div>

                    <div className="stat-label">
                        Approved
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <div className="stat-icon correction-icon">
                            !
                        </div>
                    </div>

                    <div className="stat-value">
                        {correctionReports}
                    </div>

                    <div className="stat-label">
                        Correction Requested
                    </div>
                </div>
            </div>

            <section className="dashboard-section">
                <div className="section-header">
                    <div>
                        <p className="page-eyebrow">
                            REPORT ACTIVITY
                        </p>

                        <h2>Recent Reports</h2>

                        <p>
                            Your latest weekly work
                            reports.
                        </p>
                    </div>

                    <Link
                        to="/team/reports"
                        className="secondary-button"
                    >
                        View All Reports
                    </Link>
                </div>

                {reports.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            ▦
                        </div>

                        <h3>No reports found</h3>

                        <p>
                            You haven't created any
                            weekly reports yet.
                        </p>

                        <Link
                            to="/team/reports/create"
                            className="primary-button"
                        >
                            Create Your First Report
                        </Link>
                    </div>
                ) : (
                    <div className="table-card">
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Week</th>
                                        <th>Project</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reports.map(
                                        (report) => (
                                            <tr
                                                key={
                                                    report.id
                                                }
                                            >
                                                <td>
                                                    <div className="week-cell">
                                                        <strong>
                                                            {new Date(
                                                                report.weekStart
                                                            ).toLocaleDateString(
                                                                'en-GB',
                                                                {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                }
                                                            )}
                                                        </strong>

                                                        <span>
                                                            to{' '}
                                                            {new Date(
                                                                report.weekEnd
                                                            ).toLocaleDateString(
                                                                'en-GB',
                                                                {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="project-name">
                                                        {
                                                            report
                                                                .project
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            report
                                                                .status
                                                                ?.code
                                                        )}
                                                    >
                                                        {
                                                            report
                                                                .status
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <Link
                                                        to={`/team/reports/${report.id}`}
                                                        className="table-action"
                                                    >
                                                        View Report
                                                        <span>
                                                            →
                                                        </span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default TeamDashboard;