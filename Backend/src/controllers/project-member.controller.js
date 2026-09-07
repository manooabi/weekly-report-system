const prisma = require('../config/prisma');

const getProjectMembers = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId);

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });

        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error;
        }

        const members = await prisma.projectMember.findMany({
            where: {
                projectId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isActive: true,
                        role: {
                            select: {
                                code: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                assignedAt: 'asc'
            }
        });

        res.json({
            success: true,
            message: 'Project members retrieved successfully',
            data: members
        });
    } catch (error) {
        next(error);
    }
};

const addProjectMember = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId);
        const { userId } = req.body;

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });

        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if (!user.isActive) {
            const error = new Error('Cannot assign an inactive user');
            error.statusCode = 400;
            throw error;
        }

        const existingMembership = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        if (existingMembership) {
            const error = new Error('User is already assigned to this project');
            error.statusCode = 409;
            throw error;
        }

        const membership = await prisma.projectMember.create({
            data: {
                projectId,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'User assigned to project successfully',
            data: membership
        });
    } catch (error) {
        next(error);
    }
};

const removeProjectMember = async (req, res, next) => {
    try {
        const projectId = Number(req.params.projectId);
        const userId = Number(req.params.userId);

        const membership = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        if (!membership) {
            const error = new Error('Project member assignment not found');
            error.statusCode = 404;
            throw error;
        }

        await prisma.projectMember.delete({
            where: {
                projectId_userId: {
                    projectId,
                    userId
                }
            }
        });

        res.json({
            success: true,
            message: 'User removed from project successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjectMembers,
    addProjectMember,
    removeProjectMember
};

