import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const initialTask = {
    taskName: '',
    priorityId: '',
    plannedPercentage: '',
    actualPercentage: '',
    statusId: '',
    plannedHours: '',
    spentHours: '',
    deliverable: ''
};

const initialAchievement = {
    achievement: '',
    isKeyAchievement: false
};

const initialBlocker = {
    blocker: '',
    isKeyBlocker: false
};

const initialHour = {
    taskTypeId: '',
    hours: ''
};

function CreateReport() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        weekStart: '',
        weekEnd: '',
        projectId: '',
        nextWeekPlan: '',
        notes: '',
        links: ''
    });

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([{ ...initialTask }]);
    const [achievements, setAchievements] = useState([
        { ...initialAchievement }
    ]);
    const [blockers, setBlockers] = useState([
        { ...initialBlocker }
    ]);
    const [hours, setHours] = useState([{ ...initialHour }]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/my-projects');
                setProjects(response.data.data || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load projects.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

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
            { ...initialTask }
        ]);
    };

    const removeTask = (index) => {
        if (tasks.length === 1) {
            return;
        }

        setTasks(
            tasks.filter(
                (_, taskIndex) => taskIndex !== index
            )
        );
    };

    const handleAchievementChange = (index, event) => {
        const updatedAchievements = [...achievements];

        updatedAchievements[index] = {
            ...updatedAchievements[index],
            [event.target.name]:
                event.target.type === 'checkbox'
                    ? event.target.checked
                    : event.target.value
        };

        setAchievements(updatedAchievements);
    };

    const addAchievement = () => {
        setAchievements([
            ...achievements,
            { ...initialAchievement }
        ]);
    };

    const removeAchievement = (index) => {
        if (achievements.length === 1) {
            return;
        }

        setAchievements(
            achievements.filter(
                (_, achievementIndex) =>
                    achievementIndex !== index
            )
        );
    };

    const handleBlockerChange = (index, event) => {
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

    const addBlocker = () => {
        setBlockers([
            ...blockers,
            { ...initialBlocker }
        ]);
    };

    const removeBlocker = (index) => {
        if (blockers.length === 1) {
            return;
        }

        setBlockers(
            blockers.filter(
                (_, blockerIndex) =>
                    blockerIndex !== index
            )
        );
    };

    const handleHourChange = (index, event) => {
        const updatedHours = [...hours];

        updatedHours[index] = {
            ...updatedHours[index],
            [event.target.name]: event.target.value
        };

        setHours(updatedHours);
    };

    const addHour = () => {
        setHours([
            ...hours,
            { ...initialHour }
        ]);
    };

    const removeHour = (index) => {
        if (hours.length === 1) {
            return;
        }

        setHours(
            hours.filter(
                (_, hourIndex) => hourIndex !== index
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSaving(true);

        try {
            // Step 1: Create the report
            const reportResponse = await api.post('/reports', {
                weekStart: formData.weekStart,
                weekEnd: formData.weekEnd,
                projectId: Number(formData.projectId)
            });

            const report = reportResponse.data.data;

            // Step 2: Create the first report version
            const versionResponse = await api.post(
                `/reports/${report.id}/versions`,
                {
                    nextWeekPlan: formData.nextWeekPlan,
                    notes: formData.notes || undefined,
                    links: formData.links || undefined
                }
            );

            const version = versionResponse.data.data;

            // Step 3: Create each task
            for (const task of tasks) {
                await api.post(
                    `/reports/${report.id}/versions/${version.id}/tasks`,
                    {
                        taskName: task.taskName,
                        priorityId: Number(task.priorityId),
                        plannedPercentage: Number(
                            task.plannedPercentage
                        ),
                        actualPercentage: Number(
                            task.actualPercentage
                        ),
                        statusId: Number(task.statusId),
                        plannedHours: Number(
                            task.plannedHours
                        ),
                        spentHours: Number(
                            task.spentHours
                        ),
                        deliverable:
                            task.deliverable || undefined
                    }
                );
            }

            // Step 4: Create achievements
            for (const achievement of achievements) {
                if (achievement.achievement.trim() !== '') {
                    await api.post(
                        `/reports/${report.id}/versions/${version.id}/achievements`,
                        {
                            achievement:
                                achievement.achievement,
                            isKeyAchievement:
                                achievement.isKeyAchievement
                        }
                    );
                }
            }

            // Step 5: Create blockers
            for (const blocker of blockers) {
                if (blocker.blocker.trim() !== '') {
                    await api.post(
                        `/reports/${report.id}/versions/${version.id}/blockers`,
                        {
                            blocker: blocker.blocker,
                            isKeyBlocker:
                                blocker.isKeyBlocker
                        }
                    );
                }
            }

            // Step 6: Create hours by task type
            for (const hour of hours) {
                if (
                    hour.taskTypeId &&
                    hour.hours !== ''
                ) {
                    await api.post(
                        `/reports/${report.id}/versions/${version.id}/hours`,
                        {
                            taskTypeId: Number(
                                hour.taskTypeId
                            ),
                            hours: Number(hour.hours)
                        }
                    );
                }
            }

            alert('Report draft saved successfully.');

            navigate(`/team/reports/${report.id}`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to save report.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="create-report-loading">
                <div className="loading-spinner"></div>
                <p>Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="create-report-page">

            {/* Page Header */}
            <div className="create-report-header">
                <div>
                    <button
                        type="button"
                        className="back-link"
                        onClick={() =>
                            navigate('/team/reports')
                        }
                    >
                        ← Back to My Reports
                    </button>

                    <p className="page-eyebrow">
                        WEEKLY REPORT
                    </p>

                    <h1>Create Report</h1>

                    <p className="page-subtitle">
                        Record your completed work, progress,
                        upcoming plans, achievements, blockers,
                        and time spent.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="create-report-error">
                    <span className="error-icon">!</span>

                    <div>
                        <strong>
                            Unable to save report
                        </strong>

                        <p>{error}</p>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="create-report-form"
            >

                {/* 01 - Report Details */}
                <section className="create-section-card">
                    <div className="section-heading">
                        <div className="section-number">
                            01
                        </div>

                        <div>
                            <h2>Report Details</h2>

                            <p>
                                Select the reporting period
                                and project for this report.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid three-columns">

                        <div className="form-field">
                            <label htmlFor="weekStart">
                                Week Start
                            </label>

                            <input
                                id="weekStart"
                                type="date"
                                name="weekStart"
                                value={formData.weekStart}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="weekEnd">
                                Week End
                            </label>

                            <input
                                id="weekEnd"
                                type="date"
                                name="weekEnd"
                                value={formData.weekEnd}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="projectId">
                                Project
                            </label>

                            <select
                                id="projectId"
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select a project
                                </option>

                                {projects.map((project) => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                </section>

                {/* 02 - Next Week Plan */}
                <section className="create-section-card">
                    <div className="section-heading">
                        <div className="section-number">
                            02
                        </div>

                        <div>
                            <h2>Next Week Plan</h2>

                            <p>
                                Describe the work you plan
                                to complete next week.
                            </p>
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="nextWeekPlan">
                            Planned Work
                        </label>

                        <textarea
                            id="nextWeekPlan"
                            name="nextWeekPlan"
                            value={formData.nextWeekPlan}
                            onChange={handleChange}
                            rows="5"
                            placeholder="What do you plan to work on next week?"
                            required
                        />
                    </div>
                </section>

                {/* 03 - Additional Information */}
                <section className="create-section-card">
                    <div className="section-heading">
                        <div className="section-number">
                            03
                        </div>

                        <div>
                            <h2>
                                Additional Information
                            </h2>

                            <p>
                                Add any useful notes or
                                supporting links.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid two-columns">

                        <div className="form-field">
                            <label htmlFor="notes">
                                Notes

                                <span className="optional-label">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Add any additional notes..."
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="links">
                                Links

                                <span className="optional-label">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                id="links"
                                name="links"
                                value={formData.links}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Add relevant URLs, tickets, pull requests, documents..."
                            />
                        </div>

                    </div>
                </section>

                {/* 04 - Tasks */}
                <section className="create-section-card">
                    <div className="section-heading section-heading-with-action">

                        <div className="section-heading-content">
                            <div className="section-number">
                                04
                            </div>

                            <div>
                                <h2>Tasks Completed</h2>

                                <p>
                                    Record the work completed
                                    during this reporting period.
                                </p>
                            </div>
                        </div>

                        <span className="item-count">
                            {tasks.length}{' '}
                            {tasks.length === 1
                                ? 'Task'
                                : 'Tasks'}
                        </span>
                    </div>

                    <div className="task-list">

                        {tasks.map((task, index) => (
                            <div
                                className="task-editor-card"
                                key={index}
                            >
                                <div className="task-editor-header">

                                    <div>
                                        <span className="task-label">
                                            TASK{' '}
                                            {String(index + 1).padStart(
                                                2,
                                                '0'
                                            )}
                                        </span>

                                        <h3>
                                            {task.taskName ||
                                                `Task ${index + 1}`}
                                        </h3>
                                    </div>

                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() =>
                                            removeTask(index)
                                        }
                                        disabled={
                                            tasks.length === 1
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="form-grid two-columns">

                                    <div className="form-field field-full">
                                        <label>
                                            Task Name
                                        </label>

                                        <input
                                            type="text"
                                            name="taskName"
                                            value={
                                                task.taskName
                                            }
                                            onChange={(event) =>
                                                handleTaskChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            placeholder="Enter task name"
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
                                            onChange={(event) =>
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
                                            onChange={(event) =>
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
                                            onChange={(event) =>
                                                handleTaskChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="0 - 100"
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
                                            onChange={(event) =>
                                                handleTaskChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="0 - 100"
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
                                            onChange={(event) =>
                                                handleTaskChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
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
                                            onChange={(event) =>
                                                handleTaskChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div className="form-field field-full">
                                        <label>
                                            Deliverable

                                            <span className="optional-label">
                                                Optional
                                            </span>
                                        </label>

                                        <textarea
                                            name="deliverable"
                                            value={
                                                task.deliverable
                                            }
                                            onChange={(event) =>
                                                handleTaskChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            rows="3"
                                            placeholder="Describe the output, feature, document, ticket, or other deliverable..."
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                    <button
                        type="button"
                        className="add-item-button"
                        onClick={addTask}
                    >
                        <span>+</span>
                        Add Another Task
                    </button>
                </section>

                {/* 05 - Achievements */}
                <section className="create-section-card">
                    <div className="section-heading section-heading-with-action">

                        <div className="section-heading-content">
                            <div className="section-number">
                                05
                            </div>

                            <div>
                                <h2>
                                    Achievements & Highlights
                                </h2>

                                <p>
                                    Capture important accomplishments
                                    from this reporting period.
                                </p>
                            </div>
                        </div>

                        <span className="optional-section-label">
                            Optional
                        </span>
                    </div>

                    <div className="achievement-list">

                        {achievements.map(
                            (achievement, index) => (
                                <div
                                    className="achievement-editor-card"
                                    key={index}
                                >
                                    <div className="editor-item-header">
                                        <span className="editor-item-number">
                                            {String(index + 1).padStart(
                                                2,
                                                '0'
                                            )}
                                        </span>

                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() =>
                                                removeAchievement(
                                                    index
                                                )
                                            }
                                            disabled={
                                                achievements.length ===
                                                1
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="form-field">
                                        <label>
                                            Achievement
                                        </label>

                                        <textarea
                                            name="achievement"
                                            value={
                                                achievement.achievement
                                            }
                                            onChange={(event) =>
                                                handleAchievementChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            rows="3"
                                            placeholder="Describe an important achievement or highlight..."
                                        />
                                    </div>

                                    <label className="checkbox-field">
                                        <input
                                            type="checkbox"
                                            name="isKeyAchievement"
                                            checked={
                                                achievement.isKeyAchievement
                                            }
                                            onChange={(event) =>
                                                handleAchievementChange(
                                                    index,
                                                    event
                                                )
                                            }
                                        />

                                        <span>
                                            Mark as key achievement
                                        </span>
                                    </label>
                                </div>
                            )
                        )}

                    </div>

                    <button
                        type="button"
                        className="add-item-button"
                        onClick={addAchievement}
                    >
                        <span>+</span>
                        Add Achievement
                    </button>
                </section>

                {/* 06 - Blockers */}
                <section className="create-section-card">
                    <div className="section-heading section-heading-with-action">

                        <div className="section-heading-content">
                            <div className="section-number">
                                06
                            </div>

                            <div>
                                <h2>
                                    Blockers & Challenges
                                </h2>

                                <p>
                                    Record issues, dependencies,
                                    or challenges affecting your work.
                                </p>
                            </div>
                        </div>

                        <span className="optional-section-label">
                            Optional
                        </span>
                    </div>

                    <div className="blocker-list">

                        {blockers.map(
                            (blocker, index) => (
                                <div
                                    className="blocker-editor-card"
                                    key={index}
                                >
                                    <div className="editor-item-header">
                                        <span className="editor-item-number">
                                            {String(index + 1).padStart(
                                                2,
                                                '0'
                                            )}
                                        </span>

                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() =>
                                                removeBlocker(
                                                    index
                                                )
                                            }
                                            disabled={
                                                blockers.length ===
                                                1
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="form-field">
                                        <label>
                                            Blocker / Challenge
                                        </label>

                                        <textarea
                                            name="blocker"
                                            value={
                                                blocker.blocker
                                            }
                                            onChange={(event) =>
                                                handleBlockerChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            rows="3"
                                            placeholder="Describe an issue, dependency, or challenge..."
                                        />
                                    </div>

                                    <label className="checkbox-field">
                                        <input
                                            type="checkbox"
                                            name="isKeyBlocker"
                                            checked={
                                                blocker.isKeyBlocker
                                            }
                                            onChange={(event) =>
                                                handleBlockerChange(
                                                    index,
                                                    event
                                                )
                                            }
                                        />

                                        <span>
                                            Mark as key blocker
                                        </span>
                                    </label>
                                </div>
                            )
                        )}

                    </div>

                    <button
                        type="button"
                        className="add-item-button"
                        onClick={addBlocker}
                    >
                        <span>+</span>
                        Add Blocker
                    </button>
                </section>

                {/* 07 - Hours */}
                <section className="create-section-card">
                    <div className="section-heading section-heading-with-action">

                        <div className="section-heading-content">
                            <div className="section-number">
                                07
                            </div>

                            <div>
                                <h2>
                                    Hours by Task Type
                                </h2>

                                <p>
                                    Optionally break down your
                                    working hours by activity type.
                                </p>
                            </div>
                        </div>

                        <span className="optional-section-label">
                            Optional
                        </span>
                    </div>

                    <div className="hours-list">

                        {hours.map((hour, index) => (
                            <div
                                className="hours-editor-row"
                                key={index}
                            >
                                <div className="hours-row-number">
                                    {String(index + 1).padStart(
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
                                        onChange={(event) =>
                                            handleHourChange(
                                                index,
                                                event
                                            )
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
                                        value={hour.hours}
                                        onChange={(event) =>
                                            handleHourChange(
                                                index,
                                                event
                                            )
                                        }
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="remove-button hours-remove-button"
                                    onClick={() =>
                                        removeHour(index)
                                    }
                                    disabled={
                                        hours.length === 1
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                    </div>

                    <button
                        type="button"
                        className="add-item-button"
                        onClick={addHour}
                    >
                        <span>+</span>
                        Add Task Type Hours
                    </button>
                </section>

                {/* Bottom Actions */}
                <div className="create-report-actions">

                    <button
                        type="button"
                        className="secondary-action-button"
                        onClick={() =>
                            navigate('/team/reports')
                        }
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-action-button"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="button-spinner"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                Save Draft
                                <span>→</span>
                            </>
                        )}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default CreateReport;