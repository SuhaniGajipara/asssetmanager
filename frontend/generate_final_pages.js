import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';

const generatePage = ({ name, title, desc, icon, kpiTitle, kpiVal, dataName, cols, fields }) => {
  return `import React, { useState } from 'react';
import { ${dataName} } from '../data/${dataName}';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, ${icon}, Eye, Edit, Trash2 } from 'lucide-react';

const ${name} = () => {
  const [data, setData] = useState(${dataName} || []);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: data.length + 1, ...formData, status: 'Active' };
    setData(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = data.filter(d => Object.values(d).some(v => String(v).toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="${title}" subtitle="${desc}" action={<Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md"><Plus size={18} /> Add New</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-primary-container text-primary rounded-full"><${icon} size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">${kpiTitle}</p><h3 className="text-xl font-bold">{data.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-secondary">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><${icon} size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Active / Complete</p><h3 className="text-xl font-bold">{data.filter(d => d.status === 'Active' || d.status === 'Completed').length}</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." /></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                ${cols.map(c => `<th className="py-3 px-6 font-semibold">${c}</th>`).join('')}
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                  ${cols.map((c, i) => i===0 ? `<td className="px-6 py-4 font-semibold text-on-surface">{row[Object.keys(row)[1]] || row.id}</td>` : `<td className="px-6 py-4 text-on-surface-variant">{row[Object.keys(row)[i+1]] || ''}</td>`).join('')}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye size={16} /></button>
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded"><Edit size={16} /></button>
                      <button className="p-1.5 text-error hover:bg-error/10 rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add ${title}" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          ${fields.map(f => `<Input id="${f.id}" label="${f.label}" value={formData.${f.id} || ''} onChange={handleInputChange} required />`).join('')}
        </form>
      </Modal>
    </div>
  );
};
export default ${name};`;
};

const pagesToFix = [
  { name: 'Users', title: 'System Users', desc: 'Manage system users and access levels.', icon: 'Users', kpiTitle: 'Total Users', dataName: 'usersData', cols: ['Name', 'Email', 'Role', 'Status'], fields: [{id: 'name', label: 'Name'}, {id: 'email', label: 'Email'}, {id: 'role', label: 'Role'}] },
  { name: 'RolesPermissions', title: 'Roles & Permissions', desc: 'Configure system roles.', icon: 'Shield', kpiTitle: 'Total Roles', dataName: 'rolesPermissionsData', cols: ['Role', 'Description', 'Users'], fields: [{id: 'role', label: 'Role Name'}, {id: 'description', label: 'Description'}] },
  { name: 'StockLevels', title: 'Stock Levels', desc: 'View granular stock availability.', icon: 'Layers', kpiTitle: 'Total Records', dataName: 'stockData', cols: ['Product', 'SKU', 'Warehouse', 'Available'], fields: [{id: 'product', label: 'Product'}, {id: 'sku', label: 'SKU'}, {id: 'warehouse', label: 'Warehouse'}, {id: 'available', label: 'Quantity'}] },
  { name: 'StockMovements', title: 'Stock Movements', desc: 'Track all stock ins and outs.', icon: 'Activity', kpiTitle: 'Total Movements', dataName: 'stockData', cols: ['Date', 'Product', 'Type', 'Quantity'], fields: [{id: 'product', label: 'Product'}, {id: 'type', label: 'Movement Type'}, {id: 'quantity', label: 'Quantity'}] },
  { name: 'Deliveries', title: 'Deliveries', desc: 'Manage outgoing order deliveries.', icon: 'Truck', kpiTitle: 'Total Deliveries', dataName: 'deliveriesData', cols: ['Order ID', 'Destination', 'Driver', 'Status'], fields: [{id: 'orderId', label: 'Order ID'}, {id: 'destination', label: 'Destination'}, {id: 'driver', label: 'Driver'}] },
  { name: 'Receipts', title: 'Receipts', desc: 'Manage incoming goods receipts.', icon: 'ArrowDownCircle', kpiTitle: 'Total Receipts', dataName: 'receiptsData', cols: ['PO ID', 'Warehouse', 'Received By', 'Status'], fields: [{id: 'poId', label: 'PO ID'}, {id: 'warehouse', label: 'Warehouse'}] },
  { name: 'PurchaseReceipts', title: 'Purchase Receipts', desc: 'Detailed view of received purchases.', icon: 'ArrowDownCircle', kpiTitle: 'Total Receipts', dataName: 'receiptsData', cols: ['PO ID', 'Warehouse', 'Status'], fields: [{id: 'poId', label: 'PO ID'}, {id: 'warehouse', label: 'Warehouse'}] },
  { name: 'OrderDetails', title: 'Order Details', desc: 'Granular view of order items.', icon: 'FileText', kpiTitle: 'Total Records', dataName: 'ordersData', cols: ['Order ID', 'Customer', 'Items', 'Status'], fields: [{id: 'customer', label: 'Customer'}] }
];

// Add Shield manually to imports just in case
pagesToFix.forEach(p => {
  let content = generatePage(p);
  if (p.icon === 'Shield') content = content.replace('Plus, Shield, Eye', 'Plus, Shield, Users, Eye');
  fs.writeFileSync(path.join(pagesDir, p.name + '.jsx'), content);
});
console.log('Fixed remaining pages');
