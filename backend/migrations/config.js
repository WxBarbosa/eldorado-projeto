const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'example',
    database: process.env.DB_NAME || 'eldorado',
    multipleStatements: true
};

async function getConnection() {
    return await mysql.createConnection(config);
}

module.exports = {
    getConnection,
    config
};