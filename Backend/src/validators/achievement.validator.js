const { z } = require('zod');

const createAchievementSchema = z.object({
    achievement: z.string()
        .trim()
        .min(1, 'Achievement is required')
         .max(5000, 'Achievement must not exceed 5000 characters'),

    isKeyAchievement: z.boolean().default(false)
});
const updateAchievementSchema = z.object({
    achievement: z.string()
        .trim()
        .min(1, 'Achievement is required')
        .max(5000, 'Achievement must not exceed 5000 characters')
        .optional(),

    isKeyAchievement: z.boolean().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {
        message: 'At least one field is required'
    }
);

module.exports = {
    createAchievementSchema,
     updateAchievementSchema
};