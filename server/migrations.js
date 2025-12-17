const migrations = [
    {
        id: 1,
        name: 'add_custom_image_columns',
        up: (db) => {
            const tables = ['Frameset', 'Wheel', 'Groupset', 'Saddle', 'Bar', 'Tyre', 'Seatpost'];
            // Add custom_image to Child tables (Color tables)
            tables.forEach(table => {
                const childTable = table + 'Color';
                try {
                    db.prepare(`ALTER TABLE "${childTable}" ADD COLUMN custom_image LONGTEXT`).run();
                    console.log(`Added custom_image to ${childTable}`);
                } catch (e) {
                    if (!e.message.includes('duplicate column')) console.error(e.message);
                }
            });
        }
    },
    {
        id: 2,
        name: 'add_groupset_parts_images',
        up: (db) => {
            const cols = [
                'imageBack', 'imageFront', 'imageBar',
                'imageBrake', 'imageBrakeCapilierFront',
                'imageBrakeCapilierRear', 'imageGearShift'
            ];

            cols.forEach(col => {
                try {
                    db.prepare(`ALTER TABLE "GroupsetColor" ADD COLUMN ${col} LONGTEXT`).run();
                    console.log(`Added ${col} to GroupsetColor`);
                } catch (e) {
                    if (!e.message.includes('duplicate column')) console.error(e.message);
                }
            });
        }
    },
    {
        id: 3,
        name: 'add_wheel_scale_column',
        up: (db) => {
            try {
                db.prepare(`ALTER TABLE "FramesetColor" ADD COLUMN wheel_scale REAL DEFAULT 1.0`).run();
                console.log(`Added wheel_scale to FramesetColor`);
            } catch (e) {
                if (!e.message.includes('duplicate column')) console.error(e.message);
            }
        }
    }
];

function runMigrations(db) {
    console.log('[MIGRATIONS] Checking...');

    // 1. Create migrations table if not exists
    db.prepare(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // 2. Run pending migrations
    for (const migration of migrations) {
        const row = db.prepare('SELECT id FROM _migrations WHERE id = ?').get(migration.id);
        if (!row) {
            console.log(`[MIGRATIONS] Running #${migration.id}: ${migration.name}`);
            try {
                db.transaction(() => {
                    migration.up(db);
                    db.prepare('INSERT INTO _migrations (id, name) VALUES (?, ?)').run(migration.id, migration.name);
                })();
                console.log(`[MIGRATIONS] Success #${migration.id}`);
            } catch (e) {
                console.error(`[MIGRATIONS] FAILED #${migration.id}:`, e);
                throw e; // Stop startup on migration failure
            }
        }
    }
    console.log('[MIGRATIONS] Up to date.');
}

module.exports = runMigrations;
