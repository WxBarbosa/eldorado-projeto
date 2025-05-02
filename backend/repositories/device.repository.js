const { dbConnection } = require('../config/database');

class DeviceRepository {
    async findAll() {
        return new Promise((resolve, reject) => {
            dbConnection.query(
                'SELECT d.*, c.name as category_name FROM devices d LEFT JOIN categories c ON d.category_id = c.id',
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            dbConnection.query(
                'SELECT d.*, c.name as category_name FROM devices d LEFT JOIN categories c ON d.category_id = c.id WHERE d.id = ?',
                [id],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results[0]);
                }
            );
        });
    }

    async create(deviceData) {
        return new Promise((resolve, reject) => {
            dbConnection.query('INSERT INTO devices SET ?', deviceData, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (!results || !results.insertId) {
                    return reject(new Error('Failed to create device'));
                }
                resolve({ id: results.insertId, ...deviceData });
            });
        });
    }

    async update(id, deviceData) {
        return new Promise((resolve, reject) => {
            dbConnection.query('UPDATE devices SET ? WHERE id = ?', [deviceData, id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (!results || results.affectedRows === 0) {
                    return resolve(null);
                }
                resolve({ id, ...deviceData });
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            dbConnection.query('DELETE FROM devices WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows > 0);
            });
        });
    }
}

module.exports = new DeviceRepository();