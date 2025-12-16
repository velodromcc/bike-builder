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
        console.log('--- Fetching FramesetColor ID 6 and 10 ---');
        const [rows] = await pool.query('SELECT * FROM FramesetColor WHERE id IN (6, 10)');

        rows.forEach(row => {
            console.log(`\nID: ${row.id} (${row.colorName})`);
            // Print only geometry related columns (containing 'x', 'y' or 'scale')
            Object.keys(row).forEach(key => {
                if (key.includes('_x') || key.includes('_y') || key.includes('scale')) {
                    console.log(`  ${key}: ${row[key]}`);
                }
            });
        });

        console.log('\n--- Fetching Parent Frameset for Context ---');
        // Assuming they share parent. Get parent ID from one of them.
        const parentId = rows[0].idFrameset;
        const [parents] = await pool.query('SELECT * FROM Frameset WHERE id = ?', [parentId]);
        const parent = parents[0];
        console.log(`Parent ID: ${parent.id}`);
        Object.keys(parent).forEach(key => {
            if (key.includes('_x') || key.includes('_y') || key.includes('scale')) {
                console.log(`  ${key}: ${parent[key]}`);
            }
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
