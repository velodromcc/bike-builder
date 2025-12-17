const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const ids = [5, 58];

ids.forEach(id => {
    console.log(`\n\n=== FRAMESET ID ${id} ===`);
    const frameset = db.prepare('SELECT * FROM Frameset WHERE id = ?').get(id);
    console.table(frameset);

    console.log(`--- COLORS for Frameset ${id} ---`);
    const colors = db.prepare('SELECT * FROM FramesetColor WHERE idFrameset = ?').all(id);
    console.table(colors);
});
