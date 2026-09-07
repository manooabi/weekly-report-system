const { z } = require('zod');

const createReportHoursSchema = z.object({
    taskTypeId: z.number()
        .int()
        .positive(),

    hours: z.number()
        .min(0)
        .max(999)
});
const updateHourSchema = z.object({
    taskTypeId: z.number().int().positive().optional(),
    hours: z.number().min(0).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {
        message: 'At least one field is required'
    }
);

module.exports = {
    createReportHoursSchema,
    updateHourSchema
};