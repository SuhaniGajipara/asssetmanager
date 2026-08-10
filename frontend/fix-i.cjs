const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (!file.endsWith('.jsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('[i+1]')) {
        console.log('Fixing', file);
        let count = 2;
        content = content.replace(/\[i\+1\]/g, () => {
            return '[' + (count++) + ']';
        });
        fs.writeFileSync(filePath, content);
    }
});
