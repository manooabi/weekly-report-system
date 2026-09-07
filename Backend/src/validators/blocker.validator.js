const { z } = require('zod');

const createBlockerSchema = z.object({
    blocker: z.string()
        .trim()
        .min(1, 'Blocker is required')
        .max(5000),

    isKeyBlocker: z.boolean().default(false)
});
const updateBlockerSchema = z.object({
    blocker: z.string()
        .trim()
        .min(1, 'Blocker is required')
        .max(5000, 'Blocker must not exceed 5000 characters')
        .optional(),

    isKeyBlocker: z.boolean().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {
        message: 'At least one field is required'
    }
);
module.exports = {
    createBlockerSchema,
    updateBlockerSchema
};