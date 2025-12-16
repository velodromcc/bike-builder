const mysql = require('mysql2/promise');
require('dotenv').config();

const parentTables = ['Bar', 'Tyre', 'Seatpost'];
const colorTables = ['BarColor', 'TyreColor', 'SeatpostColor'];

(async () => {
    const conn = await mysql.createConnection({
        host: 'vps-2e3b96d8.vps.ovh.net',
        user: 'bikebuilder',
        password: 'm5h5Zp9jGpJH',
        database: 'bikebuilder'
    });

    // Add archived to Parent Tables
    for (const table of parentTables) {
        try {
            console.log(`Checking ${table}...`);
            const [cols] = await conn.execute(`DESCRIBE ${table}`);
            if (!cols.some(c => c.Field === 'archived')) {
                console.log(`Adding archived to ${table}...`);
                await conn.execute(`ALTER TABLE ${table} ADD COLUMN archived TINYINT DEFAULT 0`);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    // Add archived AND custom_image to Color Tables
    for (const table of colorTables) {
        try {
            console.log(`Checking ${table}...`);
            const [cols] = await conn.execute(`DESCRIBE ${table}`);

            if (!cols.some(c => c.Field === 'archived')) {
                console.log(`Adding archived to ${table}...`);
                await conn.execute(`ALTER TABLE ${table} ADD COLUMN archived TINYINT DEFAULT 0`);
            }

            if (!cols.some(c => c.Field === 'custom_image')) {
                console.log(`Adding custom_image to ${table}...`);
                await conn.execute(`ALTER TABLE ${table} ADD COLUMN custom_image LONGTEXT`);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    console.log('Done.');
    await conn.end();
})();
