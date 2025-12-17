const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const saddles = db.prepare('SELECT * FROM Saddle').all();
console.log('--- SADDLES ---');
console.table(saddles);

const colors = db.prepare('SELECT * FROM SaddleColor').all();
console.log('--- SADDLE COLORS ---');
console.table(colors);
