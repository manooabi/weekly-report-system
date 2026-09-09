import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const createEmptyTask = () => ({
    taskName: '',
    priorityId: '',
    plannedPercentage: '',
    actualPercentage: '',
    statusId: '',
    plannedHours: '',
    spentHours: '',
    deliverable: ''
});

const createEmptyAchievement = () => ({
    achievement: '',
    isKeyAchievement: false
});

const createEmptyBlocker = () => ({
    blocker: '',
    isKeyBlocker: false
});

const createEmptyHour = () => ({
    taskTypeId: '',
    hours: ''
});

function EditReport() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [version, setVersion] = useState(null);

    const [tasks, setTasks] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [blockers, setBlockers] = useState([]);
    const [hours, setHours] = useState([]);

    const [newAchievement, setNewAchievement] = useState(
        createEmptyAchievement()
    );

    const [newBlocker, setNewBlocker] = useState(
        createEmptyBlocker()
    );

    const [newHour, setNewHour] = useState(
        createEmptyHour()
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReportForEdit = async () => {
            try {
                let reportResponse = await api.get(
                    `/reports/${id}`
                );

                let versionsResponse = await api.get(
                    `/reports/${id}/versions`
                );

                let reportData = reportResponse.data.data;
                let versions =
                    versionsResponse.data.data || [];

                let currentVersion = versions.find(
                    (item) =>
                        item.id ===
                        reportData.currentVersionId
                );

                if (!currentVersion) {
                    throw new Error(
                        'Current report version not found.'
                    );
                }

                if (
                    reportData.status?.code ===
                        'CORRECTION_REQUESTED' &&
                    currentVersion.submittedAt !== null
                ) {
                    await api.post(
                        `/reports/${id}/correction-version`
                    );

                    reportResponse = await api.get(
                        `/reports/${id}`
                    );

                    versionsResponse = await api.get(
                        `/reports/${id}/versions`
                    );

                    reportData =
                        reportResponse.data.data;

                    versions =
                        versionsResponse.data.data || [];

                    currentVersion = versions.find(
                        (item) =>
                            item.id ===
                            reportData.currentVersionId
                    );

                    if (!currentVersion) {
                        throw new Error(
                            'Correction version could not be loaded.'
                        );
                    }
                }

                setReport(reportData);
                setVersion(currentVersion);

                setTasks(
                    (currentVersion.tasks || []).map(
                        (task) => ({
                            id: task.id,
                            taskName: task.taskName,
                            priorityId: String(
                                task.priorityId
                            ),
                            plannedPercentage: String(
                                task.plannedPercentage
                            ),
                            actualPercentage: String(
                                task.actualPercentage
                            ),
                            statusId: String(
                                task.statusId
                            ),
                            plannedHours: String(
                                task.plannedHours
                            ),
                            spentHours: String(
                                task.spentHours
                            ),
                            deliverable:
                                task.deliverable || ''
                        })
                    )
                );

                setAchievements(
                    (currentVersion.achievements || []).map(
                        (achievement) => ({
                            id: achievement.id,
                            achievement:
                                achievement.achievement,
                            isKeyAchievement:
                                achievement.isKeyAchievement
                        })
                    )
                );

                setBlockers(
                    (currentVersion.blockers || []).map(
                        (blocker) => ({
                            id: blocker.id,
                            blocker: blocker.blocker,
                            isKeyBlocker:
                                blocker.isKeyBlocker
                        })
                    )
                );

                setHours(
                    (currentVersion.hours || []).map(
                        (hour) => ({
                            id: hour.id,
                            taskTypeId: String(
                                hour.taskTypeId
                            ),
                            hours: String(hour.hours)
                        })
                    )
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to load report for editing.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReportForEdit();
    }, [id]);

    const handleTaskChange = (index, event) => {
        const updatedTasks = [...tasks];

        updatedTasks[index] = {
            ...updatedTasks[index],
            [event.target.name]: event.target.value
        };

        setTasks(updatedTasks);
    };

    const addTask = () => {
        setTasks([
            ...tasks,
            createEmptyTask()
        ]);
    };

    const removeTask = async (index) => {
        const task = tasks[index];

        if (!task.id) {
            setTasks(
                tasks.filter(
                    (_, taskIndex) =>
                        taskIndex !== index
                )
            );

            return;
        }

        try {
            setError('');

            await api.delete(
                `/reports/${id}/versions/${version.id}/tasks/${task.id}`
            );

            setTasks(
                tasks.filter(
                    (_, taskIndex) =>
                        taskIndex !== index
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to delete task.'
            );
        }
    };

    const handleAchievementChange = (
        index,
        event
    ) => {
        const updatedAchievements = [
            ...achievements
        ];

        updatedAchievements[index] = {
            ...updatedAchievements[index],
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        };

        setAchievements(updatedAchievements);
    };

    const handleAchievementSave = async (
        achievement
    ) => {
        try {
            setError('');

            await api.patch(
                `/reports/${id}/versions/${version.id}/achievements/${achievement.id}`,
                {
                    achievement:
                        achievement.achievement,
                    isKeyAchievement:
                        achievement.isKeyAchievement
                }
            );

            alert(
                'Achievement updated successfully.'
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to update achievement.'
            );
        }
    };

    const handleAchievementDelete = async (
        achievementId
    ) => {
        try {
            setError('');

            await api.delete(
                `/reports/${id}/versions/${version.id}/achievements/${achievementId}`
            );

            setAchievements(
                achievements.filter(
                    (achievement) =>
                        achievement.id !==
                        achievementId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to delete achievement.'
            );
        }
    };

    const handleNewAchievementChange = (
        event
    ) => {
        setNewAchievement({
            ...newAchievement,
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        });
    };

    const addAchievement = async () => {
        if (
            !newAchievement.achievement.trim()
        ) {
            setError(
                'Achievement is required.'
            );

            return;
        }

        try {
            setError('');

            const response = await api.post(
                `/reports/${id}/versions/${version.id}/achievements`,
                {
                    achievement:
                        newAchievement.achievement,
                    isKeyAchievement:
                        newAchievement.isKeyAchievement
                }
            );

            setAchievements([
                ...achievements,
                response.data.data
            ]);

            setNewAchievement(
                createEmptyAchievement()
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to add achievement.'
            );
        }
    };

    const handleBlockerChange = (
        index,
        event
    ) => {
        const updatedBlockers = [...blockers];

        updatedBlockers[index] = {
            ...updatedBlockers[index],
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        };

        setBlockers(updatedBlockers);
    };

    const handleBlockerSave = async (
        blocker
    ) => {
        try {
            setError('');

            await api.patch(
                `/reports/${id}/versions/${version.id}/blockers/${blocker.id}`,
                {
                    blocker: blocker.blocker,
                    isKeyBlocker:
                        blocker.isKeyBlocker
                }
            );

            alert(
                'Blocker updated successfully.'
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to update blocker.'
            );
        }
    };

    const handleBlockerDelete = async (
        blockerId
    ) => {
        try {
            setError('');

            await api.delete(
                `/reports/${id}/versions/${version.id}/blockers/${blockerId}`
            );

            setBlockers(
                blockers.filter(
                    (blocker) =>
                        blocker.id !== blockerId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to delete blocker.'
            );
        }
    };

    const handleNewBlockerChange = (
        event
    ) => {
        setNewBlocker({
            ...newBlocker,
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        });
    };

    const addBlocker = async () => {
        if (!newBlocker.blocker.trim()) {
            setError(
                'Blocker is required.'
            );

            return;
        }

        try {
            setError('');

            const response = await api.post(
                `/reports/${id}/versions/${version.id}/blockers`,
                {
                    blocker: newBlocker.blocker,
                    isKeyBlocker:
                        newBlocker.isKeyBlocker
                }
            );

            setBlockers([
                ...blockers,
                response.data.data
            ]);

            setNewBlocker(
                createEmptyBlocker()
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to add blocker.'
            );
        }
    };

    const handleHourChange = (
        index,
        event
    ) => {
        const updatedHours = [...hours];

        updatedHours[index] = {
            ...updatedHours[index],
            [event.target.name]:
                event.target.value
        };

        setHours(updatedHours);
    };

    const handleHourSave = async (hour) => {
        try {
            setError('');

            await api.patch(
                `/reports/${id}/versions/${version.id}/hours/${hour.id}`,
                {
                    taskTypeId: Number(
                        hour.taskTypeId
                    ),
                    hours: Number(hour.hours)
                }
            );

            alert(
                'Hours updated successfully.'
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to update hours.'
            );
        }
    };

    const handleHourDelete = async (
        hourId
    ) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this task type hour entry?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            await api.delete(
                `/reports/${id}/versions/${version.id}/hours/${hourId}`
            );

            setHours(
                hours.filter(
                    (hour) =>
                        hour.id !== hourId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to delete hours.'
            );
        }
    };

    const handleNewHourChange = (
        event
    ) => {
        setNewHour({
            ...newHour,
            [event.target.name]:
                event.target.value
        });
    };

    const addHour = async () => {
        if (
            !newHour.taskTypeId ||
            newHour.hours === ''
        ) {
            setError(
                'Task type and hours are required.'
            );

            return;
        }

        try {
            setError('');

            const response = await api.post(
                `/reports/${id}/versions/${version.id}/hours`,
                {
                    taskTypeId: Number(
                        newHour.taskTypeId
                    ),
                    hours: Number(
                        newHour.hours
                    )
                }
            );

            setHours([
                ...hours,
                response.data.data
            ]);

            setNewHour(createEmptyHour());
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to add hours.'
            );
        }
    };

    const saveTasks = async () => {
        for (const task of tasks) {
            if (!task.id) {
                await api.post(
                    `/reports/${id}/versions/${version.id}/tasks`,
                    {
                        taskName: task.taskName,
                        priorityId:
                            Number(
                                task.priorityId
                            ),
                        plannedPercentage:
                            Number(
                                task.plannedPercentage
                            ),
                        actualPercentage:
                            Number(
                                task.actualPercentage
                            ),
                        statusId:
                            Number(
                                task.statusId
                            ),
                        plannedHours:
                            Number(
                                task.plannedHours
                            ),
                        spentHours:
                            Number(
                                task.spentHours
                            ),
                        deliverable:
                            task.deliverable ||
                            undefined
                    }
                );
            } else {
                await api.patch(
                    `/reports/${id}/versions/${version.id}/tasks/${task.id}`,
                    {
                        taskName: task.taskName,
                        priorityId:
                            Number(
                                task.priorityId
                            ),
                        plannedPercentage:
                            Number(
                                task.plannedPercentage
                            ),
                        actualPercentage:
                            Number(
                                task.actualPercentage
                            ),
                        statusId:
                            Number(
                                task.statusId
                            ),
                        plannedHours:
                            Number(
                                task.plannedHours
                            ),
                        spentHours:
                            Number(
                                task.spentHours
                            ),
                        deliverable:
                            task.deliverable ||
                            undefined
                    }
                );
            }
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setError('');
        setSaving(true);

        try {
            await saveTasks();

            alert(
                'Report changes saved successfully.'
            );

            navigate(
                `/team/reports/${id}`
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to save report changes.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        setError('');
        setSubmitting(true);

        try {
            await saveTasks();

            await api.post(
                `/reports/${id}/versions/${version.id}/submit`
            );

            alert(
                'Report submitted successfully.'
            );

            navigate(
                `/team/reports/${id}`
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to submit report.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loading-spinner"></div>
                <p>Loading report...</p>
            </div>
        );
    }

    if (error && (!report || !version)) {
        return (
            <div className="page-error-card">
                <h2>Unable to load report</h2>
                <p>{error}</p>

                <Link
                    className="primary-button"
                    to={`/team/reports/${id}`}
                >
                    Back to Report
                </Link>
            </div>
        );
    }

    if (!report || !version) {
        return (
            <div className="page-error-card">
                <h2>Report data not found</h2>

                <Link
                    className="secondary-button"
                    to="/team/reports"
                >
                    Back to My Reports
                </Link>
            </div>
        );
    }

    const isDraft =
        report.status?.code === 'DRAFT';

    const isCorrectionRequested =
        report.status?.code ===
        'CORRECTION_REQUESTED';

    return (
        <div className="edit-report-page">

            <div className="edit-report-header">
                <div>
                    <Link
                        className="back-link"
                        to={`/team/reports/${id}`}
                    >
                        ← Back to Report
                    </Link>

                    <div className="edit-report-title-row">
                        <div>
                            <p className="page-eyebrow">
                                WEEKLY WORK REPORT
                            </p>

                            <h1>
                                {isCorrectionRequested
                                    ? 'Edit & Resubmit Report'
                                    : 'Edit Report'}
                            </h1>

                            <p className="page-subtitle">
                                Update your weekly work
                                report before saving or
                                submitting it.
                            </p>
                        </div>

                        <span
                            className={`status-badge ${
                                isCorrectionRequested
                                    ? 'status-correction'
                                    : 'status-draft'
                            }`}
                        >
                            {report.status?.name ||
                                'Draft'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="edit-report-overview">

                <div className="edit-overview-item">
                    <span>Project</span>
                    <strong>
                        {report.project?.name ||
                            'N/A'}
                    </strong>
                </div>

                <div className="edit-overview-item">
                    <span>Week</span>
                    <strong>
                        {new Date(
                            report.weekStart
                        ).toLocaleDateString()}
                        {' - '}
                        {new Date(
                            report.weekEnd
                        ).toLocaleDateString()}
                    </strong>
                </div>

                <div className="edit-overview-item">
                    <span>Version</span>
                    <strong>
                        Version {version.versionNumber}
                    </strong>
                </div>

                <div className="edit-overview-item">
                    <span>Status</span>
                    <strong>
                        {report.status?.name ||
                            'N/A'}
                    </strong>
                </div>

            </div>

            {isCorrectionRequested && (
                <div className="correction-notice">
                    <div className="correction-notice-icon">
                        !
                    </div>

                    <div>
                        <h3>
                            Corrections requested
                        </h3>

                        <p>
                            Your manager requested
                            corrections to this report.
                            Your changes are being made
                            in a new report version.
                        </p>

                        <span>
                            Editing Version{' '}
                            {version.versionNumber}
                        </span>
                    </div>
                </div>
            )}

            {error && (
                <div className="form-error-banner">
                    <strong>Something went wrong</strong>
                    <span>{error}</span>
                </div>
            )}

            <form
                className="edit-report-form"
                onSubmit={handleSave}
            >

                {/* TASKS */}

                <section className="edit-section-card">

                    <div className="edit-section-header">
                        <div>
                            <span className="section-number">
                                01
                            </span>

                            <div>
                                <h2>
                                    Tasks
                                </h2>

                                <p>
                                    Update the work completed
                                    during this week.
                                </p>
                            </div>
                        </div>

                        <span className="section-count">
                            {tasks.length}{' '}
                            {tasks.length === 1
                                ? 'Task'
                                : 'Tasks'}
                        </span>
                    </div>

                    <div className="task-editor-list">

                        {tasks.map(
                            (task, index) => (
                                <div
                                    className="task-editor-card"
                                    key={
                                        task.id ||
                                        index
                                    }
                                >

                                    <div className="task-editor-header">
                                        <div>
                                            <span>
                                                TASK{' '}
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    '0'
                                                )}
                                            </span>

                                            <h3>
                                                {task.taskName ||
                                                    'New Task'}
                                            </h3>
                                        </div>

                                        <button
                                            type="button"
                                            className="danger-outline-button"
                                            onClick={() =>
                                                removeTask(
                                                    index
                                                )
                                            }
                                            disabled={
                                                tasks.length ===
                                                1
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="form-grid">

                                        <div className="form-field form-field-wide">
                                            <label>
                                                Task Name
                                            </label>

                                            <input
                                                type="text"
                                                name="taskName"
                                                value={
                                                    task.taskName
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                placeholder="e.g. Implement user authentication"
                                                required
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Priority
                                            </label>

                                            <select
                                                name="priorityId"
                                                value={
                                                    task.priorityId
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select priority
                                                </option>

                                                <option value="1">
                                                    Low
                                                </option>

                                                <option value="2">
                                                    Medium
                                                </option>

                                                <option value="3">
                                                    High
                                                </option>

                                                <option value="4">
                                                    Critical
                                                </option>
                                            </select>
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Status
                                            </label>

                                            <select
                                                name="statusId"
                                                value={
                                                    task.statusId
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select status
                                                </option>

                                                <option value="1">
                                                    Not Started
                                                </option>

                                                <option value="2">
                                                    In Progress
                                                </option>

                                                <option value="3">
                                                    Completed
                                                </option>

                                                <option value="4">
                                                    Blocked
                                                </option>
                                            </select>
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Planned %
                                            </label>

                                            <input
                                                type="number"
                                                name="plannedPercentage"
                                                value={
                                                    task.plannedPercentage
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Actual %
                                            </label>

                                            <input
                                                type="number"
                                                name="actualPercentage"
                                                value={
                                                    task.actualPercentage
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Planned Hours
                                            </label>

                                            <input
                                                type="number"
                                                name="plannedHours"
                                                value={
                                                    task.plannedHours
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Spent Hours
                                            </label>

                                            <input
                                                type="number"
                                                name="spentHours"
                                                value={
                                                    task.spentHours
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="form-field form-field-wide">
                                            <label>
                                                Deliverable
                                            </label>

                                            <textarea
                                                name="deliverable"
                                                value={
                                                    task.deliverable
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleTaskChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                rows="3"
                                                placeholder="Describe the deliverable or outcome..."
                                            />
                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                    <button
                        type="button"
                        className="add-section-button"
                        onClick={addTask}
                    >
                        <span>+</span>
                        Add Another Task
                    </button>

                </section>

                {/* ACHIEVEMENTS */}

                <section className="edit-section-card">

                    <div className="edit-section-header">
                        <div>
                            <span className="section-number">
                                02
                            </span>

                            <div>
                                <h2>
                                    Achievements
                                </h2>

                                <p>
                                    Highlight important
                                    accomplishments.
                                </p>
                            </div>
                        </div>

                        <span className="section-count">
                            {achievements.length}{' '}
                            {achievements.length === 1
                                ? 'Achievement'
                                : 'Achievements'}
                        </span>
                    </div>

                    <div className="editable-item-list">

                        {achievements.map(
                            (
                                achievement,
                                index
                            ) => (
                                <div
                                    className="editable-item-card achievement-editor"
                                    key={
                                        achievement.id
                                    }
                                >
                                    <div className="editable-item-number">
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            '0'
                                        )}
                                    </div>

                                    <div className="editable-item-content">

                                        <div className="form-field">
                                            <label>
                                                Achievement
                                            </label>

                                            <textarea
                                                name="achievement"
                                                value={
                                                    achievement.achievement
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleAchievementChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                rows="3"
                                                required
                                            />
                                        </div>

                                        <div className="item-actions">

                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="isKeyAchievement"
                                                    checked={
                                                        achievement.isKeyAchievement
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleAchievementChange(
                                                            index,
                                                            event
                                                        )
                                                    }
                                                />

                                                <span>
                                                    Key Achievement
                                                </span>
                                            </label>

                                            <div className="action-buttons">
                                                <button
                                                    type="button"
                                                    className="secondary-small-button"
                                                    onClick={() =>
                                                        handleAchievementSave(
                                                            achievement
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    className="danger-small-button"
                                                    onClick={() =>
                                                        handleAchievementDelete(
                                                            achievement.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            )
                        )}

                    </div>

                    <div className="add-item-box">
                        <div className="add-item-heading">
                            <span>+</span>

                            <div>
                                <h3>
                                    Add Achievement
                                </h3>

                                <p>
                                    Add another achievement
                                    to this report.
                                </p>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>
                                Achievement
                            </label>

                            <textarea
                                name="achievement"
                                value={
                                    newAchievement.achievement
                                }
                                onChange={
                                    handleNewAchievementChange
                                }
                                rows="3"
                                placeholder="Enter an achievement"
                            />
                        </div>

                        <div className="add-item-footer">

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isKeyAchievement"
                                    checked={
                                        newAchievement.isKeyAchievement
                                    }
                                    onChange={
                                        handleNewAchievementChange
                                    }
                                />

                                <span>
                                    Key Achievement
                                </span>
                            </label>

                            <button
                                type="button"
                                className="primary-small-button"
                                onClick={
                                    addAchievement
                                }
                            >
                                + Add Achievement
                            </button>

                        </div>
                    </div>

                </section>

                {/* BLOCKERS */}

                <section className="edit-section-card">

                    <div className="edit-section-header">
                        <div>
                            <span className="section-number">
                                03
                            </span>

                            <div>
                                <h2>
                                    Blockers & Challenges
                                </h2>

                                <p>
                                    Record issues affecting
                                    your progress.
                                </p>
                            </div>
                        </div>

                        <span className="section-count">
                            {blockers.length}{' '}
                            {blockers.length === 1
                                ? 'Blocker'
                                : 'Blockers'}
                        </span>
                    </div>

                    <div className="editable-item-list">

                        {blockers.map(
                            (blocker, index) => (
                                <div
                                    className="editable-item-card blocker-editor"
                                    key={
                                        blocker.id
                                    }
                                >
                                    <div className="editable-item-number">
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            '0'
                                        )}
                                    </div>

                                    <div className="editable-item-content">

                                        <div className="form-field">
                                            <label>
                                                Blocker
                                            </label>

                                            <textarea
                                                name="blocker"
                                                value={
                                                    blocker.blocker
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleBlockerChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                rows="3"
                                                required
                                            />
                                        </div>

                                        <div className="item-actions">

                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="isKeyBlocker"
                                                    checked={
                                                        blocker.isKeyBlocker
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleBlockerChange(
                                                            index,
                                                            event
                                                        )
                                                    }
                                                />

                                                <span>
                                                    Key Blocker
                                                </span>
                                            </label>

                                            <div className="action-buttons">
                                                <button
                                                    type="button"
                                                    className="secondary-small-button"
                                                    onClick={() =>
                                                        handleBlockerSave(
                                                            blocker
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    type="button"
                                                    className="danger-small-button"
                                                    onClick={() =>
                                                        handleBlockerDelete(
                                                            blocker.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            )
                        )}

                    </div>

                    <div className="add-item-box">
                        <div className="add-item-heading">
                            <span>+</span>

                            <div>
                                <h3>
                                    Add Blocker
                                </h3>

                                <p>
                                    Add another challenge or
                                    blocker.
                                </p>
                            </div>
                        </div>

                        <div className="form-field">
                            <label>
                                Blocker
                            </label>

                            <textarea
                                name="blocker"
                                value={
                                    newBlocker.blocker
                                }
                                onChange={
                                    handleNewBlockerChange
                                }
                                rows="3"
                                placeholder="Enter a blocker or challenge"
                            />
                        </div>

                        <div className="add-item-footer">

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isKeyBlocker"
                                    checked={
                                        newBlocker.isKeyBlocker
                                    }
                                    onChange={
                                        handleNewBlockerChange
                                    }
                                />

                                <span>
                                    Key Blocker
                                </span>
                            </label>

                            <button
                                type="button"
                                className="primary-small-button"
                                onClick={
                                    addBlocker
                                }
                            >
                                + Add Blocker
                            </button>

                        </div>
                    </div>

                </section>

                {/* HOURS */}

                <section className="edit-section-card">

                    <div className="edit-section-header">
                        <div>
                            <span className="section-number">
                                04
                            </span>

                            <div>
                                <h2>
                                    Hours by Task Type
                                </h2>

                                <p>
                                    Update the time spent
                                    across different work
                                    types.
                                </p>
                            </div>
                        </div>

                        <span className="section-count">
                            {hours.length}{' '}
                            {hours.length === 1
                                ? 'Entry'
                                : 'Entries'}
                        </span>
                    </div>

                    {hours.length === 0 ? (
                        <div className="section-empty">
                            <div className="empty-icon">
                                ◷
                            </div>

                            <h3>
                                No hours recorded
                            </h3>

                            <p>
                                Add task type hours below
                                to track your time.
                            </p>
                        </div>
                    ) : (
                        <div className="hours-editor-list">

                            {hours.map(
                                (hour, index) => (
                                    <div
                                        className="hour-editor-row"
                                        key={
                                            hour.id
                                        }
                                    >

                                        <div className="hour-index">
                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                '0'
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label>
                                                Task Type
                                            </label>

                                            <select
                                                name="taskTypeId"
                                                value={
                                                    hour.taskTypeId
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleHourChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select task type
                                                </option>

                                                <option value="1">
                                                    Development
                                                </option>

                                                <option value="2">
                                                    Testing
                                                </option>

                                                <option value="3">
                                                    Meeting
                                                </option>

                                                <option value="4">
                                                    Support
                                                </option>

                                                <option value="5">
                                                    Documentation
                                                </option>

                                                <option value="6">
                                                    Research
                                                </option>
                                            </select>
                                        </div>

                                        <div className="form-field hour-input-field">
                                            <label>
                                                Hours
                                            </label>

                                            <input
                                                type="number"
                                                name="hours"
                                                value={
                                                    hour.hours
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleHourChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="hour-actions">
                                            <button
                                                type="button"
                                                className="secondary-small-button"
                                                onClick={() =>
                                                    handleHourSave(
                                                        hour
                                                    )
                                                }
                                            >
                                                Save
                                            </button>

                                            <button
                                                type="button"
                                                className="danger-small-button"
                                                onClick={() =>
                                                    handleHourDelete(
                                                        hour.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                    <div className="add-hour-box">

                        <div className="add-item-heading">
                            <span>+</span>

                            <div>
                                <h3>
                                    Add Task Type Hours
                                </h3>

                                <p>
                                    Record additional time
                                    spent on a task type.
                                </p>
                            </div>
                        </div>

                        <div className="add-hour-form">

                            <div className="form-field">
                                <label>
                                    Task Type
                                </label>

                                <select
                                    name="taskTypeId"
                                    value={
                                        newHour.taskTypeId
                                    }
                                    onChange={
                                        handleNewHourChange
                                    }
                                >
                                    <option value="">
                                        Select task type
                                    </option>

                                    <option value="1">
                                        Development
                                    </option>

                                    <option value="2">
                                        Testing
                                    </option>

                                    <option value="3">
                                        Meeting
                                    </option>

                                    <option value="4">
                                        Support
                                    </option>

                                    <option value="5">
                                        Documentation
                                    </option>

                                    <option value="6">
                                        Research
                                    </option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label>
                                    Hours
                                </label>

                                <input
                                    type="number"
                                    name="hours"
                                    value={
                                        newHour.hours
                                    }
                                    onChange={
                                        handleNewHourChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter hours"
                                />
                            </div>

                            <button
                                type="button"
                                className="primary-small-button add-hour-button"
                                onClick={addHour}
                            >
                                + Add Hours
                            </button>

                        </div>

                    </div>

                </section>

                {/* FORM ACTIONS */}

                <div className="edit-report-actions">

                    <Link
                        className="cancel-button"
                        to={`/team/reports/${id}`}
                    >
                        Cancel
                    </Link>

                    <div className="edit-primary-actions">

                        <button
                            type="submit"
                            className="save-report-button"
                            disabled={
                                saving ||
                                submitting
                            }
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>

                        {(isDraft ||
                            isCorrectionRequested) && (
                            <button
                                type="button"
                                className="submit-report-button"
                                onClick={
                                    handleSubmit
                                }
                                disabled={
                                    saving ||
                                    submitting
                                }
                            >
                                {submitting
                                    ? 'Submitting...'
                                    : isCorrectionRequested
                                        ? 'Save & Resubmit'
                                        : 'Submit Report'}
                            </button>
                        )}

                    </div>

                </div>

            </form>
        </div>
    );
}

export default EditReport;