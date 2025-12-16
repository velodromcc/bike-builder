const fs = require('fs');
const data = JSON.parse(fs.readFileSync('response.json', 'utf8'));

// The structure is likely data.object.framesets based on the previous cat output
const framesets = data.object && data.object.framesets ? data.object.framesets : [];

// Frameset ID 5
const frame = framesets.find(f => f.id === 5);

if (frame) {
    console.log("Frameset Found:", frame.name);
    console.log("Colors Count:", frame.colors ? frame.colors.length : 0);
    if (frame.colors) {
        frame.colors.forEach(c => {
            // In server.js we mapped it to { color: ...data }
            // Let's print the whole item to see structure
            console.log(JSON.stringify(c, null, 2));
        });
    }
} else {
    console.log("Frameset 5 NOT FOUND in response");
}
