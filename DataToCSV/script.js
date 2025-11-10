const data = []
let str = "";
data.forEach(([name, url]) => {
    let escapedName = name.replace(/"/g, '""');
    str += `"${escapedName}","${url}"\n`;
})

const fs = require('fs');
fs.writeFileSync('data.csv', str, 'utf8');

