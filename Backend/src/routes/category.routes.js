const express = require('express');

const categoryController = require('../controllers/category.controller');

const authenticate = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
    createCategorySchema,
    updateCategorySchema
} = require('../validators/category.validator');

const router = express.Router();

// Manager/Admin can view categories
router.get(
    '/',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    categoryController.getCategories
);

// Manager/Admin can view a category
router.get(
    '/:id',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    categoryController.getCategoryById
);

// Admin only
router.post(
    '/',
    authenticate,
    requireRole('ADMIN', 'MANAGER'),
    validate(createCategorySchema),
    categoryController.createCategory
);

// Admin only
router.patch(
    '/:id',
    authenticate,
    requireRole('ADMIN', 'MANAGER'),
    validate(updateCategorySchema),
    categoryController.updateCategory
);

// Admin only
router.delete(
    '/:id',
    authenticate,
    requireRole('ADMIN', 'MANAGER'),
    categoryController.deleteCategory
);

module.exports = router;

