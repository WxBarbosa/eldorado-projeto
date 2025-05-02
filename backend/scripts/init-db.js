const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const config = {
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'example',
    database: process.env.DB_NAME || 'eldorado',
    multipleStatements: true // Allow multiple SQL statements
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryConnect(retries = 5, delay = 5000) {
    while (retries > 0) {
        try {
            const connection = mysql.createConnection(config);
            return connection;
        } catch (err) {
            console.log(`Failed to connect to database. Retries left: ${retries-1}`);
            await wait(delay);
            retries--;
        }
    }
    throw new Error('Failed to connect to database after multiple retries');
}

async function init() {
    try {
        const connection = await tryConnect();
        
        // Read migration SQL
        const migrationSQL = fs.readFileSync(
            path.join(__dirname, '..', 'db-migration.sql'),
            'utf8'
        );

        // Execute migrations
        connection.query(migrationSQL, (err, results) => {
            if (err) {
                console.error('Error executing migrations:', err);
                process.exit(1);
            }
            console.log('Database migrations completed successfully');
            connection.end();
            process.exit(0);
        });
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
}

init();