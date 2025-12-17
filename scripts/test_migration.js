const Database = require('better-sqlite3');
const runMigrations = require('../server/migrations');

// 1. Test on Empty DB
console.log('--- Testing Empty DB ---');
const dbEmpty = new Database(':memory:');
try {
    runMigrations(dbEmpty);
    // Check if table exists
    const check = dbEmpty.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Groupset'").get();
    console.log('Groupset table exists:', !!check);
} catch (e) {
    console.error('Empty DB failed:', e);
}

// 2. Test on Existing DB (simulated with some pre-existing table)
console.log('\n--- Testing Existing DB (Idempotency) ---');
const dbExist = new Database(':memory:');
dbExist.prepare('CREATE TABLE Groupset (id INTEGER PRIMARY KEY)').run(); // Simulate existing table
try {
    runMigrations(dbExist);
    console.log('Migration ran without error on existing table.');
} catch (e) {
    console.error('Existing DB failed:', e);
}
