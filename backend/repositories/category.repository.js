const { dbConnection } = require('../config/database');

class CategoryRepository {
    async findAll() {
        const [results] = await dbConnection.query('SELECT * FROM categories');
        return results;
    }

    async findById(id) {
        const [results] = await dbConnection.query('SELECT * FROM categories WHERE id = ?', [id]);
        return results[0];
    }

    async create(categoryData) {
        const [results] = await dbConnection.query('INSERT INTO categories SET ?', [categoryData]);
        if (!results || !results.insertId) {
            throw new Error('Failed to create category');
        }
        return { id: results.insertId, ...categoryData };
    }

    async update(id, categoryData) {
        const [results] = await dbConnection.query('UPDATE categories SET ? WHERE id = ?', [categoryData, id]);
        if (!results || results.affectedRows === 0) {
            return null;
        }
        return { id, ...categoryData };
    }

    async delete(id) {
        const [results] = await dbConnection.query('DELETE FROM categories WHERE id = ?', [id]);
        return results.affectedRows > 0;
    }
}

module.exports = new CategoryRepository();