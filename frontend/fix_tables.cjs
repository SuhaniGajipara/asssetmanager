const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

let updated = 0;
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure table wrapper has w-full
  const originalWrapper = /<div className="overflow-x-auto">/g;
  if (originalWrapper.test(content)) {
    content = content.replace(originalWrapper, '<div className="overflow-x-auto w-full">');
    changed = true;
  }

  // 2. Ensure table has whitespace-nowrap and min-w-max
  const tableRegex = /<table className="([^"]+)">/g;
  content = content.replace(tableRegex, (match, classes) => {
    let newClasses = classes;
    if (!newClasses.includes('whitespace-nowrap')) newClasses += ' whitespace-nowrap';
    if (!newClasses.includes('min-w-max')) newClasses += ' min-w-max';
    if (newClasses !== classes) {
      changed = true;
      return `<table className="${newClasses}">`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log('Updated', file);
  }
}
console.log('Total files updated:', updated);
