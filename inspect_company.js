const fs = require('fs');
const data = JSON.parse(fs.readFileSync('response.json', 'utf8'));

if (data.object && data.object.company) {
    const c = data.object.company;
    console.log(`id: ${c.id}`);
    console.log(`color1: ${c.color1}`);
    console.log(`color2: ${c.color2}`);
    console.log(`color3: ${c.color3}`);
} else {
    console.log("Company NOT FOUND");
}
