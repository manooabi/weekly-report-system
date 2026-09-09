const prisma = require('../config/prisma');
const { hashPassword } = require('../utils/password');

const getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                isActive: true,
                createdAt: true,
                role: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            },
            orderBy: {
                id: 'asc'
            }
        });

        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                role: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            }
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            roleId
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            const error = new Error(
                'Email is already registered'
            );

            error.statusCode = 409;
            throw error;
        }

        const role = await prisma.role.findUnique({
            where: {
                id: roleId
            }
        });

        if (!role) {
            const error = new Error(
                'Role not found'
            );

            error.statusCode = 404;
            throw error;
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                roleId
            },
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                isActive: true,
                createdAt: true,
                role: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const { roleId } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            const error = new Error(
                'User not found'
            );

            error.statusCode = 404;
            throw error;
        }

        const role = await prisma.role.findUnique({
            where: {
                id: roleId
            }
        });

        if (!role) {
            const error = new Error(
                'Role not found'
            );

            error.statusCode = 404;
            throw error;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                roleId
            },
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                isActive: true,
                role: {
                    select: {
                        code: true,
                        name: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const { isActive } = req.body;

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isActive
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true
            }
        });

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};
const getTeamMembers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                isActive: true,
                role: {
                    code: 'TEAM_MEMBER'
                }
            },
            select: {
                id: true,
                name: true,
                email: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json({
            success: true,
            message: 'Team members retrieved successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserRole,
    updateUserStatus,
    getTeamMembers
};