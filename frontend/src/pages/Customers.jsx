import React, { useState } from 'react';
import { customersData } from '../data/customersData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Users, ShoppingBag, DollarSign, Activity, Eye, Edit, Trash2 } from 'lucide-react';

const Customers = () => {
  const [data, setData] = useState(customersData || []);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: data.length + 1, ...formData, totalOrders: 0, status: 'Active' };
    setData(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Customers" subtitle="Manage customer accounts and order history." action={<Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md"><Plus size={18} /> Add Customer</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-primary-container text-primary rounded-full"><Users size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Customers</p><h3 className="text-xl font-bold">{data.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-secondary">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><ShoppingBag size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Active Buyers</p><h3 className="text-xl font-bold">{data.filter(d => d.status === 'Active').length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-warning">
          <div className="p-3 bg-warning-container text-warning rounded-full"><DollarSign size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Avg. Order Val</p><h3 className="text-xl font-bold text-warning">$1,450</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-error">
          <div className="p-3 bg-error-container text-error rounded-full"><Activity size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Churned</p><h3 className="text-xl font-bold text-error">2</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." /></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Customer Name</th>
                <th className="py-3 px-6 font-semibold">Email</th>
                <th className="py-3 px-6 font-semibold">Phone</th>
                <th className="py-3 px-6 font-semibold text-center">Total Orders</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface">{row.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.email}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.phone}</td>
                  <td className="px-6 py-4 text-center font-medium">{row.totalOrders}</td>
                  <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Active' ? 'bg-primary-container text-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>{row.status}</span></td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save Customer</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="name" label="Company / Customer Name" value={formData.name || ''} onChange={handleInputChange} required />
          <Input id="email" label="Contact Email" type="email" value={formData.email || ''} onChange={handleInputChange} required />
          <Input id="phone" label="Phone Number" value={formData.phone || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default Customers;