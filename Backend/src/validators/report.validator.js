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
const managerReportQuerySchema = z.object({
    userId: z.coerce.number().int().positive().optional(),
    projectId: z.coerce.number().int().positive().optional(),
    statusId: z.coerce.number().int().positive().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
});
module.exports = {
    createReportSchema,
    createReportVersionSchema,
    managerReportQuerySchema

};