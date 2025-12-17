const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Attempting to connect to DB...');
    try {
        const connection = await mysql.createConnection({
            host: 'vps-2e3b96d8.vps.ovh.net',
            user: 'bikebuilder',
            password: 'm5h5Zp9jGpJH',
            database: 'bikebuilder',
            connectTimeout: 10000
        });
        console.log('Successfully connected!');
        await connection.end();
    } catch (err) {
        console.error('Connection failed:', err.message);
        console.error(err);
    }
}

testConnection();
