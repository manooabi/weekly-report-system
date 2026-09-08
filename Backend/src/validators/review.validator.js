const { z } = require('zod');

const requestCorrectionSchema = z.object({
    comment: z.string()
        .trim()
        .min(1, 'Correction comment is required')
        .max(5000, 'Correction comment must not exceed 5000 characters')
});

module.exports = {
    requestCorrectionSchema
};