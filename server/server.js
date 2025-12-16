const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2/promise');
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

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'vps-2e3b96d8.vps.ovh.net',
    user: 'bikebuilder',
    password: 'm5h5Zp9jGpJH',
    database: 'bikebuilder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
app.get('/api/config/:table', async (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    try {
        let query = `SELECT * FROM ${table}`;

        // Filter by Company 1 for Master Tables
        // Assumes pattern: Table -> TableColor -> TableColorCompany
        if (['Frameset', 'Wheel', 'Groupset', 'Saddle'].includes(table)) {
            // We need DISTINCT because one Frameset has multiple colors, which would cause duplicates
            query = `
                SELECT DISTINCT t.* 
                FROM ${table} t
                JOIN ${table}Color tc ON t.id = tc.id${table}
                JOIN ${table}ColorCompany tcc ON tc.id = tcc.id${table}Color
                WHERE tcc.idCompany = 1 AND (t.archived = 0 OR t.archived IS NULL)
                ORDER BY t.priority DESC
            `;
        } else {
            // For standard tables, check if 'archived' col exists or just simple select
            // For safety, let's just do SELECT * and assume frontend filters or we add strict check later?
            // Actually, we should filter if column exists, but simpler:
            // If these are the only tables user edits, we are fine.
            // If we want generic approach for others:
            query = `SELECT * FROM ${table} WHERE archived = 0 OR archived IS NULL`;
        }

        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        // If column 'archived' doesn't exist on some other table, fall back to select all?
        // Or just log error. For now, assuming migration ran for targets.
        // If query fails, let's retry without archived filter?
        console.error(err);
        // Fallback for non-migrated tables
        try {
            const [rows] = await pool.query(`SELECT * FROM ${table}`);
            res.json(rows);
        } catch (e2) {
            res.status(500).json({ error: err.message });
        }
    }
});

// UPDATE Row
app.put('/api/config/:table/:id', async (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    const id = req.params.id;
    const data = req.body;

    // Filter out id from update data if present
    delete data.id;
    delete data.archived; // Prevent manual un-archiving via simple edit if desired, or allow it. Let's allow if they send it.

    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No data to update' });

    try {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];

        await pool.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, values);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// CREATE Row (Optional, for "Add" functionality)
app.post('/api/config/:table', async (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    const data = req.body;
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No data to create' });

    try {
        const keys = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        // archived Default is 0 in DB
        const [result] = await pool.query(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`, values);
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE Row (Soft Delete)
app.delete('/api/config/:table/:id', async (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    try {
        // Soft delete: Update archived = 1
        await pool.query(`UPDATE ${table} SET archived = 1 WHERE id = ?`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET Children (Parent -> ParentColor)
app.get('/api/config/:table/:id/children', async (req, res) => {
    const table = validateTable(req.params.table);
    if (!table) return res.status(400).json({ error: 'Invalid table' });

    // Convention: Table -> TableColor
    const childTable = `${table}Color`;
    const foreignKey = `id${table}`; // e.g., idFrameset

    try {
        // Filter out archived children too
        const [rows] = await pool.query(`SELECT * FROM ${childTable} WHERE ${foreignKey} = ? AND (archived = 0 OR archived IS NULL)`, [req.params.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        // Fallback: maybe the table doesn't follow convention or doesn't exist
        res.status(500).json({ error: err.message });
    }
});

// --- CONFIGURATION ENDPOINT (Replicates PHP Logic with custom_image support) ---

const fetchEntityWithColors = async (table, companyId) => {
    // 1. Fetch Items (filtered by existence of company link? Or all items?)
    // PHP seems to show items that have at least one color for the company.
    // Query: Select items distinct joined with color/company
    const query = `
        SELECT DISTINCT t.* 
        FROM ${table} t
        JOIN ${table}Color tc ON t.id = tc.id${table}
        JOIN ${table}ColorCompany tcc ON tc.id = tcc.id${table}Color
        WHERE tcc.idCompany = ? AND (t.archived = 0 OR t.archived IS NULL)
        ORDER BY t.priority DESC
    `;
    const [items] = await pool.query(query, [companyId]);

    // 2. Fetch Colors for these items
    // Efficient way: Fetch all colors for this company and map them in JS
    const colorQuery = `
        SELECT tc.*, tcc.price, tcc.idCompany
        FROM ${table}Color tc
        JOIN ${table}ColorCompany tcc ON tc.id = tcc.id${table}Color
        WHERE tcc.idCompany = ? AND (tc.archived = 0 OR tc.archived IS NULL)
    `;
    const [colors] = await pool.query(colorQuery, [companyId]);

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
            color: toCamel(c)
        }));

        return {
            ...camelItem,
            colors: mappedColors
        };
    });
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

app.get('/api/site/configuration/:host', async (req, res) => {
    try {
        // Hardcode Company 1 for Velodrom
        const companyId = 1;

        // Fetch Company Info
        const [companies] = await pool.query('SELECT * FROM Company WHERE id = ?', [companyId]);
        const company = companies[0] || {};

        // Fetch All Entities
        const [framesets, wheels, groupsets, saddles, bars, tyres, seatposts] = await Promise.all([
            fetchEntityWithColors('Frameset', companyId),
            fetchEntityWithColors('Wheel', companyId),
            fetchEntityWithColors('Groupset', companyId),
            fetchEntityWithColors('Saddle', companyId),
            fetchEntityWithColors('Bar', companyId),
            fetchEntityWithColors('Tyre', companyId),
            fetchEntityWithColors('Seatpost', companyId)
        ]);

        // Special Builds?
        const [specialBuilds] = await pool.query('SELECT * FROM SpecialBuild WHERE idCompany = ?', [companyId]);

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
    const { name, email, phone, message, ...rest } = req.body;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `New Enquiry from BikeBuilder: ${name}`, // Ensure subject is set
        text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
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
