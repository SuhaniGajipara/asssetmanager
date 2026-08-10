import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, 'src/pages');

const patchPage = (filename, entityName, fields, setDataVar) => {
  const filePath = path.join(pagesDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filename}, file not found.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already patched
  if (content.includes('import Modal from')) {
    console.log(`Skipping ${filename}, already patched.`);
    return;
  }

  // 1. Add imports
  content = content.replace(
    /import React(.*?)from 'react';/, 
    `import React$1from 'react';\nimport Modal from '../components/ui/Modal';\nimport Input from '../components/ui/Input';\nimport Select from '../components/ui/Select';`
  );

  // 2. Add State inside component
  const componentStart = content.indexOf(`const ${filename.replace('.jsx', '')} = () => {`);
  if (componentStart !== -1) {
    const afterStart = content.indexOf('{', componentStart) + 1;
    const stateInjections = `
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: Math.random().toString(36).substr(2, 9), ...formData, status: 'Active' };
    ${setDataVar}(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };
`;
    content = content.slice(0, afterStart) + stateInjections + content.slice(afterStart);
  }

  // 3. Replace handleAction or inline alert
  content = content.replace(/alert\("Action.*?form\."\);?/g, `setIsModalOpen(true);`);
  content = content.replace(/alert\("Action clicked! This would open a modal or navigate to a form."\)/g, `setIsModalOpen(true)`);

  // 4. Inject Modal before the last </div>
  const lastDivIndex = content.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
    const inputsHTML = fields.map(f => {
      if (f.type === 'select') {
        return `            <Select id="${f.id}" label="${f.label}" options={${JSON.stringify(f.options)}} value={formData.${f.id} || ''} onChange={handleInputChange} required />`;
      }
      return `            <Input id="${f.id}" label="${f.label}" type="${f.type || 'text'}" value={formData.${f.id} || ''} onChange={handleInputChange} required />`;
    }).join('\n');

    const modalHTML = `
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add ${entityName}"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddSubmit}>Save ${entityName}</Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
${inputsHTML}
        </form>
      </Modal>
`;
    content = content.slice(0, lastDivIndex) + modalHTML + content.slice(lastDivIndex);
    
    // Wire submit button to form
    content = content.replace(/onClick=\{handleAddSubmit\}>Save/g, 'type="submit" form="addForm">Save');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${filename}`);
};

const pagesToPatch = [
  { file: 'Products.jsx', name: 'Product', set: 'setProducts', fields: [{id: 'name', label: 'Product Name'}, {id: 'sku', label: 'SKU'}, {id: 'price', label: 'Price', type: 'number'}, {id: 'category', label: 'Category', type: 'select', options: [{label: 'Electronics', value: 1}, {label: 'Furniture', value: 3}]}] },
  { file: 'Categories.jsx', name: 'Category', set: 'setData', fields: [{id: 'name', label: 'Category Name'}, {id: 'description', label: 'Description'}] },
  { file: 'Warehouses.jsx', name: 'Warehouse', set: 'setData', fields: [{id: 'name', label: 'Warehouse Name'}, {id: 'location', label: 'Location'}, {id: 'capacity', label: 'Capacity', type: 'number'}] },
  { file: 'Suppliers.jsx', name: 'Supplier', set: 'setData', fields: [{id: 'name', label: 'Supplier Name'}, {id: 'contact', label: 'Contact Email'}, {id: 'phone', label: 'Phone'}] },
  { file: 'Deliveries.jsx', name: 'Delivery', set: 'setDeliveries', fields: [{id: 'destination', label: 'Destination'}, {id: 'driver', label: 'Driver'}, {id: 'quantity', label: 'Quantity', type: 'number'}] },
  { file: 'Adjustments.jsx', name: 'Adjustment', set: 'setAdjustments', fields: [{id: 'product', label: 'Product'}, {id: 'quantity', label: 'Quantity', type: 'number'}, {id: 'reason', label: 'Reason'}] },
  { file: 'Transfers.jsx', name: 'Transfer', set: 'setTransfers', fields: [{id: 'from', label: 'From Warehouse'}, {id: 'to', label: 'To Warehouse'}, {id: 'items', label: 'Items'}] },
  { file: 'Receipts.jsx', name: 'Receipt', set: 'setReceipts', fields: [{id: 'poId', label: 'Purchase Order ID'}, {id: 'warehouse', label: 'Warehouse'}] },
  { file: 'PurchaseOrders.jsx', name: 'Purchase Order', set: 'setData', fields: [{id: 'supplier', label: 'Supplier'}, {id: 'total', label: 'Total Amount', type: 'number'}, {id: 'expectedDate', label: 'Expected Date', type: 'date'}] },
  { file: 'SalesOrders.jsx', name: 'Sales Order', set: 'setData', fields: [{id: 'customer', label: 'Customer'}, {id: 'items', label: 'Items Count', type: 'number'}, {id: 'total', label: 'Total Amount', type: 'number'}] }
];

pagesToPatch.forEach(p => patchPage(p.file, p.name, p.fields, p.set));
