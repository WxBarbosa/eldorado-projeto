const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const deviceController = require('../controllers/device.controller');

// Validation middleware
const validateDevice = [
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Valid category ID is required'),
    body('color')
        .trim()
        .isLength({ min: 1, max: 16 })
        .matches(/^[a-zA-Z]+$/)
        .withMessage('Color must be 1-16 letters only'),
    body('part_number')
        .isInt({ min: 1 })
        .withMessage('Part number must be a positive integer')
];

const validateId = [
    param('id')
        .isInt()
        .withMessage('Invalid device ID')
];

// Routes
router.get('/', deviceController.getAllDevices);
router.get('/:id', validateId, deviceController.getDeviceById);
router.post('/', validateDevice, deviceController.createDevice);
router.put('/:id', [...validateId, ...validateDevice], deviceController.updateDevice);
router.delete('/:id', validateId, deviceController.deleteDevice);

module.exports = router;