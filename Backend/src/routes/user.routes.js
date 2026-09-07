const express = require('express');

const userController = require('../controllers/user.controller');

const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
    updateUserStatusSchema
} = require('../validators/user.validator');

const router = express.Router();

// Admin only
router.get(
    '/',
    authenticate,
    requireRole('ADMIN', 'MANAGER'),
    userController.getUsers
);

// Admin or Manager
router.get(
    '/:id',
    authenticate,
    requireRole('ADMIN', 'MANAGER'),
    userController.getUserById
);

// Admin only
router.patch(
    '/:id/status',
    authenticate,
    requireRole('ADMIN','MANAGER'),
     validate(updateUserStatusSchema),
    userController.updateUserStatus
);

module.exports = router;

