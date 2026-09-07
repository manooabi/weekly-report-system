const { z } = require('zod');

const updateUserStatusSchema = z.object({
    isActive: z.boolean()
});

module.exports = {
    updateUserStatusSchema
};