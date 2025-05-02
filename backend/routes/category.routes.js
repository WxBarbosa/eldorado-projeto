const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const categoryController = require('../controllers/category.controller');

// Validation middleware
const validateCategory = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 128 })
        .withMessage('Category name must be between 1 and 128 characters')
];

const validateId = [
    param('id')
        .isInt()
        .withMessage('Invalid category ID')
];

// Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', validateId, categoryController.getCategoryById);
router.post('/', validateCategory, categoryController.createCategory);
router.put('/:id', [...validateId, ...validateCategory], categoryController.updateCategory);
router.delete('/:id', validateId, categoryController.deleteCategory);

module.exports = router;