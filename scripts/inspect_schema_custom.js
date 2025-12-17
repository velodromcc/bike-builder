const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const tables = ['Groupset', 'GroupsetColor', 'FramesetColor'];

tables.forEach(table => {
    console.log(`\n--- ${table} ---`);
    const stmt = db.prepare(`PRAGMA table_info("${table}")`);
    const info = stmt.all();
    info.forEach(col => console.log(col.name, col.type));
});
