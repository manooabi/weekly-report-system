import { useEffect, useState } from 'react';
import api from '../../services/api';

const initialProjectForm = {
    name: '',
    categoryId: '',
    description: ''
};

const initialCategoryForm = {
    name: '',
    description: ''
};

function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);

    const [projectForm, setProjectForm] = useState(initialProjectForm);
    const [categoryForm, setCategoryForm] = useState(initialCategoryForm);

    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [savingProject, setSavingProject] = useState(false);
    const [savingCategory, setSavingCategory] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                projectsResponse,
                categoriesResponse
            ] = await Promise.all([
                api.get('/projects'),
                api.get('/categories')
            ]);

            setProjects(projectsResponse.data.data || []);
            setCategories(categoriesResponse.data.data || []);
        } catch (err) {
            console.error(
                'Failed to load project management data:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to load projects and categories.'
            );
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (message) => {
        setSuccess(message);
        setError('');

        setTimeout(() => {
            setSuccess('');
        }, 3000);
    };

    const showError = (message) => {
        setError(message);
        setSuccess('');
    };

    // --------------------------------------------------
    // Project Handlers
    // --------------------------------------------------

    const handleProjectChange = (event) => {
        const { name, value } = event.target;

        setProjectForm({
            ...projectForm,
            [name]: value
        });
    };

    const handleProjectSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!projectForm.name.trim()) {
            showError('Project name is required.');
            return;
        }

        if (!projectForm.categoryId) {
            showError('Please select a category.');
            return;
        }

        try {
            setSavingProject(true);

            const payload = {
                name: projectForm.name.trim(),
                categoryId: Number(projectForm.categoryId),
                ...(projectForm.description.trim()
                    ? {
                          description:
                              projectForm.description.trim()
                      }
                    : {})
            };

            if (editingProjectId) {
                const response = await api.patch(
                    `/projects/${editingProjectId}`,
                    payload
                );

                const updatedProject = response.data.data;

                setProjects((currentProjects) =>
                    currentProjects.map((project) =>
                        project.id === editingProjectId
                            ? updatedProject
                            : project
                    )
                );

                showSuccess(
                    'Project updated successfully.'
                );
            } else {
                const response = await api.post(
                    '/projects',
                    payload
                );

                const createdProject = response.data.data;

                setProjects((currentProjects) =>
                    [...currentProjects, createdProject].sort(
                        (a, b) =>
                            a.name.localeCompare(b.name)
                    )
                );

                showSuccess(
                    'Project created successfully.'
                );
            }

            resetProjectForm();
        } catch (err) {
            console.error(
                'Failed to save project:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to save project.'
            );
        } finally {
            setSavingProject(false);
        }
    };

    const handleEditProject = (project) => {
        setEditingProjectId(project.id);

        setProjectForm({
            name: project.name || '',
            categoryId: project.categoryId
                ? String(project.categoryId)
                : '',
            description: project.description || ''
        });

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDeleteProject = async (project) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${project.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            await api.delete(
                `/projects/${project.id}`
            );

            setProjects((currentProjects) =>
                currentProjects.map((item) =>
                    item.id === project.id
                        ? {
                              ...item,
                              isActive: false
                          }
                        : item
                )
            );

            showSuccess(
                'Project deactivated successfully.'
            );

            if (editingProjectId === project.id) {
                resetProjectForm();
            }
        } catch (err) {
            console.error(
                'Failed to deactivate project:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to deactivate project.'
            );
        }
    };

    const handleReactivateProject = async (project) => {
        try {
            setError('');
            setSuccess('');

            const response = await api.patch(
                `/projects/${project.id}`,
                {
                    isActive: true
                }
            );

            const updatedProject = response.data.data;

            setProjects((currentProjects) =>
                currentProjects.map((item) =>
                    item.id === project.id
                        ? updatedProject
                        : item
                )
            );

            showSuccess(
                'Project activated successfully.'
            );
        } catch (err) {
            console.error(
                'Failed to activate project:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to activate project.'
            );
        }
    };

    const resetProjectForm = () => {
        setProjectForm(initialProjectForm);
        setEditingProjectId(null);
    };

    // --------------------------------------------------
    // Category Handlers
    // --------------------------------------------------

    const handleCategoryChange = (event) => {
        const { name, value } = event.target;

        setCategoryForm({
            ...categoryForm,
            [name]: value
        });
    };

    const handleCategorySubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!categoryForm.name.trim()) {
            showError('Category name is required.');
            return;
        }

        try {
            setSavingCategory(true);

            const payload = {
                name: categoryForm.name.trim(),
                ...(categoryForm.description.trim()
                    ? {
                          description:
                              categoryForm.description.trim()
                      }
                    : {})
            };

            if (editingCategoryId) {
                const response = await api.patch(
                    `/categories/${editingCategoryId}`,
                    payload
                );

                const updatedCategory =
                    response.data.data;

                setCategories((currentCategories) =>
                    currentCategories.map((category) =>
                        category.id ===
                        editingCategoryId
                            ? updatedCategory
                            : category
                    )
                );

                showSuccess(
                    'Category updated successfully.'
                );
            } else {
                const response = await api.post(
                    '/categories',
                    payload
                );

                const createdCategory =
                    response.data.data;

                setCategories((currentCategories) =>
                    [
                        ...currentCategories,
                        createdCategory
                    ].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
                );

                showSuccess(
                    'Category created successfully.'
                );
            }

            resetCategoryForm();
        } catch (err) {
            console.error(
                'Failed to save category:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to save category.'
            );
        } finally {
            setSavingCategory(false);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategoryId(category.id);

        setCategoryForm({
            name: category.name || '',
            description: category.description || ''
        });

        setError('');
        setSuccess('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDeleteCategory = async (category) => {
        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            await api.delete(
                `/categories/${category.id}`
            );

            setCategories((currentCategories) =>
                currentCategories.map((item) =>
                    item.id === category.id
                        ? {
                              ...item,
                              isActive: false
                          }
                        : item
                )
            );

            showSuccess(
                'Category deactivated successfully.'
            );

            if (editingCategoryId === category.id) {
                resetCategoryForm();
            }
        } catch (err) {
            console.error(
                'Failed to deactivate category:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to deactivate category.'
            );
        }
    };

    const handleReactivateCategory = async (category) => {
        try {
            setError('');
            setSuccess('');

            const response = await api.patch(
                `/categories/${category.id}`,
                {
                    isActive: true
                }
            );

            const updatedCategory =
                response.data.data;

            setCategories((currentCategories) =>
                currentCategories.map((item) =>
                    item.id === category.id
                        ? updatedCategory
                        : item
                )
            );

            showSuccess(
                'Category activated successfully.'
            );
        } catch (err) {
            console.error(
                'Failed to activate category:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to activate category.'
            );
        }
    };

    const resetCategoryForm = () => {
        setCategoryForm(initialCategoryForm);
        setEditingCategoryId(null);
    };

    // --------------------------------------------------
    // Loading State
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-loading">
                    <div className="manager-loading-spinner"></div>

                    <p>
                        Loading projects and categories...
                    </p>
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
                        Project & Category Management
                    </h2>

                    <p>
                        Manage projects and categories
                        used by the reporting system.
                    </p>
                </div>
            </div>

            {/* Messages */}

            {error && (
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
            )}

            {success && (
                <div className="manager-success-message">
                    <span>✓</span>

                    <p>{success}</p>
                </div>
            )}

            {/* ---------------------------------------- */}
            {/* Project Section */}
            {/* ---------------------------------------- */}

            <section className="manager-dashboard-card">

                <div className="manager-card-header">
                    <div>
                        <h3>Projects</h3>

                        <p>
                            Create and manage projects
                            available to team members.
                        </p>
                    </div>

                    <span className="manager-card-count">
                        {projects.length}
                    </span>
                </div>

                {/* Project Form */}

                <div className="manager-management-form">

                    <div className="manager-form-header">
                        <div>
                            <h4>
                                {editingProjectId
                                    ? 'Edit Project'
                                    : 'Add Project'}
                            </h4>

                            <p>
                                {editingProjectId
                                    ? 'Update the project details below.'
                                    : 'Create a new project for your team.'}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleProjectSubmit}
                    >
                        <div className="manager-form-grid">

                            <div className="manager-form-group">
                                <label htmlFor="project-name">
                                    Project Name
                                </label>

                                <input
                                    id="project-name"
                                    type="text"
                                    name="name"
                                    value={projectForm.name}
                                    onChange={
                                        handleProjectChange
                                    }
                                    maxLength="150"
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>

                            <div className="manager-form-group">
                                <label htmlFor="project-category">
                                    Category
                                </label>

                                <select
                                    id="project-category"
                                    name="categoryId"
                                    value={
                                        projectForm.categoryId
                                    }
                                    onChange={
                                        handleProjectChange
                                    }
                                    required
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories
                                        .filter(
                                            (category) =>
                                                category.isActive
                                        )
                                        .map(
                                            (category) => (
                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>
                                            )
                                        )}
                                </select>
                            </div>

                            <div className="manager-form-group manager-form-group-full">
                                <label htmlFor="project-description">
                                    Description
                                </label>

                                <textarea
                                    id="project-description"
                                    name="description"
                                    value={
                                        projectForm.description
                                    }
                                    onChange={
                                        handleProjectChange
                                    }
                                    maxLength="500"
                                    rows="3"
                                    placeholder="Enter project description (optional)"
                                />
                            </div>

                        </div>

                        <div className="manager-form-actions">

                            <button
                                type="submit"
                                className="manager-primary-button"
                                disabled={savingProject}
                            >
                                {savingProject
                                    ? 'Saving...'
                                    : editingProjectId
                                      ? 'Update Project'
                                      : 'Add Project'}
                            </button>

                            {editingProjectId && (
                                <button
                                    type="button"
                                    className="manager-secondary-button"
                                    onClick={
                                        resetProjectForm
                                    }
                                    disabled={
                                        savingProject
                                    }
                                >
                                    Cancel
                                </button>
                            )}

                        </div>
                    </form>
                </div>

                {/* Project Table */}

                <div className="manager-table-wrapper">

                    <table className="manager-table">

                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.length > 0 ? (
                                projects.map(
                                    (project) => (
                                        <tr
                                            key={
                                                project.id
                                            }
                                        >
                                            <td>
                                                <strong>
                                                    {
                                                        project.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    project
                                                        .category
                                                        ?.name ||
                                                    '-'
                                                }
                                            </td>

                                            <td>
                                                {
                                                    project.description ||
                                                    '-'
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        project.isActive
                                                            ? 'manager-status-badge approved'
                                                            : 'manager-status-badge draft'
                                                    }
                                                >
                                                    {project.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="manager-table-actions">

                                                    <button
                                                        type="button"
                                                        className="manager-action-button"
                                                        onClick={() =>
                                                            handleEditProject(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {project.isActive ? (
                                                        <button
                                                            type="button"
                                                            className="manager-action-button danger"
                                                            onClick={() =>
                                                                handleDeleteProject(
                                                                    project
                                                                )
                                                            }
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="manager-action-button"
                                                            onClick={() =>
                                                                handleReactivateProject(
                                                                    project
                                                                )
                                                            }
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="manager-table-empty"
                                    >
                                        No projects found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

            </section>

            {/* ---------------------------------------- */}
            {/* Category Section */}
            {/* ---------------------------------------- */}

            <section className="manager-dashboard-card">

                <div className="manager-card-header">
                    <div>
                        <h3>Categories</h3>

                        <p>
                            Manage categories used to
                            organize projects.
                        </p>
                    </div>

                    <span className="manager-card-count">
                        {categories.length}
                    </span>
                </div>

                {/* Category Form */}

                <div className="manager-management-form">

                    <div className="manager-form-header">
                        <div>
                            <h4>
                                {editingCategoryId
                                    ? 'Edit Category'
                                    : 'Add Category'}
                            </h4>

                            <p>
                                {editingCategoryId
                                    ? 'Update the category details below.'
                                    : 'Create a new category.'}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleCategorySubmit}
                    >
                        <div className="manager-form-grid">

                            <div className="manager-form-group">
                                <label htmlFor="category-name">
                                    Category Name
                                </label>

                                <input
                                    id="category-name"
                                    type="text"
                                    name="name"
                                    value={categoryForm.name}
                                    onChange={
                                        handleCategoryChange
                                    }
                                    maxLength="100"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>

                            <div className="manager-form-group manager-form-group-full">
                                <label htmlFor="category-description">
                                    Description
                                </label>

                                <textarea
                                    id="category-description"
                                    name="description"
                                    value={
                                        categoryForm.description
                                    }
                                    onChange={
                                        handleCategoryChange
                                    }
                                    maxLength="500"
                                    rows="3"
                                    placeholder="Enter category description (optional)"
                                />
                            </div>

                        </div>

                        <div className="manager-form-actions">

                            <button
                                type="submit"
                                className="manager-primary-button"
                                disabled={savingCategory}
                            >
                                {savingCategory
                                    ? 'Saving...'
                                    : editingCategoryId
                                      ? 'Update Category'
                                      : 'Add Category'}
                            </button>

                            {editingCategoryId && (
                                <button
                                    type="button"
                                    className="manager-secondary-button"
                                    onClick={
                                        resetCategoryForm
                                    }
                                    disabled={
                                        savingCategory
                                    }
                                >
                                    Cancel
                                </button>
                            )}

                        </div>
                    </form>

                </div>

                {/* Category Table */}

                <div className="manager-table-wrapper">

                    <table className="manager-table">

                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length > 0 ? (
                                categories.map(
                                    (category) => (
                                        <tr
                                            key={
                                                category.id
                                            }
                                        >
                                            <td>
                                                <strong>
                                                    {
                                                        category.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    category.description ||
                                                    '-'
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        category.isActive
                                                            ? 'manager-status-badge approved'
                                                            : 'manager-status-badge draft'
                                                    }
                                                >
                                                    {category.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="manager-table-actions">

                                                    <button
                                                        type="button"
                                                        className="manager-action-button"
                                                        onClick={() =>
                                                            handleEditCategory(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {category.isActive ? (
                                                        <button
                                                            type="button"
                                                            className="manager-action-button danger"
                                                            onClick={() =>
                                                                handleDeleteCategory(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="manager-action-button"
                                                            onClick={() =>
                                                                handleReactivateCategory(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="manager-table-empty"
                                    >
                                        No categories found.
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

export default ProjectManagement;

