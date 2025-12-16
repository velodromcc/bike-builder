require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bikebuilder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function debugColors() {
    try {
        console.log("Fetching Colors for company 1...");
        // Use the EXACT query from server.js
        const table = 'Frameset';
        const companyId = 1;

        const colorQuery = `
            SELECT tc.id, tc.colorName, tc.price as basePrice, tcc.price as companyPrice, COALESCE(tcc.price, tc.price) as finalPrice, tcc.idCompany
            FROM ${table}Color tc
            LEFT JOIN ${table}ColorCompany tcc ON tc.id = tcc.id${table}Color AND tcc.idCompany = ?
            WHERE (tc.archived = 0 OR tc.archived IS NULL)
        `;

        const [colors] = await pool.query(colorQuery, [companyId]);
        console.log("Colors Found:", colors.length);
        console.table(colors);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

debugColors();
