const mysql = require('mysql2/promise');

async function inspect() {
    const connection = await mysql.createConnection({
        host: 'vps-2e3b96d8.vps.ovh.net',
        user: 'bikebuilder',
        password: 'm5h5Zp9jGpJH',
        database: 'bikebuilder'
    });

    console.log('Connected!');

    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables:', tables.map(t => Object.values(t)[0]));

    // Inspect columns for potential "Wheel" candidates
    const candidates = ['Frameset', 'Groupset', 'Saddle', 'Tyre', 'Wheel'];

    for (const table of tables.map(t => Object.values(t)[0])) {
        if (candidates.some(c => table.includes(c))) {
            const [columns] = await connection.execute(`DESCRIBE ${table}`);
            console.log(`\nColumns for ${table}:`, columns.map(c => c.Field));
        }
    }

    await connection.end();
}

inspect().catch(console.error);
