const { z } = require('zod');

const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must not exceed 100 characters'),

    email: z
        .string()
        .trim()
        .email('Please provide a valid email address'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password must not exceed 100 characters'),

    roleId: z
        .number()
        .int()
        .positive('Role ID must be a positive number')
});

const updateUserRoleSchema = z.object({
    roleId: z
        .number()
        .int()
        .positive('Role ID must be a positive number')
});

const updateUserStatusSchema = z.object({
    isActive: z.boolean()
});

module.exports = {
    createUserSchema,
    updateUserRoleSchema,
    updateUserStatusSchema
};