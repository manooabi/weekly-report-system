const { z } = require('zod');

const createReportSchema = z.object({
    projectId: z.number().int().positive(),
    weekStart: z.string().date(),
    weekEnd: z.string().date()
});
const createReportVersionSchema = z.object({
    nextWeekPlan: z.string().trim().min(1).max(5000),
    notes: z.string().trim().max(5000).optional(),
    links: z.string().trim().max(5000).optional()
});
module.exports = {
    createReportSchema,
    createReportVersionSchema
};