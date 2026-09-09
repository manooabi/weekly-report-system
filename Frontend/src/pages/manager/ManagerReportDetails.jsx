import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function ManagerReportDetails() {
    // const { reportId } = useParams();
    const { id: reportId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [versions, setVersions] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const [showCorrectionForm, setShowCorrectionForm] =
        useState(false);

    const [correctionComment, setCorrectionComment] =
        useState('');

    const [approveComment, setApproveComment] =
        useState('');

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                setLoading(true);
                setError('');

                const [
                    reportResponse,
                    versionsResponse,
                    reviewsResponse
                ] = await Promise.all([
                    api.get(`/reports/manager/${reportId}`),
                    api.get(`/reports/${reportId}/versions`),
                    api.get(`/reports/${reportId}/reviews`)
                ]);

                setReport(reportResponse.data.data);
                setVersions(
                    versionsResponse.data.data || []
                );
                setReviews(
                    reviewsResponse.data.data || []
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load report details.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReportDetails();
    }, [reportId]);

    const currentVersion = versions.find(
        (version) =>
            version.id === report?.currentVersionId
    );

    const getStatusClass = (statusCode) => {
        switch (statusCode) {
            case 'DRAFT':
                return 'manager-report-status draft';

            case 'SUBMITTED':
                return 'manager-report-status submitted';

            case 'CORRECTION_REQUESTED':
                return 'manager-report-status correction';

            case 'APPROVED':
                return 'manager-report-status approved';

            default:
                return 'manager-report-status';
        }
    };

    const getPriorityClass = (priorityCode) => {
        switch (priorityCode) {
            case 'LOW':
                return 'manager-priority low';

            case 'MEDIUM':
                return 'manager-priority medium';

            case 'HIGH':
                return 'manager-priority high';

            case 'CRITICAL':
                return 'manager-priority critical';

            default:
                return 'manager-priority';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return '-';
        }

        return new Date(dateString).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
    };

    const formatDateTime = (dateString) => {
        if (!dateString) {
            return '-';
        }

        return new Date(dateString).toLocaleString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            }
        );
    };

    const handleApprove = async () => {
        if (!currentVersion) {
            setError(
                'No current report version is available.'
            );

            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to approve this report?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError('');

            await api.post(
                `/reports/${reportId}/versions/${currentVersion.id}/approve`,
                {
                    comment: approveComment.trim() || undefined
                }
            );

            alert('Report approved successfully.');

            navigate('/manager/reports');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to approve report.'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestCorrection = async (event) => {
        event.preventDefault();

        const comment = correctionComment.trim();

        if (!comment) {
            setError(
                'Correction comment is required.'
            );

            return;
        }

        if (!currentVersion) {
            setError(
                'No current report version is available.'
            );

            return;
        }

        try {
            setActionLoading(true);
            setError('');

            await api.post(
                `/reports/${reportId}/versions/${currentVersion.id}/request-correction`,
                {
                    comment
                }
            );

            alert(
                'Report correction requested successfully.'
            );

            navigate('/manager/reports');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to request correction.'
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="manager-report-details-loading">
                <div className="manager-loading-spinner"></div>
                <p>Loading report details...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="manager-report-details-page">
                <div className="manager-reports-error">
                    <span>!</span>
                    <p>
                        {error ||
                            'Report could not be found.'}
                    </p>
                </div>

                <Link
                    to="/manager/reports"
                    className="manager-back-link"
                >
                    ← Back to Reports
                </Link>
            </div>
        );
    }

    return (
        <div className="manager-report-details-page">

            {/* Header */}

            <div className="manager-detail-header">

                <div>
                    <Link
                        to="/manager/reports"
                        className="manager-back-link"
                    >
                        ← Back to Reports
                    </Link>

                    <span className="manager-page-eyebrow">
                        REPORT REVIEW
                    </span>

                    <div className="manager-detail-title-row">
                        <h2>
                            Weekly Report
                        </h2>

                        <span
                            className={getStatusClass(
                                report.status?.code
                            )}
                        >
                            {report.status?.name}
                        </span>
                    </div>

                    <p>
                        Review the weekly work report
                        submitted by the team member.
                    </p>
                </div>

            </div>

            {error && (
                <div className="manager-reports-error">
                    <span>!</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Report Information */}

            <section className="manager-detail-card">

                <div className="manager-detail-card-header">
                    <div>
                        <h3>
                            Report Information
                        </h3>

                        <p>
                            Basic information about this
                            weekly report.
                        </p>
                    </div>
                </div>

                <div className="manager-detail-info-grid">

                    <div className="manager-detail-info-item">
                        <span>Team Member</span>

                        <strong>
                            {currentVersion?.createdBy?.name ||
                                report.user?.name ||
                                '-'}
                        </strong>

                        <small>
                            {currentVersion?.createdBy?.email ||
                                report.user?.email ||
                                ''}
                        </small>
                    </div>

                    <div className="manager-detail-info-item">
                        <span>Project</span>

                        <strong>
                            {report.project?.name || '-'}
                        </strong>
                    </div>

                    <div className="manager-detail-info-item">
                        <span>Category</span>

                        <strong>
                            {report.project?.category?.name ||
                                '-'}
                        </strong>
                    </div>

                    <div className="manager-detail-info-item">
                        <span>Reporting Period</span>

                        <strong>
                            {formatDate(
                                report.weekStart
                            )}{' '}
                            –{' '}
                            {formatDate(
                                report.weekEnd
                            )}
                        </strong>
                    </div>

                    <div className="manager-detail-info-item">
                        <span>Current Version</span>

                        <strong>
                            {currentVersion
                                ? `Version ${currentVersion.versionNumber}`
                                : '-'}
                        </strong>
                    </div>

                    <div className="manager-detail-info-item">
                        <span>Submitted At</span>

                        <strong>
                            {currentVersion?.submittedAt
                                ? formatDateTime(
                                      currentVersion.submittedAt
                                  )
                                : 'Not submitted'}
                        </strong>
                    </div>

                </div>
            </section>

            {/* Current Version */}

            {currentVersion && (
                <>
                    <section className="manager-detail-card">

                        <div className="manager-detail-card-header">
                            <div>
                                <h3>
                                    Version{' '}
                                    {
                                        currentVersion.versionNumber
                                    }
                                </h3>

                                <p>
                                    Current version submitted
                                    for manager review.
                                </p>
                            </div>
                        </div>

                        <div className="manager-detail-section">

                            <h4>
                                Next Week Plan
                            </h4>

                            <div className="manager-detail-text">
                                {currentVersion.nextWeekPlan ||
                                    'No plan provided.'}
                            </div>

                        </div>

                        {currentVersion.notes && (
                            <div className="manager-detail-section">

                                <h4>Notes</h4>

                                <div className="manager-detail-text">
                                    {currentVersion.notes}
                                </div>

                            </div>
                        )}

                        {currentVersion.links && (
                            <div className="manager-detail-section">

                                <h4>Links</h4>

                                <div className="manager-detail-text">
                                    {currentVersion.links}
                                </div>

                            </div>
                        )}

                    </section>

                    {/* Tasks */}

                    <section className="manager-detail-card">

                        <div className="manager-detail-card-header">
                            <div>
                                <h3>
                                    Completed Tasks
                                </h3>

                                <p>
                                    Tasks recorded in this
                                    report version.
                                </p>
                            </div>

                            <div className="manager-detail-count">
                                {currentVersion.tasks?.length ||
                                    0}{' '}
                                tasks
                            </div>
                        </div>

                        {currentVersion.tasks?.length ? (
                            <div className="manager-detail-table-wrapper">

                                <table className="manager-detail-table">

                                    <thead>
                                        <tr>
                                            <th>
                                                Task
                                            </th>

                                            <th>
                                                Priority
                                            </th>

                                            <th>
                                                Planned %
                                            </th>

                                            <th>
                                                Actual %
                                            </th>

                                            <th>
                                                Planned Hours
                                            </th>

                                            <th>
                                                Spent Hours
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Deliverable
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentVersion.tasks.map(
                                            (task) => (
                                                <tr key={task.id}>

                                                    <td>
                                                        <strong>
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
                                                                    ?.code
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
                                                        {
                                                            task.actualPercentage
                                                        }
                                                        %
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
                                                        <span
                                                            className={getStatusClass(
                                                                task
                                                                    .status
                                                                    ?.code
                                                            )}
                                                        >
                                                            {
                                                                task
                                                                    .status
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {
                                                            task.deliverable ||
                                                            '-'
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}
                                    </tbody>

                                </table>

                            </div>
                        ) : (
                            <div className="manager-detail-empty">
                                No tasks were added to this
                                version.
                            </div>
                        )}

                    </section>

                    {/* Achievements */}

                    <section className="manager-detail-card">

                        <div className="manager-detail-card-header">
                            <div>
                                <h3>
                                    Achievements
                                </h3>

                                <p>
                                    Key accomplishments
                                    recorded for this week.
                                </p>
                            </div>
                        </div>

                        {currentVersion.achievements?.length ? (
                            <div className="manager-achievement-list">

                                {currentVersion.achievements.map(
                                    (achievement) => (
                                        <div
                                            className="manager-achievement-item"
                                            key={
                                                achievement.id
                                            }
                                        >
                                            <span>
                                                ✓
                                            </span>

                                            <div>
                                                <strong>
                                                    {
                                                        achievement.achievement
                                                    }
                                                </strong>

                                                {achievement.isKeyAchievement && (
                                                    <small>
                                                        Key
                                                        Achievement
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <div className="manager-detail-empty">
                                No achievements recorded.
                            </div>
                        )}

                    </section>

                    {/* Blockers */}

                    <section className="manager-detail-card">

                        <div className="manager-detail-card-header">
                            <div>
                                <h3>
                                    Blockers & Challenges
                                </h3>

                                <p>
                                    Issues that may be affecting
                                    progress.
                                </p>
                            </div>
                        </div>

                        {currentVersion.blockers?.length ? (
                            <div className="manager-blocker-list">

                                {currentVersion.blockers.map(
                                    (blocker) => (
                                        <div
                                            className="manager-blocker-item"
                                            key={blocker.id}
                                        >
                                            <span>
                                                !
                                            </span>

                                            <div>
                                                <strong>
                                                    {
                                                        blocker.blocker
                                                    }
                                                </strong>

                                                {blocker.isKeyBlocker && (
                                                    <small>
                                                        Key Blocker
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <div className="manager-detail-empty">
                                No blockers reported.
                            </div>
                        )}

                    </section>
                </>
            )}

            {/* Version History */}

            <section className="manager-detail-card">

                <div className="manager-detail-card-header">
                    <div>
                        <h3>
                            Version History
                        </h3>

                        <p>
                            Previous versions of this
                            report.
                        </p>
                    </div>
                </div>

                {versions.length ? (
                    <div className="manager-version-list">

                        {versions.map((version) => (
                            <div
                                className={`manager-version-item ${
                                    version.id ===
                                    report.currentVersionId
                                        ? 'current'
                                        : ''
                                }`}
                                key={version.id}
                            >
                                <div>
                                    <strong>
                                        Version{' '}
                                        {
                                            version.versionNumber
                                        }
                                    </strong>

                                    {version.id ===
                                        report.currentVersionId && (
                                        <span>
                                            Current
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <small>
                                        Created{' '}
                                        {formatDateTime(
                                            version.createdAt
                                        )}
                                    </small>

                                    <small>
                                        {version.submittedAt
                                            ? `Submitted ${formatDateTime(
                                                  version.submittedAt
                                              )}`
                                            : 'Not submitted'}
                                    </small>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="manager-detail-empty">
                        No versions available.
                    </div>
                )}

            </section>
            {/* Hours by Task Type */}

<section className="manager-detail-card">

    <div className="manager-detail-card-header">
        <div>
            <h3>
                Hours by Task Type
            </h3>

            <p>
                Time recorded across different types
                of work.
            </p>
        </div>

        <div className="manager-detail-count">
            {currentVersion?.hours?.length || 0} types
        </div>
    </div>

    {currentVersion?.hours?.length ? (
        <div className="manager-hours-list">

            {currentVersion.hours.map((hour) => (
                <div
                    className="manager-hours-item"
                    key={hour.id}
                >
                    <div>
                        <strong>
                            {hour.taskType?.name ||
                                'Unknown Task Type'}
                        </strong>

                        <small>
                            {hour.taskType?.code || ''}
                        </small>
                    </div>

                    <strong>
                        {hour.hours} hours
                    </strong>
                </div>
            ))}

        </div>
    ) : (
        <div className="manager-detail-empty">
            No hours recorded for this version.
        </div>
    )}

</section>

            {/* Review History */}

            <section className="manager-detail-card">

                <div className="manager-detail-card-header">
                    <div>
                        <h3>
                            Review History
                        </h3>

                        <p>
                            Previous manager actions and
                            comments.
                        </p>
                    </div>
                </div>

                {reviews.length ? (
                    <div className="manager-review-list">

                        {reviews.map((review) => (
                            <div
                                className="manager-review-item"
                                key={review.id}
                            >
                                <div className="manager-review-icon">
                                    {review.action?.code ===
                                    'APPROVE'
                                        ? '✓'
                                        : '!'}
                                </div>

                                <div className="manager-review-content">

                                    <div className="manager-review-top">

                                        <strong>
                                            {
                                                review.action
                                                    ?.name
                                            }
                                        </strong>

                                        <span>
                                            Version{' '}
                                            {
                                                review
                                                    .reportVersion
                                                    ?.versionNumber
                                            }
                                        </span>

                                    </div>

                                    <p>
                                        {review.comment ||
                                            'No comment provided.'}
                                    </p>

                                    <small>
                                        {
                                            review.reviewer
                                                ?.name
                                        }{' '}
                                        ·{' '}
                                        {formatDateTime(
                                            review.createdAt
                                        )}
                                    </small>

                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="manager-detail-empty">
                        No review history available.
                    </div>
                )}

            </section>

            {/* Manager Actions */}

            {(report.status?.code === 'SUBMITTED' &&
                // report.status?.code ===
                //     'CORRECTION_REQUESTED') && (
                <section className="manager-detail-card manager-actions-card">

                    <div className="manager-detail-card-header">
                        <div>
                            <h3>
                                Manager Review
                            </h3>

                            <p>
                                Review this report and
                                decide whether it should be
                                approved or returned for
                                correction.
                            </p>
                        </div>
                    </div>

                    <div className="manager-approve-comment">

                        <label htmlFor="approveComment">
                            Approval Comment
                            <span>Optional</span>
                        </label>

                        <textarea
                            id="approveComment"
                            value={approveComment}
                            onChange={(event) =>
                                setApproveComment(
                                    event.target.value
                                )
                            }
                            rows="3"
                            maxLength="5000"
                            placeholder="Optional comment for the team member..."
                        />

                    </div>

                    <div className="manager-action-buttons">

                        <button
                            type="button"
                            className="manager-approve-button"
                            onClick={handleApprove}
                            disabled={actionLoading}
                        >
                            {actionLoading
                                ? 'Processing...'
                                : '✓ Approve Report'}
                        </button>

                        <button
                            type="button"
                            className="manager-correction-button"
                            onClick={() =>
                                setShowCorrectionForm(
                                    (current) => !current
                                )
                            }
                            disabled={actionLoading}
                        >
                            ! Request Correction
                        </button>

                    </div>

                    {showCorrectionForm && (
                        <form
                            className="manager-correction-form"
                            onSubmit={
                                handleRequestCorrection
                            }
                        >
                            <label htmlFor="correctionComment">
                                Correction Comment
                            </label>

                            <textarea
                                id="correctionComment"
                                value={correctionComment}
                                onChange={(event) =>
                                    setCorrectionComment(
                                        event.target.value
                                    )
                                }
                                rows="5"
                                maxLength="5000"
                                placeholder="Explain what needs to be corrected..."
                                required
                            />

                            <div className="manager-correction-form-footer">

                                <span>
                                    {
                                        correctionComment.length
                                    }
                                    / 5000
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        actionLoading ||
                                        !correctionComment.trim()
                                    }
                                >
                                    {actionLoading
                                        ? 'Sending...'
                                        : 'Send Correction Request'}
                                </button>

                            </div>
                        </form>
                    )}

                </section>
            )}

        </div>
    );
}

export default ManagerReportDetails;

