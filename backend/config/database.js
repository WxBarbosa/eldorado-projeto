const mysql = require('mysql2');
require('dotenv').config();

const getDbConfig = () => {
    if (process.env.NODE_ENV === 'test') {
        return {
            host: process.env.TEST_DB_HOST || 'mysql',
            user: process.env.TEST_DB_USER || 'root',
            password: process.env.TEST_DB_PASSWORD || 'example',
            database: process.env.TEST_DB_NAME || 'eldorado_test'
        };
    }
    
    return {
        host: process.env.DB_HOST || 'mysql',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'example',
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 60000,
    };
};

const dbConfig = getDbConfig();
const pool = mysql.createPool(dbConfig).promise();

// Export the promise-based pool directly
const dbConnection = pool;

// Test connection and handle reconnect
const testConnection = async () => {
    try {
        // Execute a simple query to test the connection
        await pool.query('SELECT 1');
        console.log('Database connection established');
    } catch (error) {
        console.error('Error connecting to database:', error);
        // Try to reconnect after 2 seconds
        setTimeout(testConnection, 2000);
    }
};

// Initial connection test
testConnection();

module.exports = { dbConnection };