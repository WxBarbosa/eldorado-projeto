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
        database: process.env.DB_NAME 
    };
};

const dbConfig = getDbConfig();
const dbConnection = mysql.createConnection(dbConfig);

// Handle connection errors and automatic reconnection
dbConnection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Lost connection to MySQL server. Reconnecting...');
        handleDisconnect();
    } else {
        throw err;
    }
});

function handleDisconnect() {
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error reconnecting to database:', err);
            setTimeout(handleDisconnect, 2000);
            return;
        }
        dbConnection.destroy();
        Object.assign(dbConnection, connection);
        console.log('Successfully reconnected to database');
    });

    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

module.exports = { dbConnection };