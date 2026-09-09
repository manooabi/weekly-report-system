import { useEffect, useState } from 'react';
import api from '../../services/api';

const initialUserForm = {
    name: '',
    email: '',
    password: '',
    roleId: '3'
};

function UserManagement() {
    const [users, setUsers] = useState([]);

    const [userForm, setUserForm] = useState(initialUserForm);

    const [editingRoleUserId, setEditingRoleUserId] =
        useState(null);

    const [editingRoleId, setEditingRoleId] =
        useState('');

    const [loading, setLoading] = useState(true);
    const [savingUser, setSavingUser] = useState(false);
    const [savingRole, setSavingRole] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/users');

            setUsers(response.data.data || []);
        } catch (err) {
            console.error(
                'Failed to load users:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to load users.'
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

    const handleUserChange = (event) => {
        const { name, value } = event.target;

        setUserForm({
            ...userForm,
            [name]: value
        });
    };

    const handleUserSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!userForm.name.trim()) {
            showError('Name is required.');
            return;
        }

        if (!userForm.email.trim()) {
            showError('Email is required.');
            return;
        }

        if (!userForm.password) {
            showError('Password is required.');
            return;
        }

        if (userForm.password.length < 8) {
            showError(
                'Password must be at least 8 characters long.'
            );
            return;
        }

        if (!userForm.roleId) {
            showError('Please select a role.');
            return;
        }

        try {
            setSavingUser(true);

            const response = await api.post('/users', {
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                password: userForm.password,
                roleId: Number(userForm.roleId)
            });

            const createdUser = response.data.data;

            setUsers((currentUsers) =>
                [...currentUsers, createdUser].sort(
                    (a, b) => a.id - b.id
                )
            );

            setUserForm(initialUserForm);

            showSuccess(
                'User created successfully.'
            );
        } catch (err) {
            console.error(
                'Failed to create user:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to create user.'
            );
        } finally {
            setSavingUser(false);
        }
    };

    const handleEditRole = (user) => {
        setEditingRoleUserId(user.id);
        setEditingRoleId(String(user.roleId));

        setError('');
        setSuccess('');
    };

    const handleCancelRole = () => {
        setEditingRoleUserId(null);
        setEditingRoleId('');
    };

    const handleSaveRole = async (user) => {
        if (!editingRoleId) {
            showError('Please select a role.');
            return;
        }

        try {
            setSavingRole(true);
            setError('');
            setSuccess('');

            const response = await api.patch(
                `/users/${user.id}/role`,
                {
                    roleId: Number(editingRoleId)
                }
            );

            const updatedUser = response.data.data;

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item.id === user.id
                        ? {
                              ...item,
                              ...updatedUser
                          }
                        : item
                )
            );

            setEditingRoleUserId(null);
            setEditingRoleId('');

            showSuccess(
                'User role updated successfully.'
            );
        } catch (err) {
            console.error(
                'Failed to update user role:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to update user role.'
            );
        } finally {
            setSavingRole(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.isActive
            ? 'deactivate'
            : 'activate';

        const confirmed = window.confirm(
            `Are you sure you want to ${action} "${user.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            setSuccess('');

            const response = await api.patch(
                `/users/${user.id}/status`,
                {
                    isActive: !user.isActive
                }
            );

            const updatedUser = response.data.data;

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item.id === user.id
                        ? {
                              ...item,
                              ...updatedUser
                          }
                        : item
                )
            );

            showSuccess(
                `User ${action}d successfully.`
            );
        } catch (err) {
            console.error(
                'Failed to update user status:',
                err
            );

            showError(
                err.response?.data?.message ||
                'Unable to update user status.'
            );
        }
    };

    const getRoleName = (roleCode) => {
        if (roleCode === 'ADMIN') {
            return 'Admin';
        }

        if (roleCode === 'MANAGER') {
            return 'Manager';
        }

        return 'Team Member';
    };

    if (loading) {
        return (
            <div className="manager-dashboard">
                <div className="manager-dashboard-loading">
                    <div className="manager-loading-spinner"></div>

                    <p>
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="manager-dashboard">
            <div className="manager-dashboard-header">
                <div>
                    <h2>
                        User Management
                    </h2>

                    <p>
                        Manage users, roles and account
                        status.
                    </p>
                </div>
            </div>

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

            <section className="manager-dashboard-card">
                <div className="manager-card-header">
                    <div>
                        <h3>
                            Add User
                        </h3>

                        <p>
                            Create a new account for a
                            team member or manager.
                        </p>
                    </div>
                </div>

                <div className="manager-management-form">
                    <div className="manager-form-header">
                        <div>
                            <h4>
                                New User
                            </h4>

                            <p>
                                Enter the user's account
                                details below.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleUserSubmit}>
                        <div className="manager-form-grid">
                            <div className="manager-form-group">
                                <label htmlFor="user-name">
                                    Name
                                </label>

                                <input
                                    id="user-name"
                                    type="text"
                                    name="name"
                                    value={userForm.name}
                                    onChange={
                                        handleUserChange
                                    }
                                    maxLength="100"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="manager-form-group">
                                <label htmlFor="user-email">
                                    Email
                                </label>

                                <input
                                    id="user-email"
                                    type="email"
                                    name="email"
                                    value={userForm.email}
                                    onChange={
                                        handleUserChange
                                    }
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="manager-form-group">
                                <label htmlFor="user-password">
                                    Password
                                </label>

                                <input
                                    id="user-password"
                                    type="password"
                                    name="password"
                                    value={
                                        userForm.password
                                    }
                                    onChange={
                                        handleUserChange
                                    }
                                    minLength="8"
                                    maxLength="100"
                                    placeholder="Enter initial password"
                                    required
                                />
                            </div>

                            <div className="manager-form-group">
                                <label htmlFor="user-role">
                                    Role
                                </label>

                                <select
                                    id="user-role"
                                    name="roleId"
                                    value={
                                        userForm.roleId
                                    }
                                    onChange={
                                        handleUserChange
                                    }
                                    required
                                >
                                    <option value="3">
                                        Team Member
                                    </option>

                                    <option value="2">
                                        Manager
                                    </option>

                                    <option value="1">
                                        Admin
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="manager-form-actions">
                            <button
                                type="submit"
                                className="manager-primary-button"
                                disabled={savingUser}
                            >
                                {savingUser
                                    ? 'Creating...'
                                    : 'Add User'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="manager-dashboard-card">
                <div className="manager-card-header">
                    <div>
                        <h3>
                            Users
                        </h3>

                        <p>
                            View and manage registered
                            system users.
                        </p>
                    </div>

                    <span className="manager-card-count">
                        {users.length}
                    </span>
                </div>

                <div className="manager-table-wrapper">
                    <table className="manager-table">
                        <thead>
                            <tr>
                                <th>
                                    User
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Created
                                </th>

                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <strong>
                                                {user.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {editingRoleUserId ===
                                            user.id ? (
                                                <select
                                                    value={
                                                        editingRoleId
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setEditingRoleId(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className="manager-inline-select"
                                                    disabled={
                                                        savingRole
                                                    }
                                                >
                                                    <option value="3">
                                                        Team Member
                                                    </option>

                                                    <option value="2">
                                                        Manager
                                                    </option>

                                                    <option value="1">
                                                        Admin
                                                    </option>
                                                </select>
                                            ) : (
                                                <span>
                                                    {getRoleName(
                                                        user
                                                            .role
                                                            ?.code
                                                    )}
                                                </span>
                                            )}
                                        </td>

                                        <td>
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
                                        </td>

                                        <td>
                                            {user.createdAt
                                                ? new Date(
                                                      user.createdAt
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </td>

                                        <td>
                                            <div className="manager-table-actions">
                                                {editingRoleUserId ===
                                                user.id ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="manager-action-button"
                                                            onClick={() =>
                                                                handleSaveRole(
                                                                    user
                                                                )
                                                            }
                                                            disabled={
                                                                savingRole
                                                            }
                                                        >
                                                            {savingRole
                                                                ? 'Saving...'
                                                                : 'Save'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="manager-action-button"
                                                            onClick={
                                                                handleCancelRole
                                                            }
                                                            disabled={
                                                                savingRole
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="manager-action-button"
                                                        onClick={() =>
                                                            handleEditRole(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Edit Role
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    className={
                                                        user.isActive
                                                            ? 'manager-action-button danger'
                                                            : 'manager-action-button'
                                                    }
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            user
                                                        )
                                                    }
                                                    disabled={
                                                        editingRoleUserId ===
                                                        user.id
                                                    }
                                                >
                                                    {user.isActive
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="manager-table-empty"
                                    >
                                        No users found.
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

export default UserManagement;