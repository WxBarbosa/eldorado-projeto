const { dbConnection } = require('../config/database');

class CategoryRepository {
    async findAll() {
        return new Promise((resolve, reject) => {
            dbConnection.query('SELECT * FROM categories', (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            dbConnection.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }

    async create(categoryData) {
        return new Promise((resolve, reject) => {
            dbConnection.query('INSERT INTO categories SET ?', categoryData, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (!results || !results.insertId) {
                    return reject(new Error('Failed to create category'));
                }
                resolve({ id: results.insertId, ...categoryData });
            });
        });
    }

    async update(id, categoryData) {
        return new Promise((resolve, reject) => {
            dbConnection.query('UPDATE categories SET ? WHERE id = ?', [categoryData, id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (!results || results.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ id, ...categoryData });
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            dbConnection.query('DELETE FROM categories WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows > 0);
            });
        });
    }
}

module.exports = new CategoryRepository();