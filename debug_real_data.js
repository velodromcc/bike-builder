const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'vps-2e3b96d8.vps.ovh.net',
    user: 'bikebuilder',
    password: 'm5h5Zp9jGpJH',
    database: 'bikebuilder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function debug() {
    try {
        console.log("--- DEBUGGING FRAMESET ID ---");

        // 1. Find the Frameset
        const [framesets] = await pool.query("SELECT id, name FROM Frameset WHERE name LIKE '%RACEMAX 2%'");
        console.log("Framesets found:");
        console.table(framesets);

        if (framesets.length === 0) return;

        const framesetId = framesets[0].id;
        console.log(`Checking colors for Frameset ID: ${framesetId}`);

        // 2. Check Colors for this Frameset
        const query = `
            SELECT tc.id, tc.colorName, tc.idFrameset, tc.price as BasePrice, tcc.price as OverridePrice, 
                   COALESCE(NULLIF(tcc.price, 0), tc.price) as CalculatedPrice
            FROM FramesetColor tc
            LEFT JOIN FramesetColorCompany tcc ON tc.id = tcc.idFramesetColor AND tcc.idCompany = 1
            WHERE tc.idFrameset = ? AND (tc.archived = 0 OR tc.archived IS NULL)
        `;
        const [results] = await pool.query(query, [framesetId]);
        console.log("\nColors for this Frameset:");
        console.table(results);

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        pool.end();
    }
}

debug();
