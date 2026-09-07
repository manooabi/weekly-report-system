const express = require('express');
// const { register,login } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const authController = require('../controllers/auth.controller');
const {
    registerSchema,
    loginSchema
} = require('../validators/auth.validator');

const router = express.Router();

router.post(
    '/register',
    validate(registerSchema),
    authController.register
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login
);


//temporary route to test role-based access control
router.get('/me', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'Authenticated user',
        user: req.user
    });
});

router.get(
    '/manager-test',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Manager/Admin access granted',
            user: req.user
        });
    }
);
module.exports = router;