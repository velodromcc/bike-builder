const mysql = require('mysql2/promise');

const CONSTANTS = {
    framesets: { title: 'Frameset' },
    bars: { title: 'Bars' },
    groupsets: { title: 'Groupset' },
    wheels: { title: 'Wheels' },
    tyres: { title: 'Tyres' },
    seatposts: { title: 'Seatposts' },
    saddles: { title: 'Saddles' }
};

const ITEMS_LIST = Object.keys(CONSTANTS).map(key => ({
    id: key,
    ...CONSTANTS[key]
})).filter(a => a.title);

const toCamel = (obj) => {
    const newObj = {};
    const MAP = {
        'bar_position_x': 'barX',
        // ... (simplified)
    };
    newObj.barEnabled = true;
    newObj.seatpostEnabled = true;
    newObj.saddleEnabled = true;

    for (const key in obj) {
        let newKey = MAP[key];
        if (!newKey) {
            newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        }
        newObj[newKey] = obj[key];
    }
    return newObj;
};

const getSteps = (frameset) => {
    const steps = ITEMS_LIST.slice();
    if (frameset) {
        if (!frameset.saddleEnabled) steps.splice(6, 1);
        if (!frameset.seatpostEnabled) steps.splice(5, 1);
        if (!frameset.wheelEnabled) steps.splice(3, 1);
        if (!frameset.groupsetEnabled) steps.splice(2, 1);
        if (!frameset.barEnabled) steps.splice(1, 1);
    }
    return steps;
};

(async () => {
    const conn = await mysql.createConnection({
        host: 'vps-2e3b96d8.vps.ovh.net',
        user: 'bikebuilder',
        password: 'm5h5Zp9jGpJH',
        database: 'bikebuilder'
    });

    // URL Parts (Frameset 11)
    const codes = [
        { table: 'Frameset', id: 11, color: 0 },
        { table: 'Groupset', id: 6, color: 0 },
        { table: 'Wheel', id: 17, color: 0 },
        { table: 'Tyre', id: 7, color: 0 },
        { table: 'Saddle', id: 6, color: 0 } // Using 6 as per User description
    ];

    const [rows] = await conn.execute('SELECT * FROM Frameset WHERE id = 11');
    const framesetDB = rows[0];
    const framesetAPI = toCamel(framesetDB);

    console.log('Frameset API:', JSON.stringify(framesetAPI, null, 2));

    const steps = getSteps(framesetAPI);
    console.log('Computed Steps:', steps.map(s => s.id));

    for (const c of codes) {
        // Check if item has colors
        const [colors] = await conn.execute(`SELECT * FROM ${c.table}Color WHERE id${c.table} = ?`, [c.id]);
        console.log(`${c.table} ${c.id}: ${colors.length} colors found.`);
        if (colors.length <= c.color) {
            console.log(`ERROR: ${c.table} ${c.id} has only ${colors.length} colors. Index ${c.color} is invalid!`);
        }
    }

    await conn.end();
})();
