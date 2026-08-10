import React, { useState } from 'react';
import { warehousesData } from '../data/warehousesData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Warehouse, Eye, Edit, Trash2 } from 'lucide-react';

const Warehouses = () => {
  const [data, setData] = useState(warehousesData || []);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: data.length + 1, ...formData, currentLoad: 0, status: 'Active' };
    setData(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Warehouses" subtitle="Manage your storage locations and capacities." action={<Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md"><Plus size={18} /> Add Warehouse</Button>} />

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search warehouses..." /></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Warehouse</th>
                <th className="py-3 px-6 font-semibold">Location</th>
                <th className="py-3 px-6 font-semibold">Manager</th>
                <th className="py-3 px-6 font-semibold text-right">Capacity</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface flex items-center gap-3"><Warehouse size={18} className="text-primary"/> {row.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.location}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.manager}</td>
                  <td className="px-6 py-4 text-right">{row.currentLoad || 0} / {row.capacity}</td>
                  <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' ? 'bg-primary-container text-secondary' : 'bg-warning-container text-warning'}`}>{row.status}</span></td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Warehouse" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="name" label="Warehouse Name" value={formData.name || ''} onChange={handleInputChange} required />
          <Input id="location" label="Location" value={formData.location || ''} onChange={handleInputChange} required />
          <Input id="capacity" label="Capacity (Units)" type="number" value={formData.capacity || ''} onChange={handleInputChange} required />
          <Input id="manager" label="Manager Name" value={formData.manager || ''} onChange={handleInputChange} />
        </form>
      </Modal>
    </div>
  );
};
export default Warehouses;