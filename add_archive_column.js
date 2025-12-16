const mysql = require('mysql2/promise');
require('dotenv').config();

const tables = [
    'Frameset', 'FramesetColor',
    'Wheel', 'WheelColor',
    'Groupset', 'GroupsetColor',
    'Saddle', 'SaddleColor'
];

(async () => {
    const conn = await mysql.createConnection({
        host: 'vps-2e3b96d8.vps.ovh.net',
        user: 'bikebuilder',
        password: 'm5h5Zp9jGpJH',
        database: 'bikebuilder'
    });

    for (const table of tables) {
        try {
            console.log(`Checking ${table}...`);
            // Check if column exists to avoid error
            const [cols] = await conn.execute(`DESCRIBE ${table}`);
            const hasCol = cols.some(c => c.Field === 'archived');

            if (!hasCol) {
                console.log(`Adding archived column to ${table}...`);
                await conn.execute(`ALTER TABLE ${table} ADD COLUMN archived TINYINT DEFAULT 0`);
                console.log('Done.');
            } else {
                console.log(`Column already exists in ${table}.`);
            }
        } catch (e) {
            console.error(`Error processing ${table}:`, e.message);
        }
    }

    await conn.end();
})();
