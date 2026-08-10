import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, 'src/pages');

fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace inline console.log("Add new") with alert
    content = content.replace(/onClick=\{\(\) => console\.log\("Add new"\)\}/g, 
      'onClick={() => alert("Action clicked! This would open a modal or navigate to a form.")}');

    // Replace the settings save
    content = content.replace(/console\.log\('Saved settings'\);/g, 
      'alert("Settings saved successfully!");');

    // Replace the adjustments submit
    content = content.replace(/console\.log\('Submit adjustment', form\);/g, 
      'alert("Adjustment submitted successfully!");');
      
    // Fix EmptyState onAction in Support, OrderDetails, ReportsDashboard
    content = content.replace(/onAction=\{\(\) => console\.log\('Action'\)\}/g,
      'onAction={() => alert("Action clicked!")}');

    fs.writeFileSync(filePath, content);
  }
});
console.log('Buttons fixed!');
