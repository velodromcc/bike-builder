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
        const companyId = 1;
        console.log(`Checking for FramesetColor rows missing link to Company ${companyId}...`);

        // Find orphans
        const query = `
            SELECT fc.id, fc.colorName, fc.price
            FROM FramesetColor fc
            LEFT JOIN FramesetColorCompany fcc ON fc.id = fcc.idFramesetColor AND fcc.idCompany = ?
            WHERE fcc.id IS NULL
        `;

        const [orphans] = await pool.query(query, [companyId]);
        console.log(`Found ${orphans.length} orphans.`);

        for (const orphan of orphans) {
            console.log(`Fixing: ${orphan.id} - ${orphan.colorName}`);
            const price = orphan.price || 0;
            await pool.query(
                'INSERT INTO FramesetColorCompany (idFramesetColor, idCompany, price, url) VALUES (?, ?, ?, ?)',
                [orphan.id, companyId, price, ''] // url empty default
            );
        }

        console.log('Done.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
