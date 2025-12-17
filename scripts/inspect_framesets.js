const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const framesets = db.prepare('SELECT id, name, saddle_x, saddle_y FROM Frameset').all();
console.log('--- FRAMESETS ---');
console.table(framesets);
