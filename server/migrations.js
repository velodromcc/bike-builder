const seedData = require('./seed_data');

const migrations = [
    {
        id: 999,
        name: 'seed_initial_data',
        up: (db) => {
            console.log('Seeding data...');
            db.transaction(() => {
                seedData.forEach(sql => db.prepare(sql).run());
            })();
        }
    },
    {
        id: 0,
        name: 'create_initial_schema',
        up: (db) => {
            const schema = [
                `CREATE TABLE IF NOT EXISTS "Bar" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "groupset_bar_x" REAL, "groupset_bar_y" REAL, "origin_x" REAL, "origin_y" REAL, "priority" INTEGER, "thumbnail" TEXT, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "BarColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idBar" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "image" TEXT, "price" REAL, "priority" INTEGER, "archived" INTEGER, "custom_image" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "BarColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idBarColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Company" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "host" TEXT, "name" TEXT, "logo" TEXT, "website" TEXT, "color1" TEXT, "color2" TEXT, "color3" TEXT, "email" TEXT, "finalHtml" TEXT, "introHtml" TEXT, "locationsHref" TEXT, "storiesHref" TEXT, "bikebuilderHref" TEXT, "shopHref" TEXT, "contactHref" TEXT, "loginHref" TEXT, "toolsHref" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Frameset" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "bar_position_x" REAL, "bar_position_y" REAL, "wheel_right_x" REAL, "wheel_right_y" REAL, "wheel_left_x" REAL, "wheel_left_y" REAL, "wheel_scale" REAL, "tyre_scale" REAL, "seatpost_x" REAL, "seatpost_y" REAL, "seatpost_scale" REAL, "groupset_middle_x" REAL, "groupset_middle_y" REAL, "saddle_x" REAL, "saddle_y" REAL, "groupset_bar_x" REAL, "groupset_bar_y" REAL, "bar_enabled" INTEGER, "wheel_enabled" INTEGER, "seatpost_enabled" INTEGER, "groupset_enabled" INTEGER, "saddle_enabled" INTEGER, "origin_x" REAL, "origin_y" REAL, "inclination_front" REAL, "inclination_rear" REAL, "priority" INTEGER, "thumbnail" TEXT, "groupset_capilier_middle_x" REAL, "groupset_capilier_middle_y" REAL, "groupset_capilier_middle_angle" REAL, "groupset_capilier_rear_x" REAL, "groupset_capilier_rear_y" REAL, "groupset_capilier_rear_angle" REAL, "groupset_capilier_front_x" REAL, "groupset_capilier_front_y" REAL, "groupset_capilier_front_angle" REAL, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "FramesetColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idFrameset" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "image" TEXT, "price" REAL, "priority" INTEGER, "bar_position_x" REAL, "bar_position_y" REAL, "wheel_right_x" REAL, "wheel_right_y" REAL, "wheel_left_x" REAL, "wheel_left_y" REAL, "seatpost_x" REAL, "seatpost_y" REAL, "seatpost_scale" REAL, "groupset_middle_x" REAL, "groupset_middle_y" REAL, "saddle_x" REAL, "saddle_y" REAL, "groupset_bar_x" REAL, "groupset_bar_y" REAL, "origin_x" REAL, "origin_y" REAL, "inclination_front" REAL, "inclination_rear" REAL, "groupset_capilier_middle_x" REAL, "groupset_capilier_middle_y" REAL, "groupset_capilier_middle_angle" REAL, "groupset_capilier_rear_x" REAL, "groupset_capilier_rear_y" REAL, "groupset_capilier_rear_angle" REAL, "groupset_capilier_front_x" REAL, "groupset_capilier_front_y" REAL, "groupset_capilier_front_angle" REAL, "archived" INTEGER, "custom_image" TEXT, "wheel_scale" REAL)`,
                `CREATE TABLE IF NOT EXISTS "FramesetColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idFramesetColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Groupset" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "origin_x" REAL, "origin_y" REAL, "brake_front_x" REAL, "brake_front_y" REAL, "chain_rear_top" REAL, "chain_rear_bottom" REAL, "chain_rear_diameter" REAL, "chain_front_top" REAL, "chain_front_bottom" REAL, "chain_front_diameter" REAL, "thumbnail" TEXT, "priority" INTEGER, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "GroupsetColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idGroupset" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "imageBack" TEXT, "imageFront" TEXT, "imageBar" TEXT, "imageBrake" TEXT, "imageBrakeCapilierFront" TEXT, "imageBrakeCapilierRear" TEXT, "imageGearShift" TEXT, "price" REAL, "priority" INTEGER, "archived" INTEGER, "custom_image" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "GroupsetColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idGroupsetColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Saddle" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "origin_x" REAL, "origin_y" REAL, "priority" INTEGER, "thumbnail" TEXT, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "SaddleColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idSaddle" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "image" TEXT, "price" REAL, "priority" INTEGER, "archived" INTEGER, "custom_image" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "SaddleColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idSaddleColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Seatpost" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "saddle_x" REAL, "saddle_y" REAL, "origin_x" REAL, "origin_y" REAL, "priority" INTEGER, "thumbnail" TEXT, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "SeatpostColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idSeatpost" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "image" TEXT, "price" REAL, "priority" INTEGER, "archived" INTEGER, "custom_image" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "SeatpostColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idSeatpostColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "SpecialBuild" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "query" TEXT, "price" REAL, "idCompany" INTEGER, "thumbnail" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Tyre" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "origin_x" REAL, "origin_y" REAL, "priority" INTEGER, "thumbnail" TEXT, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "TyreColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idTyre" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "image" TEXT, "price" REAL, "priority" INTEGER, "archived" INTEGER, "custom_image" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "TyreColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idTyreColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "Wheel" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "description" TEXT, "origin_x" REAL, "origin_y" REAL, "priority" INTEGER, "thumbnail" TEXT, "archived" INTEGER)`,
                `CREATE TABLE IF NOT EXISTS "WheelColor" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idWheel" INTEGER, "color" TEXT, "color2" TEXT, "colorName" TEXT, "image" TEXT, "price" REAL, "priority" INTEGER, "archived" INTEGER, "custom_image" TEXT)`,
                `CREATE TABLE IF NOT EXISTS "WheelColorCompany" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "idWheelColor" INTEGER, "idCompany" INTEGER, "price" REAL, "url" TEXT)`
            ];
            schema.forEach(sql => db.prepare(sql).run());

            // Default Company
            try {
                db.prepare(`INSERT INTO Company (id, name) VALUES (1, 'Velodrom')`).run();
            } catch (e) {
                // Ignore if exists
            }
        }
    },
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
    migrations.sort((a, b) => a.id - b.id);

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
