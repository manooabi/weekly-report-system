const prisma = require('../config/prisma');

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

module.exports = {
    getUsers,
    getUserById,
    updateUserStatus
};

