// const express = require('express');

// const userController = require('../controllers/user.controller');

// const authenticate = require('../middleware/auth.middleware');
// const requireRole = require('../middleware/role.middleware');
// const validate = require('../middleware/validate.middleware');

// const {
//      createUserSchema,
//     updateUserRoleSchema,
//     updateUserStatusSchema
// } = require('../validators/user.validator');

// const router = express.Router();

// // Admin only
// router.get(
//     '/',
//     authenticate,
//     requireRole('ADMIN'),
//     userController.getUsers
// );

// // Admin or Manager
// router.get(
//     '/:id',
//     authenticate,
//     requireRole('ADMIN'),
//     userController.getUserById
// );

// // Admin only
// router.patch(
//     '/:id/status',
//     authenticate,
//     requireRole('ADMIN'),
//      validate(updateUserStatusSchema),
//     userController.updateUserStatus
// );

// module.exports = router;

const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createUserSchema,
    updateUserRoleSchema,
    updateUserStatusSchema
} = require('../validators/user.validator');

const router = express.Router();

// Admin only
router.get(
    '/',
    authenticate,
    requireRole('ADMIN'),
    userController.getUsers
);
// Manager and Admin
router.get(
    '/team-members',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    userController.getTeamMembers
);
// Admin only
router.get(
    '/:id',
    authenticate,
    requireRole('ADMIN','MANAGER'),
    userController.getUserById
);

// Admin only
router.post(
    '/',
    authenticate,
    requireRole('ADMIN'),
    validate(createUserSchema),
    userController.createUser
);

// Admin only
router.patch(
    '/:id/role',
    authenticate,
    requireRole('ADMIN'),
    validate(updateUserRoleSchema),
    userController.updateUserRole
);

// Admin only
router.patch(
    '/:id/status',
    authenticate,
    requireRole('ADMIN'),
    validate(updateUserStatusSchema),
    userController.updateUserStatus
);

module.exports = router;