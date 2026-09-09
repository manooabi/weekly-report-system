const express = require('express');

const projectController = require('../controllers/project.controller');

const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createProjectSchema,
    updateProjectSchema
} = require('../validators/project.validator');

const router = express.Router();

// Manager/Admin can view projects
router.get(
    '/',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    projectController.getProjects
);
router.get(
    '/my-projects',
    authenticate,
    requireRole('TEAM_MEMBER'),
    projectController.getMyProjects
);
// Manager/Admin can view a project
router.get(
    '/:id',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    projectController.getProjectById
);

// Admin only
router.post(
    '/',
    authenticate,
    requireRole('ADMIN','MANAGER'),
    validate(createProjectSchema),
    projectController.createProject
);

// Admin only
router.patch(
    '/:id',
    authenticate,
    requireRole('ADMIN','MANAGER'),
    validate(updateProjectSchema),
    projectController.updateProject
);

// Admin only
router.delete(
    '/:id',
    authenticate,
    requireRole('ADMIN','MANAGER'),
    projectController.deleteProject
);

module.exports = router;

