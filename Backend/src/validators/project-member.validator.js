const { z } = require('zod');

const addProjectMemberSchema = z.object({
    userId: z
        .number()
        .int()
        .positive('User ID must be a positive number')
});

module.exports = {
    addProjectMemberSchema
};

