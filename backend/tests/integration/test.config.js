require('dotenv').config();
const mysql = require('mysql2/promise');

const testConfig = {
    host: process.env.TEST_DB_HOST || 'mysql',
    user: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || 'example',
    database: process.env.TEST_DB_NAME || 'eldorado_test'
};

module.exports = {
    testConfig
};