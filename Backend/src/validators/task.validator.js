const { z } = require('zod');

const createTaskSchema = z.object({
    taskName: z.string()
        .trim()
        .min(1, 'Task name is required')
        .max(255),

    priorityId: z.number()
        .int()
        .positive(),

    plannedPercentage: z.number()
        .min(0)
        .max(100),

    actualPercentage: z.number()
        .min(0)
        .max(100),

    statusId: z.number()
        .int()
        .positive(),

    plannedHours: z.number()
        .min(0),

    spentHours: z.number()
        .min(0),

    deliverable: z.string()
        .trim()
        .max(5000)
        .optional()
});
const updateTaskSchema = z.object({
    taskName: z.string()
        .trim()
        .min(1)
        .max(255)
        .optional(),

    priorityId: z.number()
        .int()
        .positive()
        .optional(),

    plannedPercentage: z.number()
        .min(0)
        .max(100)
        .optional(),

    actualPercentage: z.number()
        .min(0)
        .max(100)
        .optional(),

    statusId: z.number()
        .int()
        .positive()
        .optional(),

    plannedHours: z.number()
        .min(0)
        .optional(),

    spentHours: z.number()
        .min(0)
        .optional(),

    deliverable: z.string()
        .trim()
        .max(5000)
        .optional()
});

module.exports = {
    createTaskSchema,
    updateTaskSchema
};