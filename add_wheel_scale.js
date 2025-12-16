const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'vps-2e3b96d8.vps.ovh.net',
    user: 'bikebuilder',
    password: 'm5h5Zp9jGpJH',
    database: 'bikebuilder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function run() {
    try {
        console.log('Adding wheel_scale to FramesetColor...');

        // Add column if not exists
        await pool.query('ALTER TABLE FramesetColor ADD COLUMN wheel_scale FLOAT NULL');

        console.log('Done.');
        process.exit(0);
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error(e);
        }
        process.exit(0);
    }
}

run();
