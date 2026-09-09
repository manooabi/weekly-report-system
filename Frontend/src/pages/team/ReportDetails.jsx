import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function ReportDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [version, setVersion] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const [
                    reportResponse,
                    versionsResponse,
                    reviewsResponse
                ] = await Promise.all([
                    api.get(`/reports/${id}`),
                    api.get(`/reports/${id}/versions`),
                    api.get(`/reports/${id}/reviews`)
                ]);

                const reportData = reportResponse.data.data;
                const versions =
                    versionsResponse.data.data || [];

                const reviewData =
                    reviewsResponse.data.data || [];

                const currentVersion = versions.find(
                    (item) =>
                        item.id ===
                        reportData.currentVersionId
                );

                setReport(reportData);
                setVersion(currentVersion || null);
                setReviews(reviewData);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load report.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetails();
    }, [id]);

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

    const getPriorityClass = (priorityName) => {
        switch (priorityName?.toLowerCase()) {
            case 'low':
                return 'priority-badge priority-low';

            case 'medium':
                return 'priority-badge priority-medium';

            case 'high':
                return 'priority-badge priority-high';

            case 'critical':
                return 'priority-badge priority-critical';

            default:
                return 'priority-badge';
        }
    };

    if (loading) {
        return (
            <div className="page-state">
                <div className="loading-spinner"></div>
                <p>Loading report...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-state error-state">
                <div className="state-icon">!</div>

                <h3>Unable to load report</h3>

                <p>{error}</p>

                <Link
                    to="/team/reports"
                    className="secondary-button"
                >
                    Back to My Reports
                </Link>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="page-state">
                <div className="state-icon">?</div>

                <h3>Report not found</h3>

                <p>
                    The requested report could not be
                    found.
                </p>

                <Link
                    to="/team/reports"
                    className="secondary-button"
                >
                    Back to My Reports
                </Link>
            </div>
        );
    }

    return (
        <div className="report-details-page">
            <div className="report-details-top">
                <div>
                    <Link
                        to="/team/reports"
                        className="back-link"
                    >
                        ← Back to My Reports
                    </Link>

                    <p className="page-eyebrow">
                        WEEKLY WORK REPORT
                    </p>

                    <h2>Report Details</h2>

                    <p className="report-subtitle">
                        Review the submitted work report
                        and its current status.
                    </p>
                </div>

                <div className="report-header-status">
                    <span
                        className={getStatusClass(
                            report.status?.code
                        )}
                    >
                        {report.status?.name || 'N/A'}
                    </span>
                </div>
            </div>

            <section className="report-info-card">
                <div className="report-info-header">
                    <div>
                        <p className="page-eyebrow">
                            REPORT INFORMATION
                        </p>

                        <h3>Overview</h3>
                    </div>
                </div>

                <div className="report-info-grid">
                    <div className="info-item">
                        <span className="info-label">
                            Project
                        </span>

                        <strong>
                            {report.project?.name || 'N/A'}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Week
                        </span>

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
                            {' - '}
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
                        </strong>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Status
                        </span>

                        <span
                            className={getStatusClass(
                                report.status?.code
                            )}
                        >
                            {report.status?.name || 'N/A'}
                        </span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Version
                        </span>

                        <strong>
                            Version{' '}
                            {version?.versionNumber ||
                                'N/A'}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="report-content-card">
                <div className="content-section-header">
                    <div className="content-section-icon">
                        →
                    </div>

                    <div>
                        <h3>Next Week Plan</h3>

                        <p>
                            Planned activities for the
                            upcoming week.
                        </p>
                    </div>
                </div>

                <div className="content-box">
                    {version?.nextWeekPlan ||
                        'No plan provided.'}
                </div>
            </section>

            <div className="report-two-column">
                <section className="report-content-card">
                    <div className="content-section-header">
                        <div className="content-section-icon">
                            N
                        </div>

                        <div>
                            <h3>Notes</h3>

                            <p>
                                Additional information
                                about this report.
                            </p>
                        </div>
                    </div>

                    <div className="content-box">
                        {version?.notes ||
                            'No notes provided.'}
                    </div>
                </section>

                <section className="report-content-card">
                    <div className="content-section-header">
                        <div className="content-section-icon">
                            ↗
                        </div>

                        <div>
                            <h3>Links</h3>

                            <p>
                                Related resources and
                                references.
                            </p>
                        </div>
                    </div>

                    <div className="content-box">
                        {version?.links ||
                            'No links provided.'}
                    </div>
                </section>
            </div>

            <section className="report-content-card">
                <div className="content-section-header">
                    <div className="content-section-icon">
                        ✓
                    </div>

                    <div>
                        <h3>Tasks Completed</h3>

                        <p>
                            Work completed during this
                            reporting period.
                        </p>
                    </div>
                </div>

                {!version?.tasks ||
                version.tasks.length === 0 ? (
                    <div className="section-empty">
                        No tasks found.
                    </div>
                ) : (
                    <div className="table-card inner-table-card">
                        <div className="table-wrapper">
                            <table className="data-table report-table">
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>Priority</th>
                                        <th>Planned %</th>
                                        <th>Actual %</th>
                                        <th>Status</th>
                                        <th>Planned Hours</th>
                                        <th>Spent Hours</th>
                                        <th>Deliverable</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {version.tasks.map(
                                        (task) => (
                                            <tr
                                                key={
                                                    task.id
                                                }
                                            >
                                                <td>
                                                    <strong className="task-name">
                                                        {
                                                            task.taskName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getPriorityClass(
                                                            task
                                                                .priority
                                                                ?.name
                                                        )}
                                                    >
                                                        {
                                                            task
                                                                .priority
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        task.plannedPercentage
                                                    }
                                                    %
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            task.actualPercentage
                                                        }
                                                        %
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span className="task-status">
                                                        {
                                                            task
                                                                .status
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    {
                                                        task.plannedHours
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        task.spentHours
                                                    }
                                                </td>

                                                <td>
                                                    <span className="deliverable-text">
                                                        {
                                                            task.deliverable ||
                                                            'N/A'
                                                        }
                                                    </span>
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

            <div className="report-two-column">
                <section className="report-content-card">
                    <div className="content-section-header">
                        <div className="content-section-icon achievement-icon">
                            ★
                        </div>

                        <div>
                            <h3>Achievements</h3>

                            <p>
                                Key accomplishments from
                                this week.
                            </p>
                        </div>
                    </div>

                    {!version?.achievements ||
                    version.achievements.length === 0 ? (
                        <div className="section-empty">
                            No achievements recorded.
                        </div>
                    ) : (
                        <div className="highlight-list">
                            {version.achievements.map(
                                (achievement) => (
                                    <div
                                        className="highlight-item achievement-item"
                                        key={
                                            achievement.id
                                        }
                                    >
                                        <span className="highlight-bullet">
                                            ✓
                                        </span>

                                        <div>
                                            <p>
                                                {
                                                    achievement.achievement
                                                }
                                            </p>

                                            {achievement.isKeyAchievement && (
                                                <span className="highlight-label">
                                                    Key Achievement
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>

                <section className="report-content-card">
                    <div className="content-section-header">
                        <div className="content-section-icon blocker-icon">
                            !
                        </div>

                        <div>
                            <h3>
                                Blockers & Challenges
                            </h3>

                            <p>
                                Issues that affected your
                                work.
                            </p>
                        </div>
                    </div>

                    {!version?.blockers ||
                    version.blockers.length === 0 ? (
                        <div className="section-empty">
                            No blockers recorded.
                        </div>
                    ) : (
                        <div className="highlight-list">
                            {version.blockers.map(
                                (blocker) => (
                                    <div
                                        className="highlight-item blocker-item"
                                        key={blocker.id}
                                    >
                                        <span className="highlight-bullet">
                                            !
                                        </span>

                                        <div>
                                            <p>
                                                {
                                                    blocker.blocker
                                                }
                                            </p>

                                            {blocker.isKeyBlocker && (
                                                <span className="highlight-label">
                                                    Key Blocker
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>

            <section className="report-content-card">
                <div className="content-section-header">
                    <div className="content-section-icon">
                        ◷
                    </div>

                    <div>
                        <h3>Hours by Task Type</h3>

                        <p>
                            Time spent across different
                            types of work.
                        </p>
                    </div>
                </div>

                {!version?.hours ||
                version.hours.length === 0 ? (
                    <div className="section-empty">
                        No hours recorded.
                    </div>
                ) : (
                    <div className="table-card inner-table-card hours-table-card">
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Task Type</th>
                                        <th>Hours</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {version.hours.map(
                                        (hour) => (
                                            <tr
                                                key={
                                                    hour.id
                                                }
                                            >
                                                <td>
                                                    <strong>
                                                        {
                                                            hour
                                                                .taskType
                                                                ?.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            hour.hours
                                                        }{' '}
                                                        hrs
                                                    </strong>
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

            <section className="report-content-card">
                <div className="content-section-header">
                    <div className="content-section-icon">
                        ↻
                    </div>

                    <div>
                        <h3>Review History</h3>

                        <p>
                            Manager actions and feedback
                            for this report.
                        </p>
                    </div>
                </div>

                {!reviews || reviews.length === 0 ? (
                    <div className="section-empty">
                        No reviews yet.
                    </div>
                ) : (
                    <div className="table-card inner-table-card">
                        <div className="table-wrapper">
                            <table className="data-table review-table">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Version</th>
                                        <th>Reviewer</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reviews.map(
                                        (review) => (
                                            <tr
                                                key={
                                                    review.id
                                                }
                                            >
                                                <td>
                                                    <span className="review-action">
                                                        {
                                                            review
                                                                .action
                                                                ?.name
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        Version{' '}
                                                        {
                                                            review
                                                                .reportVersion
                                                                ?.versionNumber
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            review
                                                                .reviewer
                                                                ?.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span className="review-comment">
                                                        {
                                                            review.comment ||
                                                            'No comment'
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="review-date">
                                                        {new Date(
                                                            review.createdAt
                                                        ).toLocaleString(
                                                            'en-GB'
                                                        )}
                                                    </span>
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

            {(report.status?.code === 'DRAFT' ||
                report.status?.code ===
                    'CORRECTION_REQUESTED') && (
                <section className="report-actions-card">
                    <div>
                        <p className="page-eyebrow">
                            REPORT ACTIONS
                        </p>

                        <h3>
                            {report.status?.code === 'DRAFT'
                                ? 'Continue working on this report'
                                : 'Changes are required'}
                        </h3>

                        <p>
                            {report.status?.code === 'DRAFT'
                                ? 'You can edit this draft and submit it when it is ready.'
                                : 'Please review the manager feedback, make the required changes and resubmit the report.'}
                        </p>
                    </div>

                    {report.status?.code === 'DRAFT' && (
                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    `/team/reports/${report.id}/edit`
                                )
                            }
                        >
                            Edit Draft
                            <span>→</span>
                        </button>
                    )}

                   {report.status?.code ===
    'CORRECTION_REQUESTED' && (
    <button
        type="button"
        className="primary-button"
        onClick={() =>
            navigate(
                `/team/reports/${report.id}/edit`
            )
        }
    >
        Edit & Resubmit
        <span>→</span>
    </button>
)}
                </section>
            )}
        </div>
    );
}

export default ReportDetails;

