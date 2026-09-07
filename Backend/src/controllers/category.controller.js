const prisma = require('../config/prisma');

const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        res.json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

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

        res.json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const existingCategory = await prisma.category.findUnique({
            where: {
                name
            }
        });

        if (existingCategory) {
            const error = new Error('Category already exists');
            error.statusCode = 409;
            throw error;
        }

        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);
        const { name, description, isActive } = req.body;

        const category = await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                name,
                description,
                isActive
            }
        });

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        const category = await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                isActive: false
            }
        });

        res.json({
            success: true,
            message: 'Category deactivated successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

