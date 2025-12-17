const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const table = 'Frameset';
const id = 38;
const childTable = `${table}Color`;
const foreignKey = `id${table}`;

console.log(`Querying ${childTable} for ${foreignKey} = ${id}...`);

const query = `SELECT * FROM "${childTable}" WHERE ${foreignKey} = ? AND (archived = 0 OR archived IS NULL)`;
console.log('Query:', query);

try {
    const rows = db.prepare(query).all(id);
    console.log(`Found ${rows.length} rows.`);
    console.table(rows);
} catch (e) {
    console.error('Error:', e);
}
