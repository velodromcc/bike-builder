const fs = require('fs');
const data = JSON.parse(fs.readFileSync('response.json', 'utf8'));

const framesets = data.object && data.object.framesets ? data.object.framesets : [];
const frame = framesets.find(f => f.id === 5);

if (frame) {
    console.log("Frameset Found:", frame.name);
    console.log("Colors Count:", frame.colors ? frame.colors.length : 0);
    if (frame.colors) {
        frame.colors.forEach(wrapper => {
            const c = wrapper.color;
            console.log(`ID: ${c.id}, Name: ${c.colorName}, Price: ${c.price}, idCompany: ${c.idCompany}`);
        });
    }
}
