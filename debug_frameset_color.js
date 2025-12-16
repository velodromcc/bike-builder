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
        console.log('--- Columns in FramesetColor ---');
        const [cols] = await pool.query('SHOW COLUMNS FROM FramesetColor');
        console.log(cols.map(c => c.Field));

        console.log('\n--- Compare Celeste (10) vs Black (New ID?) ---');
        // Find the Black Carbon row. It might be ID 6 or a new one.
        const [rows] = await pool.query("SELECT * FROM FramesetColor WHERE colorName LIKE '%Black Carbon%' OR id = 10");
        rows.forEach(r => {
            console.log(`ID: ${r.id}, Name: ${r.colorName}, idCompany: ${r.id_company || 'N/A'}, idFrameset: ${r.idFrameset}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
