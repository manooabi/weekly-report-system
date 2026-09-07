const { z } = require('zod');

const createProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Project name must be at least 2 characters long')
        .max(150, 'Project name must not exceed 150 characters'),

    categoryId: z
        .number()
        .int()
        .positive('Category ID must be a positive number'),

    description: z
        .string()
        .trim()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
});

const updateProjectSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Project name must be at least 2 characters long')
        .max(150, 'Project name must not exceed 150 characters')
        .optional(),

    categoryId: z
        .number()
        .int()
        .positive('Category ID must be a positive number')
        .optional(),

    description: z
        .string()
        .trim()
        .max(500, 'Description must not exceed 500 characters')
        .optional(),

    isActive: z
        .boolean()
        .optional()
});

module.exports = {
    createProjectSchema,
    updateProjectSchema
};

