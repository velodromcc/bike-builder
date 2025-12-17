const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const fs = require('fs');

const MYSQL_CONFIG = {
    host: 'vps-2e3b96d8.vps.ovh.net',
    user: 'bikebuilder',
    password: 'm5h5Zp9jGpJH',
    database: 'bikebuilder',
    connectTimeout: 20000,
    enableKeepAlive: true
};

const SQLITE_FILE = 'server/database.sqlite';

// Map MySQL types to SQLite
function mapType(mysqlType) {
    mysqlType = mysqlType.toLowerCase();
    if (mysqlType.includes('int')) return 'INTEGER';
    if (mysqlType.includes('char') || mysqlType.includes('text') || mysqlType.includes('enum')) return 'TEXT';
    if (mysqlType.includes('float') || mysqlType.includes('double') || mysqlType.includes('decimal')) return 'REAL';
    if (mysqlType.includes('date') || mysqlType.includes('time')) return 'TEXT';
    return 'TEXT';
}

async function migrate() {
    console.log('Starting migration...');

    // 1. Connect to MySQL
    const mysqlConn = await mysql.createConnection(MYSQL_CONFIG);
    console.log('Connected to MySQL');

    // 2. Initialize SQLite
    if (fs.existsSync(SQLITE_FILE)) fs.unlinkSync(SQLITE_FILE);
    const sqliteDB = new Database(SQLITE_FILE);
    console.log(`Created SQLite DB at ${SQLITE_FILE}`);

    try {
        // 3. Get all tables
        const [tables] = await mysqlConn.query('SHOW TABLES');
        const tableNames = tables.map(row => Object.values(row)[0]);

        for (const table of tableNames) {
            console.log(`Migrating table: ${table}...`);

            // Get Structure
            const [columns] = await mysqlConn.query(`DESCRIBE ${table}`);
            const schema = columns.map(col => {
                let def = `"${col.Field}" ${mapType(col.Type)}`;
                if (col.Key === 'PRI') def += ' PRIMARY KEY';
                if (col.Extra === 'auto_increment') def += ' AUTOINCREMENT'; // SQLite syntax
                // SQLite PRIMARY KEY AUTOINCREMENT must be INTEGER
                if (def.includes('PRIMARY KEY AUTOINCREMENT') && !def.includes('INTEGER')) {
                    def = def.replace(/TEXT|REAL/, 'INTEGER');
                }
                return def;
            }).join(', ');

            // Create Table
            sqliteDB.exec(`CREATE TABLE IF NOT EXISTS "${table}" (${schema})`);

            // Get Data
            const [rows] = await mysqlConn.query(`SELECT * FROM ${table}`);
            if (rows.length > 0) {
                const keys = Object.keys(rows[0]).map(k => `"${k}"`).join(', ');
                const placeholders = Object.keys(rows[0]).map(() => '?').join(', ');

                const insert = sqliteDB.prepare(`INSERT INTO "${table}" (${keys}) VALUES (${placeholders})`);

                const insertMany = sqliteDB.transaction((data) => {
                    for (const row of data) insert.run(Object.values(row));
                });

                insertMany(rows);
                console.log(`  -> Inserted ${rows.length} rows.`);
            }
        }

        console.log('Migration Complete!');

    } catch (err) {
        console.error('Migration Failed:', err);
    } finally {
        await mysqlConn.end();
        sqliteDB.close();
    }
}

migrate();
