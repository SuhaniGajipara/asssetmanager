import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the semicolon
  content = content.replace(/setIsModalOpen\(true\);}/g, 'setIsModalOpen(true)}');

  // Fix duplicate Input
  if (content.match(/import Input from/g)?.length > 1) {
    // Remove the second occurrence
    const firstIndex = content.indexOf('import Input from');
    const secondIndex = content.indexOf('import Input from', firstIndex + 1);
    if (secondIndex !== -1) {
       const lineEnd = content.indexOf('\n', secondIndex);
       content = content.slice(0, secondIndex) + content.slice(lineEnd + 1);
    }
  }

  // Fix duplicate Select
  if (content.match(/import Select from/g)?.length > 1) {
    const firstIndex = content.indexOf('import Select from');
    const secondIndex = content.indexOf('import Select from', firstIndex + 1);
    if (secondIndex !== -1) {
       const lineEnd = content.indexOf('\n', secondIndex);
       content = content.slice(0, secondIndex) + content.slice(lineEnd + 1);
    }
  }

  fs.writeFileSync(filePath, content);
});
console.log('Fixed syntax errors');
