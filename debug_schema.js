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
        const [rows] = await pool.query('DESCRIBE Frameset');
        const columns = rows.map(r => r.Field);
        console.log('Frameset Columns:', columns.filter(c => c.includes('wheel') || c.includes('x') || c.includes('y')));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
