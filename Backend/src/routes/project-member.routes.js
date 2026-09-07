const express = require('express');

const projectMemberController = require('../controllers/project-member.controller');

const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
    addProjectMemberSchema
} = require('../validators/project-member.validator');

const router = express.Router();

// Manager/Admin can view project members
router.get(
    '/:projectId/members',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    projectMemberController.getProjectMembers
);

// Admin only
router.post(
    '/:projectId/members',
    authenticate,
    requireRole('ADMIN'),
    validate(addProjectMemberSchema),
    projectMemberController.addProjectMember
);

// Admin only
router.delete(
    '/:projectId/members/:userId',
    authenticate,
    requireRole('ADMIN'),
    projectMemberController.removeProjectMember
);

module.exports = router;

