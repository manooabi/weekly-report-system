import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const initialFilters = {
    userId: '',
    projectId: '',
    categoryId: '',
    statusId: '',
    startDate: '',
    endDate: ''
};

const statusOptions = [
    { id: 1, code: 'DRAFT', name: 'Draft' },
    { id: 2, code: 'SUBMITTED', name: 'Submitted' },
    {
        id: 3,
        code: 'CORRECTION_REQUESTED',
        name: 'Correction Requested'
    },
    { id: 4, code: 'APPROVED', name: 'Approved' }
];

function ManagerReports() {
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        ...initialFilters
    });

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const [loading, setLoading] = useState(true);
    const [metadataLoading, setMetadataLoading] = useState(true);
    const [error, setError] = useState('');

    // Load filter data
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                setMetadataLoading(true);

                const [
                    usersResponse,
                    projectsResponse,
                    categoriesResponse
                ] = await Promise.all([
                    api.get('/users/team-members'),
                    api.get('/projects'),
                    api.get('/categories')
                ]);

                // const teamMembers =
                //     usersResponse.data.data?.filter(
                //         (user) => user.role?.code === 'TEAM_MEMBER'
                //     ) || [];
                const teamMembers =
    usersResponse.data.data || [];

                setUsers(teamMembers);
                setProjects(projectsResponse.data.data || []);
                setCategories(categoriesResponse.data.data || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load filter data.'
                );
            } finally {
                setMetadataLoading(false);
            }
        };

        fetchFilterData();
    }, []);

    // Load reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError('');

                const params = {
                    page,
                    limit
                };

                if (filters.userId) {
                    params.userId = Number(filters.userId);
                }

                if (filters.projectId) {
                    params.projectId = Number(filters.projectId);
                }

                if (filters.categoryId) {
                    params.categoryId = Number(filters.categoryId);
                }

                if (filters.statusId) {
                    params.statusId = Number(filters.statusId);
                }

                if (filters.startDate) {
                    params.startDate = filters.startDate;
                }

                if (filters.endDate) {
                    params.endDate = filters.endDate;
                }

                const response = await api.get(
                    '/reports/manager',
                    { params }
                );

                setReports(
                    response.data.data?.reports || []
                );

                setPagination(
                    response.data.data?.pagination || {
                        page: 1,
                        limit,
                        total: 0,
                        totalPages: 1
                    }
                );
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
    }, [filters, page, limit]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value
        }));
    };

    const handleApplyFilters = (event) => {
        event.preventDefault();

        if (
            filters.startDate &&
            filters.endDate &&
            filters.startDate > filters.endDate
        ) {
            setError(
                'Start date cannot be later than end date.'
            );

            return;
        }

        setError('');
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            ...initialFilters
        });

        setPage(1);
        setError('');
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(
                (currentPage) => currentPage - 1
            );
        }
    };

    const handleNextPage = () => {
        if (page < pagination.totalPages) {
            setPage(
                (currentPage) => currentPage + 1
            );
        }
    };

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

    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) {
            return '-';
        }

        return `${formatDate(startDate)} – ${formatDate(endDate)}`;
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

    return (
        <div className="manager-reports-page">

            <div className="manager-reports-header">
                <div>
                    <span className="manager-page-eyebrow">
                        REPORT MANAGEMENT
                    </span>

                    <h2>Team Reports</h2>

                    <p>
                        Review weekly reports submitted by
                        your team members.
                    </p>
                </div>

                <div className="manager-reports-total">
                    <strong>{pagination.total}</strong>
                    <span>Total Reports</span>
                </div>
            </div>

            {error && (
                <div className="manager-reports-error">
                    <span>!</span>
                    <p>{error}</p>
                </div>
            )}

            <section className="manager-filter-card">

                <div className="manager-filter-header">
                    <div>
                        <h3>Filter Reports</h3>

                        <p>
                            Narrow down reports by member,
                            project, category, status, or
                            date range.
                        </p>
                    </div>
                </div>

                <form
                    className="manager-filter-form"
                    onSubmit={handleApplyFilters}
                >

                    <div className="manager-filter-field">
                        <label htmlFor="userId">
                            Team Member
                        </label>

                        <select
                            id="userId"
                            name="userId"
                            value={filters.userId}
                            onChange={handleFilterChange}
                            disabled={metadataLoading}
                        >
                            <option value="">
                                All Team Members
                            </option>

                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="manager-filter-field">
                        <label htmlFor="projectId">
                            Project
                        </label>

                        <select
                            id="projectId"
                            name="projectId"
                            value={filters.projectId}
                            onChange={handleFilterChange}
                            disabled={metadataLoading}
                        >
                            <option value="">
                                All Projects
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

                    <div className="manager-filter-field">
                        <label htmlFor="categoryId">
                            Category
                        </label>

                        <select
                            id="categoryId"
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            disabled={metadataLoading}
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="manager-filter-field">
                        <label htmlFor="statusId">
                            Status
                        </label>

                        <select
                            id="statusId"
                            name="statusId"
                            value={filters.statusId}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                All Statuses
                            </option>

                            {statusOptions.map((status) => (
                                <option
                                    key={status.id}
                                    value={status.id}
                                >
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="manager-filter-field">
                        <label htmlFor="startDate">
                            Start Date
                        </label>

                        <input
                            id="startDate"
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="manager-filter-field">
                        <label htmlFor="endDate">
                            End Date
                        </label>

                        <input
                            id="endDate"
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="manager-filter-actions">

                        <button
                            type="submit"
                            className="manager-filter-apply"
                        >
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            className="manager-filter-clear"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </button>

                    </div>
                </form>
            </section>

            <section className="manager-reports-card">

                <div className="manager-reports-card-header">
                    <div>
                        <h3>Weekly Reports</h3>

                        <p>
                            {pagination.total === 0
                                ? 'No reports found'
                                : `Showing ${
                                    (pagination.page - 1) *
                                    pagination.limit +
                                    1
                                }–${Math.min(
                                    pagination.page *
                                    pagination.limit,
                                    pagination.total
                                )} of ${
                                    pagination.total
                                } reports`}
                        </p>
                    </div>
                </div>

                {loading ? (

                    <div className="manager-reports-loading">
                        <div className="manager-loading-spinner"></div>
                        <p>Loading reports...</p>
                    </div>

                ) : reports.length === 0 ? (

                    <div className="manager-reports-empty">

                        <div className="manager-empty-icon">
                            ≡
                        </div>

                        <h3>No reports found</h3>

                        <p>
                            No reports match the selected
                            filters.
                        </p>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <>
                        <div className="manager-reports-table-wrapper">

                            <table className="manager-reports-table">

                                <thead>
                                    <tr>
                                        <th>Team Member</th>
                                        <th>Project</th>
                                        <th>Category</th>
                                        <th>Week</th>
                                        <th>Status</th>
                                        <th>Last Updated</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {reports.map((report) => (

                                        <tr key={report.id}>

                                            {/* <td>
                                                <div className="manager-member-cell">

                                                    <div className="manager-member-avatar">
                                                        {report.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            'U'}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {report.user?.name}
                                                        </strong>

                                                        <span>
                                                            {report.user?.email}
                                                        </span>
                                                    </div>

                                                </div>
                                            </td> */}
                                            <td>
    <div className="manager-member-cell">

        <div className="manager-member-avatar">
            {report.user?.name
                ?.charAt(0)
                .toUpperCase() ||
                'U'}
        </div>

        <div>
            {report.user?.id ? (
                <button
                    type="button"
                    className="manager-member-link"
                    onClick={() =>
                        navigate(
                            `/manager/users/${report.user.id}`
                        )
                    }
                >
                    {report.user.name}
                </button>
            ) : (
                <strong>
                    {report.user?.name || '-'}
                </strong>
            )}

            <span>
                {report.user?.email}
            </span>
        </div>

    </div>
</td>

                                            <td>
                                                <span className="manager-project-name">
                                                    {report.project?.name}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="manager-category-name">
                                                    {report.project?.category?.name}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="manager-week-range">
                                                    {formatDateRange(
                                                        report.weekStart,
                                                        report.weekEnd
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={getStatusClass(
                                                        report.status?.code
                                                    )}
                                                >
                                                    {report.status?.name}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="manager-updated-date">
                                                    {formatDateTime(
                                                        report.updatedAt
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <Link
                                                    to={`/manager/reports/${report.id}`}
                                                    className="manager-view-report-button"
                                                >
                                                    View
                                                </Link>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>
                            </table>
                        </div>

                        {pagination.totalPages > 1 && (

                            <div className="manager-pagination">

                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                >
                                    ← Previous
                                </button>

                                <div className="manager-pagination-info">
                                    <span>Page</span>

                                    <strong>
                                        {pagination.page}
                                    </strong>

                                    <span>of</span>

                                    <strong>
                                        {pagination.totalPages}
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={
                                        page ===
                                        pagination.totalPages
                                    }
                                >
                                    Next →
                                </button>

                            </div>
                        )}

                    </>
                )}

            </section>
        </div>
    );
}

export default ManagerReports;