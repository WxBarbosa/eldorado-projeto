const express = require('express');
const router = express.Router();
const db = require('../app');
const { body, param, validationResult } = require('express-validator');

// Middleware for error handling
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get all categories
router.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Create a new category
router.post('/categories',
    body('name').isString().isLength({ min: 1, max: 128 }).withMessage('Invalid category name.'),
    handleValidationErrors,
    (req, res) => {
        const { name } = req.body;
        db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ id: results.insertId, name });
        });
    }
);

// Delete a category
router.delete('/categories/:id',
    param('id').isInt().withMessage('Invalid category ID.'),
    handleValidationErrors,
    (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM categories WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.affectedRows === 0) return res.status(404).send('Category not found.');
            res.status(204).send();
        });
    }
);

// Create a new device
router.post('/devices',
    body('category_id').isInt().withMessage('Invalid category ID.'),
    body('color').isAlpha().isLength({ max: 16 }).withMessage('Invalid color.'),
    body('part_number').isInt({ min: 1 }).withMessage('Invalid part number.'),
    handleValidationErrors,
    (req, res) => {
        const { category_id, color, part_number } = req.body;
        db.query('INSERT INTO devices (category_id, color, part_number) VALUES (?, ?, ?)', [category_id, color, part_number], (err, results) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ id: results.insertId, category_id, color, part_number });
        });
    }
);

// Get all devices
router.get('/devices', (req, res) => {
    db.query('SELECT * FROM devices', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Delete a device
router.delete('/devices/:id',
    param('id').isInt().withMessage('Invalid device ID.'),
    handleValidationErrors,
    (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM devices WHERE id = ?', [id], (err, results) => {
            if (err) return res.status(500).send(err);
            if (results.affectedRows === 0) return res.status(404).send('Device not found.');
            res.status(204).send();
        });
    }
);

module.exports = router;
