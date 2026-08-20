import React, { useState } from 'react';
import { stockData } from '../data/stockData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Activity, Eye, Edit, Trash2 } from 'lucide-react';

const StockMovements = () => {
  const [data, setData] = useState(stockData || []);
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
      <PageHeader title="Stock Movements" subtitle="Track all stock ins and outs." action={<Button variant="white" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2"><Plus size={18} /> Add New</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-primary-container text-primary rounded-full"><Activity size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Movements</p><h3 className="text-xl font-bold">{data.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-secondary">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><Activity size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Active / Complete</p><h3 className="text-xl font-bold">{data.filter(d => d.status === 'Active' || d.status === 'Completed').length}</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." /></div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/50 text-on-surface-variant text-sm">
                <th className="py-3 px-6 font-semibold">Date</th><th className="py-3 px-6 font-semibold">Product</th><th className="py-3 px-6 font-semibold">Type</th><th className="py-3 px-6 font-semibold">Quantity</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-outline-variant/10 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface">{row[Object.keys(row)[1]] || row.id}</td><td className="px-6 py-4 text-on-surface-variant">{row[Object.keys(row)[2]] || ''}</td><td className="px-6 py-4 text-on-surface-variant">{row[Object.keys(row)[3]] || ''}</td><td className="px-6 py-4 text-on-surface-variant">{row[Object.keys(row)[4]] || ''}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Stock Movements" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="product" label="Product" value={formData.product || ''} onChange={handleInputChange} required /><Input id="type" label="Movement Type" value={formData.type || ''} onChange={handleInputChange} required /><Input id="quantity" label="Quantity" value={formData.quantity || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default StockMovements;