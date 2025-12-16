const mysql = require('mysql2/promise');
require('dotenv').config();

const tables = [
    'FramesetColor',
    'WheelColor',
    'GroupsetColor',
    'SaddleColor'
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
            const [cols] = await conn.execute(`DESCRIBE ${table}`);
            const hasCol = cols.some(c => c.Field === 'custom_image');

            if (!hasCol) {
                console.log(`Adding custom_image column to ${table}...`);
                // LONGTEXT to store large Base64 strings
                await conn.execute(`ALTER TABLE ${table} ADD COLUMN custom_image LONGTEXT`);
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
