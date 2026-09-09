import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

import api from '../../services/api';

function ManagerDashboard() {
    const [summary, setSummary] = useState(null);
    const [statusByMember, setStatusByMember] = useState([]);
    const [workloadByProject, setWorkloadByProject] = useState([]);
    const [timeByTaskType, setTimeByTaskType] = useState([]);
    const [taskTrend, setTaskTrend] = useState([]);
    const [openBlockers, setOpenBlockers] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                summaryResponse,
                statusResponse,
                workloadResponse,
                timeResponse,
                trendResponse,
                blockersResponse,
                activityResponse
            ] = await Promise.all([
                api.get('/reports/dashboard/summary'),
                api.get('/reports/dashboard/status-by-member'),
                api.get('/reports/dashboard/workload-by-project'),
                api.get('/reports/dashboard/time-by-task-type'),
                api.get('/reports/dashboard/task-trend'),
                api.get('/reports/dashboard/open-blockers'),
                api.get('/reports/dashboard/recent-activity')
            ]);

            const summaryData = summaryResponse.data.data;

            setSummary(summaryData);

            setStatusByMember(
                Object.entries(statusResponse.data.data || {}).map(
                    ([member, statuses]) => ({
                        member,
                        ...statuses
                    })
                )
            );

            setWorkloadByProject(
                Object.entries(workloadResponse.data.data || {}).map(
                    ([project, values]) => ({
                        project,
                        ...values
                    })
                )
            );

            setTimeByTaskType(
                Object.entries(timeResponse.data.data || {}).map(
                    ([taskType, hours]) => ({
                        taskType,
                        hours
                    })
                )
            );

            setTaskTrend(
                (trendResponse.data.data || []).map((item) => ({
                    ...item,
                    week: formatWeekLabel(item.weekStart)
                }))
            );

            setOpenBlockers(blockersResponse.data.data || []);
            setRecentActivity(activityResponse.data.data || []);
        } catch (err) {
            console.error('Failed to load manager dashboard:', err);

            setError(
                err.response?.data?.message ||
                'Unable to load dashboard data. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatWeekLabel = (dateString) => {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) {
            return '-';
        }

        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getActionClass = (action) => {
        if (action === 'APPROVE') {
            return 'activity-action approved';
        }

        if (action === 'REQUEST_CORRECTION') {
            return 'activity-action correction';
        }

        return 'activity-action';
    };

    if (loading) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-loading">
                    <div className="manager-loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-error">
                    <div className="manager-error-icon">!</div>

                    <div>
                        <h3>Unable to load dashboard</h3>
                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchDashboardData}
                        className="manager-retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="manager-dashboard">
            {/* Page Header */}

            <div className="manager-dashboard-header">
                <div>
                    <h2>Team Overview</h2>

                    <p>
                        Monitor weekly reporting activity,
                        workload, and team progress.
                    </p>
                </div>

                {summary?.weekStart && (
                    <div className="manager-week-badge">
                        <span>Current Week</span>
                        <strong>
                            {formatWeekLabel(summary.weekStart)}
                            {' – '}
                            {formatWeekLabel(summary.weekEnd)}
                        </strong>
                    </div>
                )}
            </div>

            {/* KPI Cards */}

            <div className="manager-kpi-grid">
                <div className="manager-kpi-card">
                    <div className="manager-kpi-top">
                        <span className="manager-kpi-label">
                            Total Reports
                        </span>

                        <div className="manager-kpi-icon blue">
                            ≡
                        </div>
                    </div>

                    <strong className="manager-kpi-value">
                        {summary?.totalReports ?? 0}
                    </strong>

                    <span className="manager-kpi-description">
                        Reports for the current week
                    </span>
                </div>

                <div className="manager-kpi-card">
                    <div className="manager-kpi-top">
                        <span className="manager-kpi-label">
                            Submission Compliance
                        </span>

                        <div className="manager-kpi-icon green">
                            ✓
                        </div>
                    </div>

                    <strong className="manager-kpi-value">
                        {summary?.complianceRate ?? 0}%
                    </strong>

                    <span className="manager-kpi-description">
                        Team reporting compliance
                    </span>
                </div>

                <div className="manager-kpi-card">
                    <div className="manager-kpi-top">
                        <span className="manager-kpi-label">
                            Needs Correction
                        </span>

                        <div className="manager-kpi-icon orange">
                            !
                        </div>
                    </div>

                    <strong className="manager-kpi-value">
                        {summary?.correctionCount ?? 0}
                    </strong>

                    <span className="manager-kpi-description">
                        Reports requiring updates
                    </span>
                </div>

                <div className="manager-kpi-card">
                    <div className="manager-kpi-top">
                        <span className="manager-kpi-label">
                            Open Blockers
                        </span>

                        <div className="manager-kpi-icon red">
                            !
                        </div>
                    </div>

                    <strong className="manager-kpi-value">
                        {openBlockers.length}
                    </strong>

                    <span className="manager-kpi-description">
                        Current team blockers
                    </span>
                </div>
            </div>

            {/* Status + Workload */}

            <div className="manager-dashboard-grid">
                <section className="manager-dashboard-card">
                    <div className="manager-card-header">
                        <div>
                            <h3>Report Status by Member</h3>
                            <p>
                                Current report status across the team.
                            </p>
                        </div>
                    </div>

                    <div className="manager-chart-container">
                        {statusByMember.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <BarChart
                                    data={statusByMember}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="member"
                                        tick={{
                                            fontSize: 11
                                        }}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fontSize: 11
                                        }}
                                    />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="draft"
                                        name="Draft"
                                        stackId="status"
                                        fill="#94a3b8"
                                        radius={[0, 0, 0, 0]}
                                    />

                                    <Bar
                                        dataKey="submitted"
                                        name="Submitted"
                                        stackId="status"
                                        fill="#3b82f6"
                                    />

                                    <Bar
                                        dataKey="correctionRequested"
                                        name="Correction"
                                        stackId="status"
                                        fill="#f59e0b"
                                    />

                                    <Bar
                                        dataKey="approved"
                                        name="Approved"
                                        stackId="status"
                                        fill="#22c55e"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No member status data available." />
                        )}
                    </div>
                </section>

                <section className="manager-dashboard-card">
                    <div className="manager-card-header">
                        <div>
                            <h3>Workload by Project</h3>
                            <p>
                                Planned versus spent hours by project.
                            </p>
                        </div>
                    </div>

                    <div className="manager-chart-container">
                        {workloadByProject.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <BarChart
                                    data={workloadByProject}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="project"
                                        tick={{
                                            fontSize: 11
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 11
                                        }}
                                    />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="plannedHours"
                                        name="Planned Hours"
                                        fill="#64748b"
                                        radius={[4, 4, 0, 0]}
                                    />

                                    <Bar
                                        dataKey="spentHours"
                                        name="Spent Hours"
                                        fill="#2563eb"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No project workload data available." />
                        )}
                    </div>
                </section>
            </div>

            {/* Time + Task Trend */}

            <div className="manager-dashboard-grid">
                <section className="manager-dashboard-card">
                    <div className="manager-card-header">
                        <div>
                            <h3>Time by Task Type</h3>
                            <p>
                                Hours recorded by category of work.
                            </p>
                        </div>
                    </div>

                    <div className="manager-chart-container">
                        {timeByTaskType.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <PieChart>
                                    <Pie
                                        data={timeByTaskType}
                                        dataKey="hours"
                                        nameKey="taskType"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ taskType, hours }) =>
                                            `${taskType}: ${hours}h`
                                        }
                                    >
                                        {timeByTaskType.map(
                                            (_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        [
                                                            '#2563eb',
                                                            '#22c55e',
                                                            '#f59e0b',
                                                            '#8b5cf6',
                                                            '#ef4444',
                                                            '#06b6d4'
                                                        ][
                                                            index %
                                                                6
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip
                                        formatter={(value) => [
                                            `${value} hours`,
                                            'Time'
                                        ]}
                                    />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No task time data available." />
                        )}
                    </div>
                </section>

                <section className="manager-dashboard-card">
                    <div className="manager-card-header">
                        <div>
                            <h3>Task Completion Trend</h3>
                            <p>
                                Planned and spent hours across reporting weeks.
                            </p>
                        </div>
                    </div>

                    <div className="manager-chart-container">
                        {taskTrend.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <LineChart
                                    data={taskTrend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 5
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="week"
                                        tick={{
                                            fontSize: 11
                                        }}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fontSize: 11
                                        }}
                                    />

                                    <Tooltip />

                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="plannedHours"
                                        name="Planned Hours"
                                        stroke="#64748b"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="spentHours"
                                        name="Spent Hours"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyChart message="No task trend data available." />
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom Section */}

            <div className="manager-bottom-grid">
                {/* Open Blockers */}

                <section className="manager-dashboard-card">
                    <div className="manager-card-header">
                        <div>
                            <h3>Open Blockers</h3>
                            <p>
                                Issues currently affecting team progress.
                            </p>
                        </div>

                        <span className="manager-card-count">
                            {openBlockers.length}
                        </span>
                    </div>

                    {openBlockers.length > 0 ? (
                        <div className="manager-blocker-list">
                            {openBlockers.map((blocker, index) => (
                                <div
                                    className="manager-blocker-item"
                                    key={
                                        blocker.id ||
                                        blocker.blockerId ||
                                        index
                                    }
                                >
                                    <div className="manager-blocker-icon">
                                        !
                                    </div>

                                    <div className="manager-blocker-content">
                                        <strong>
                                            {blocker.blocker ||
                                                blocker.description ||
                                                'Blocker'}
                                        </strong>

                                        {(blocker.member ||
                                            blocker.project) && (
                                            <span>
                                                {blocker.member || 'Unknown member'}
                                                {blocker.project
                                                    ? ` · ${blocker.project}`
                                                    : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="manager-empty-state">
                            <div className="manager-empty-icon">
                                ✓
                            </div>

                            <strong>No open blockers</strong>

                            <p>
                                Your team currently has no reported blockers.
                            </p>
                        </div>
                    )}
                </section>

                {/* Recent Activity */}

                <section className="manager-dashboard-card">
                    <div className="manager-card-header">
                        <div>
                            <h3>Recent Activity</h3>
                            <p>
                                Latest report review activity.
                            </p>
                        </div>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="manager-activity-list">
                            {recentActivity.map((activity, index) => (
                                <div
                                    className="manager-activity-item"
                                    key={`${activity.reportId}-${activity.versionId}-${index}`}
                                >
                                    <div
                                        className={getActionClass(
                                            activity.action
                                        )}
                                    >
                                        {activity.action === 'APPROVE'
                                            ? '✓'
                                            : '!'}
                                    </div>

                                    <div className="manager-activity-content">
                                        <div className="manager-activity-main">
                                            <strong>
                                                {activity.member}
                                            </strong>

                                            <span>
                                                {activity.actionName}
                                            </span>
                                        </div>

                                        <p>
                                            {activity.project}
                                            {' · '}
                                            Version {activity.versionNumber}
                                        </p>

                                        <small>
                                            {formatDateTime(
                                                activity.createdAt
                                            )}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="manager-empty-state">
                            <div className="manager-empty-icon">
                                ≡
                            </div>

                            <strong>No recent activity</strong>

                            <p>
                                There is no recent report activity to display.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function EmptyChart({ message }) {
    return (
        <div className="manager-chart-empty">
            <span>—</span>
            <p>{message}</p>
        </div>
    );
}

export default ManagerDashboard;