const prisma = require('../config/prisma');

const getProjects = async (req, res, next) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json({
            success: true,
            message: 'Projects retrieved successfully',
            data: projects
        });
    } catch (error) {
        next(error);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            message: 'Project retrieved successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};

const createProject = async (req, res, next) => {
    try {
        const {
            name,
            categoryId,
            description
        } = req.body;

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        const existingProject = await prisma.project.findUnique({
            where: {
                name
            }
        });

        if (existingProject) {
            const error = new Error('Project already exists');
            error.statusCode = 409;
            throw error;
        }

        const project = await prisma.project.create({
            data: {
                name,
                categoryId,
                description
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        const {
            name,
            categoryId,
            description,
            isActive
        } = req.body;

        if (categoryId !== undefined) {
            const category = await prisma.category.findUnique({
                where: {
                    id: categoryId
                }
            });

            if (!category) {
                const error = new Error('Category not found');
                error.statusCode = 404;
                throw error;
            }
        }

        const project = await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                name,
                categoryId,
                description,
                isActive
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        const project = await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                isActive: false
            }
        });

        res.json({
            success: true,
            message: 'Project deactivated successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};
const getMyProjects = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const projects = await prisma.project.findMany({
            where: {
                isActive: true,
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json({
            success: true,
            message: 'Assigned projects retrieved successfully',
            data: projects
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getMyProjects
};

