const { dbConnection } = require('../config/database');

class DeviceRepository {
    async findAll() {
        const [results] = await dbConnection.query(
            'SELECT d.*, c.name as category_name FROM devices d LEFT JOIN categories c ON d.category_id = c.id'
        );
        return results;
    }

    async findById(id) {
        const [results] = await dbConnection.query(
            'SELECT d.*, c.name as category_name FROM devices d LEFT JOIN categories c ON d.category_id = c.id WHERE d.id = ?',
            [id]
        );
        return results[0];
    }

    async create(deviceData) {
        const [results] = await dbConnection.query('INSERT INTO devices SET ?', [deviceData]);
        if (!results || !results.insertId) {
            throw new Error('Failed to create device');
        }
        return { id: results.insertId, ...deviceData };
    }

    async update(id, deviceData) {
        const [results] = await dbConnection.query('UPDATE devices SET ? WHERE id = ?', [deviceData, id]);
        if (!results || results.affectedRows === 0) {
            return null;
        }
        return { id, ...deviceData };
    }

    async delete(id) {
        const [results] = await dbConnection.query('DELETE FROM devices WHERE id = ?', [id]);
        return results.affectedRows > 0;
    }
}

module.exports = new DeviceRepository();