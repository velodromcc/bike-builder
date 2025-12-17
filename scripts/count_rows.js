const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

tables.forEach(t => {
    const count = db.prepare(`SELECT count(*) as c FROM "${t.name}"`).get();
    console.log(`${t.name}: ${count.c}`);
});
