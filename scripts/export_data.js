const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const db = new Database(path.join(__dirname, '../server/database.sqlite'));
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_migrations'").all();

let sqlStatements = [];

tables.forEach(t => {
    const rows = db.prepare(`SELECT * FROM "${t.name}"`).all();
    if (rows.length === 0) return;

    const cols = Object.keys(rows[0]).map(c => `"${c}"`).join(', ');

    rows.forEach(row => {
        const values = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`; // Escape single quotes
            return v;
        }).join(', ');
        sqlStatements.push(`INSERT OR IGNORE INTO "${t.name}" (${cols}) VALUES (${values})`);
    });
});

const fileContent = `module.exports = [\n    \`${sqlStatements.join('`,\n    `')}\`\n];\n`;

fs.writeFileSync(path.join(__dirname, '../server/seed_data.js'), fileContent);
console.log('Seed data exported to server/seed_data.js');
