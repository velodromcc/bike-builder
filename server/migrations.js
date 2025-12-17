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
    },
    {
        id: 4,
        name: 'fix_company_logo_and_text',
        up: (db) => {
            console.log('Fixing Company 1 logo and text...');
            const seed = require('./seed_data');
            // Find the INSERT statement for Company 1 in seed_data
            const companySeed = seed.find(sql => sql.includes('INSERT OR IGNORE INTO "Company"') && sql.includes('VALUES (1,'));

            if (companySeed) {
                // Parse values roughly or just replace the record? 
                // Replacing is safer to ensure all fields are correct.
                // 1. Delete existing Company 1 (it might be the stub or broken one)
                // 2. Run the INSERT statement again.
                // NOTE: We cannot simply DELETE because of potential foreign keys, BUT Company 1 is the main one.
                // Safer approach: Extract values and UPDATE.

                // Let's try parsing the values from the seed string is fragile.
                // Better approach: Hardcode the update here with the known correct values from seed_data.js file content.
                // Looking at seed_data.js:
                // `INSERT OR IGNORE INTO "Company" ("id", "host", "name", "logo", "website", "color1", "color2", "color3", "email", "finalHtml", "introHtml", "locationsHref", "storiesHref", "bikebuilderHref", "shopHref", "contactHref", "loginHref", "toolsHref") VALUES (1, 'velodrom.dreambikebuilder.com', 'Velodrom Barcelona', '/resources/logo2.png', 'https://www.velodrom.cc', '000000', '555555', 'ffffff', 'info@inmovens.com,Info@velodrombarcelona.com', '<section> <h3>PRECIO ORIENTATIVO</h3> ... ', '<h1>Bike Builder</h1> ... ', 'https://global.velodrom.cc/', 'https://global.velodrom.cc/stories/', 'https://velodrom.dreambikebuilder.com/', 'https://www.velodrom.cc/', 'https://www.velodrom.cc/pages/contact', 'https://www.velodrom.cc/account/login', 'https://global.velodrom.cc/velodrom-travel/')`

                const logo = '/resources/logo2.png';
                const finalHtml = `<section> <h3>PRECIO ORIENTATIVO</h3>        <p>         Recuerda que el precio final no incluye descuentos. promociones, ni precios especiales de bicicleta completa que la marca puede ofrecer.       </p>       <p>	 Una vez que hayas creado el montaje de tus sueños, te ofrecemos conversar por teléfono, o mejor aún, vernos en nuestra tienda de Barcelona         para que revisemos si el modelo y componentes que has elegido son los indicados para el tipo de ciclismo que practicas.         </p>       <p>	 Recuerda que antes de encargar los distintos componentes, realizaremos un simulación en nuesro Bike Fitting Studio para poder seleccionar el tamaño correcto de potencia,manillar, tija de silín y por supuesto la talla correcta del cuadro que has elegido.                </p>   </section>  <section>       <h3>MÁS OPCIONES DE COMPONENTES</h3>        <p>        Recuerda que nuestro bike builder ofrece una selección de componentes, pero el cielo es el infinito. Disponemos de muchos otros componentes de distintas gamas económicas y calidades para que puedas crear una bicicleta espectacular.       </p>       <p>        Contáctanos y te ofreceremos un presupuesto totalmente personalizado.       </p>      </section>      <section>        <h3>ENTREGA DE LA BICICLETA</h3>       <p>La entrega de tu bicicleta en nuestra tienda ¡es algo más que simplemente entregartela! Nos eoncargaremos de que la bicicleta se te entregue totalmente a medida y perfectamente ajustada.Todos nuestros montajes a medida incluyen el servicio de simulación previo a la compra de la bicicleta y el bike fitting posterior a la compra               </p> `;
                const introHtml = `<h1>Bike Builder</h1>
            <p>Use this interactive configurator to design your dream bike; swap components, change colours, the choice is yours.</p>`;

                try {
                    db.prepare(`
                        UPDATE "Company" 
                        SET logo = ?, 
                            finalHtml = ?, 
                            introHtml = ?,
                            host = 'velodrom.dreambikebuilder.com',
                            name = 'Velodrom Barcelona',
                            website = 'https://www.velodrom.cc'
                        WHERE id = 1
                    `).run(logo, finalHtml, introHtml);
                    console.log('Successfully updated Company 1 logo and text.');
                } catch (e) {
                    console.error('Failed to fix Company 1:', e);
                }
            }
        }
    },
    {
        id: 5,
        name: 'add_company_summary_text',
        up: (db) => {
            console.log('Adding summaryHtml to Company...');
            try {
                // 1. Add Column
                db.prepare(`ALTER TABLE "Company" ADD COLUMN summaryHtml TEXT`).run();
                console.log('Added summaryHtml column.');

                // 2. Populate with default text (Corrected "Bespoke" -> "Velodrom")
                const summaryHtml = `
                    <p>
                        Thank you for creating your dream build with Velodrom. Whatever combination you've
                        chosen we'll ensure that it all works together and, of course, fits you perfectly.
                    </p>
                    <p>
                        Get in touch to discuss your requirements in more detail, and for impartial expert
                        advice on bike and component choice.
                    </p>
                `;

                db.prepare(`UPDATE "Company" SET summaryHtml = ? WHERE id = 1`).run(summaryHtml);
                console.log('Updated Company 1 with summary text.');

            } catch (e) {
                if (!e.message.includes('duplicate column')) {
                    console.error('Failed to add summaryHtml:', e);
                }
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
