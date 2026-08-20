const fs = require('fs');
const path = require('path');
const pagesDir = path.join(process.cwd(), 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('action={<Button')) {
    if (!content.includes('action={<Button variant="white"')) {
      content = content.replace(/action=\{<Button /g, 'action={<Button variant="white" ');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + file);
      updatedCount++;
    }
  }
}
console.log('Total files updated: ' + updatedCount);
