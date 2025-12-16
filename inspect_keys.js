const fs = require('fs');
const data = JSON.parse(fs.readFileSync('response.json', 'utf8'));
console.log("Top Level keys:", Object.keys(data));
