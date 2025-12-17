const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.get('/api/ping', (req, res) => res.send('pong'));

// Serve static files from the Vue app build output (ONLY IN PRODUCTION)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
}

// SQLite Database
const db = new Database(path.join(__dirname, 'database.sqlite'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Allowed tables for Admin Config
// Allowed tables for Admin Config
const ALLOWED_TABLES = [
    'Frameset', 'Wheel', 'Groupset', 'Saddle', 'Bar', 'Tyre', 'Seatpost',
    'FramesetColor', 'WheelColor', 'GroupsetColor', 'SaddleColor', 'BarColor', 'TyreColor', 'SeatpostColor'
];

// Helper to validate table name
const validateTable = (tableName) => {
    // Map plural to singular if needed, or just check exact match.
    // User asked for "framesets", "wheels" etc, but tables are singular 'Frameset', 'Wheel'.
    // Let's handle simple mapping or expect singular from frontend. 
    // Usually Config will send what we populate in dropdown.
    if (ALLOWED_TABLES.includes(tableName)) return tableName;
    // Handle plural inputs just in case
    const singular = tableName.slice(0, -1); // simple s removal
    if (ALLOWED_TABLES.includes(singular)) return singular;
    return null;
};

// --- API ROUTES ---

// GET Table Data
app.get('/api/config/:table', (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    try {
        let rows;
        // Filter by Company 1 for Master Tables
        // Assumes pattern: Table -> TableColor -> TableColorCompany
        if (['Frameset', 'Wheel', 'Groupset', 'Saddle'].includes(table)) {
            // ADMIN CONFIG: Show ALL items, ignore company link
            const query = `
                SELECT t.* 
                FROM "${table}" t
                WHERE (t.archived = 0 OR t.archived IS NULL)
                ORDER BY t.priority DESC
            `;
            rows = db.prepare(query).all();
        } else {
            // For standard tables
            const query = `SELECT * FROM "${table}" WHERE archived = 0 OR archived IS NULL`;
            rows = db.prepare(query).all();
        }

        res.json(rows);
    } catch (err) {
        console.error(err);
        // Fallback or retry logic if needed
        try {
            const rows = db.prepare(`SELECT * FROM "${table}"`).all();
            res.json(rows);
        } catch (e2) {
            res.status(500).json({ error: err.message });
        }
    }
});

// UPDATE Row
app.put('/api/config/:table/:id', (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    const id = req.params.id;
    const data = req.body;

    delete data.id;
    delete data.archived;

    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No data to update' });

    try {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];

        db.prepare(`UPDATE "${table}" SET ${setClause} WHERE id = ?`).run(values);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// CREATE Row (Optional, for "Add" functionality)
app.post('/api/config/:table', (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    const data = req.body;
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No data to create' });

    try {
        const keys = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        const info = db.prepare(`INSERT INTO "${table}" (${keys}) VALUES (${placeholders})`).run(values);
        const newId = info.lastInsertRowid;

        // AUTO-LINK COMPANY for *Color tables
        if (table.endsWith('Color')) {
            const linkTable = `${table}Company`;
            const fkCol = `id${table}`;
            const companyId = 1;
            const price = data.price || 0;

            db.prepare(
                `INSERT INTO "${linkTable}" (${fkCol}, idCompany, price) VALUES (?, ?, ?)`
            ).run(newId, companyId, price);

            console.log(`Auto-linked ${table} ${newId} to Company ${companyId}`);
        }

        res.json({ success: true, id: newId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE Row (Soft Delete)
app.delete('/api/config/:table/:id', (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    try {
        db.prepare(`UPDATE "${table}" SET archived = 1 WHERE id = ?`).run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET Children (Parent -> ParentColor)
app.get('/api/config/:table/:id/children', (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    const childTable = `${table}Color`;
    const foreignKey = `id${table}`;

    try {
        const rows = db.prepare(`SELECT * FROM "${childTable}" WHERE ${foreignKey} = ? AND (archived = 0 OR archived IS NULL)`).all(req.params.id);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- CONFIGURATION ENDPOINT (Replicates PHP Logic with custom_image support) ---

const fetchEntityWithColors = (table, companyId) => {
    // 1. Fetch Items (filtered by existence of company link? Or all items?)
    // PHP seems to show items that have at least one color for the company.
    // Query: Select items distinct joined with color/company
    const query = `
        SELECT DISTINCT t.* 
        FROM "${table}" t
        JOIN "${table}Color" tc ON t.id = tc.id${table}
        WHERE (t.archived = 0 OR t.archived IS NULL)
        ORDER BY t.priority DESC
    `;
    const items = db.prepare(query).all();

    // 2. Fetch Colors for these items
    // Efficient way: Fetch all colors for this company and map them in JS
    const colorQuery = `
        SELECT tc.*, COALESCE(NULLIF(tcc.price, 0), tc.price) as price, tcc.idCompany
        FROM "${table}Color" tc
        LEFT JOIN "${table}ColorCompany" tcc ON tc.id = tcc.id${table}Color AND tcc.idCompany = ?
        WHERE (tc.archived = 0 OR tc.archived IS NULL)
    `;
    const colors = db.prepare(colorQuery).all(companyId);
    console.log(`[DEBUG] Fetched ${items.length} ${table}s and ${colors.length} Colors`);

    // 3. Nest colors into items
    return items.map(item => {
        // Find colors for this item
        const itemColors = colors.filter(c => c[`id${table}`] === item.id);

        // Structure: item.colors = [ { color: { ...fields } } ]
        // Note: Field mapping might be needed if DB fields differ from API expectations (camelCase vs snake_case)
        // Check API response: "barX" vs DB "bar_position_x"?
        // DB describe showed "bar_position_x". API json showed "barX".
        // WE NEED A MAPPER if they differ.
        // For now, let's assume snake_case in DB is converted to camelCase by PHP?
        // Or we send raw DB fields and Frontend handles it?
        // Frontend `Bike.vue` uses `barX`.
        // I MUST CAMELCASE KEYS.

        const camelItem = toCamel(item);
        const mappedColors = itemColors.map(c => ({
            id: c.id,
            colorName: c.colorName,
            price: c.price,
            companyPrice: c.price, // Debug
            image: getImageUrl(c),
            // ... map other fields ...
            hex: c.hex,
            // If there's a custom image, it might be in 'custom_image' or 'image' depending on DB
            // Let's ensure we map the ONE field the frontend uses.
            // Frontend likely looks for 'image' or 'customImage'?
        }));

        // Merging mapped colors
        camelItem.colors = itemColors.map(c => {
            const camelColor = toCamel(c);
            return {
                ...camelColor,         // Top-level properties (id, price, etc.)
                price: c.price,        // Explicit price
                image: getImageUrl(c), // Explicit image
                color: {               // Legacy wrapper for frontend compatibility
                    ...camelColor,
                    price: c.price,
                    image: getImageUrl(c)
                }
            };
        });

        if (camelItem.colors.length > 0) {
            console.log(`[DEBUG] Item ${camelItem.id} (${camelItem.name}) has ${camelItem.colors.length} colors.`);
            camelItem.colors.forEach((c, idx) => console.log(`  - Color [${idx}] ID:${c.id} Name:${c.colorName} Price:${c.price}`));
        }

        return camelItem;
    });

};

const getImageUrl = (item) => {
    // If item has custom_image (base64 or path), prefer it.
    // DB field is snake_case 'custom_image'.
    if (item.custom_image) return item.custom_image;
    // Fallback to 'image' column
    return item.image || '';
};

const toCamel = (obj) => {
    const newObj = {};
    const MAP = {
        'bar_position_x': 'barX',
        'bar_position_y': 'barY',
        'wheel_right_x': 'rightWheelX',
        'wheel_right_y': 'rightWheelY',
        'wheel_left_x': 'leftWheelX',
        'wheel_left_y': 'leftWheelY',
        'groupset_capilier_rear_x': 'groupsetCapilierRearX',
        'groupset_capilier_rear_y': 'groupsetCapilierRearY',
        'groupset_capilier_front_x': 'groupsetCapilierFrontX',
        'groupset_capilier_front_y': 'groupsetCapilierFrontY',
        'groupset_capilier_middle_x': 'groupsetCapilierMiddleX',
        'groupset_capilier_middle_y': 'groupsetCapilierMiddleY',
        // Add defaults that might be missing in DB or named differently
    };

    // Default Enabled flags if not present (usually true in legacy app)
    newObj.barEnabled = true;
    newObj.wheelEnabled = true;
    newObj.seatpostEnabled = true;
    newObj.groupsetEnabled = true;
    newObj.saddleEnabled = true;

    for (const key in obj) {
        let newKey = MAP[key];
        if (!newKey) {
            // simple snake to camel
            newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        }
        newObj[newKey] = obj[key];
    }

    // Explicit custom overrides if needed
    if (obj.custom_image) {
        newObj.customImage = obj.custom_image;
    }

    return newObj;
}

app.get('/api/site/configuration/:host', (req, res) => {
    try {
        const companyId = 1;

        // Fetch Company Info
        const companies = db.prepare('SELECT * FROM Company WHERE id = ?').all(companyId);
        const company = companies[0] || {};

        // Fetch All Entities synchronously
        const framesets = fetchEntityWithColors('Frameset', companyId);
        const wheels = fetchEntityWithColors('Wheel', companyId);
        const groupsets = fetchEntityWithColors('Groupset', companyId);
        const saddles = fetchEntityWithColors('Saddle', companyId);
        const bars = fetchEntityWithColors('Bar', companyId);
        const tyres = fetchEntityWithColors('Tyre', companyId);
        const seatposts = fetchEntityWithColors('Seatpost', companyId);

        // Special Builds
        const specialBuilds = db.prepare('SELECT * FROM SpecialBuild WHERE idCompany = ?').all(companyId);

        res.json({
            error: 0,
            object: {
                company: company,
                framesets,
                wheels,
                groupsets,
                saddles,
                bars,
                tyres,
                seatposts,
                specialBuilds
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/send-email', (req, res) => {
    const { name, email, phone, message, location, ...rest } = req.body;

    let cc = null;
    let subjectLocation = location || '';

    // Determine CC based on location
    if (location === 'Barcelona') {
        cc = 'marketing@velodrom.cc';
    } else if (location === 'Girona') {
        cc = 'sidney.lewis@velodrom.cc';
    }

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        cc: cc,
        subject: `NEW BIKE LEAD ${subjectLocation}`,
        text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Location: ${location}
      Message: ${message}
      
      -------------------------
      Configuration Details:
      ${JSON.stringify(rest, null, 2)}
    `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: true, message: error.toString() });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ error: false, message: 'Email sent successfully' });
    });
});

// Catch-all handler for any request that doesn't match the API above (ONLY IN PRODUCTION)
if (process.env.NODE_ENV === 'production') {
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
