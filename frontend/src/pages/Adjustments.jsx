import React, { useState } from 'react';
import { adjustmentsData } from '../data/adjustmentsData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, GitCompare, TrendingUp, TrendingDown } from 'lucide-react';

const Adjustments = () => {
  const [data, setData] = useState(adjustmentsData || []);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: 'ADJ-' + Math.floor(Math.random()*10000), ...formData, type: formData.quantity >= 0 ? 'Found' : 'Shrinkage', date: new Date().toISOString().split('T')[0], approvedBy: 'Admin' };
    setData(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = data.filter(d => d.product?.toLowerCase().includes(search.toLowerCase()) || d.id?.toLowerCase().includes(search.toLowerCase()));

  const posVariance = data.filter(d => d.quantity > 0).reduce((acc, d) => acc + d.quantity, 0);
  const negVariance = data.filter(d => d.quantity < 0).reduce((acc, d) => acc + Math.abs(d.quantity), 0);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Stock Adjustments" subtitle="Reconcile physical counts with system records." action={<Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md"><Plus size={18} /> New Adjustment</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-primary rounded-full"><GitCompare size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Adjustments</p><h3 className="text-xl font-bold">{data.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><TrendingUp size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Positive Variance</p><h3 className="text-xl font-bold text-secondary">+{posVariance} units</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-error-container text-error rounded-full"><TrendingDown size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Negative Variance</p><h3 className="text-xl font-bold text-error">-{negVariance} units</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search adjustments..." /></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Adjustment ID</th>
                <th className="py-3 px-6 font-semibold">Product</th>
                <th className="py-3 px-6 font-semibold text-center">Type</th>
                <th className="py-3 px-6 font-semibold text-right">Variance</th>
                <th className="py-3 px-6 font-semibold">Reason</th>
                <th className="py-3 px-6 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface">{row.id}</td>
                  <td className="px-6 py-4 text-on-surface">{row.product}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${row.quantity > 0 ? 'bg-primary-container text-secondary' : 'bg-error-container text-error'}`}>{row.type}</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${row.quantity > 0 ? 'text-secondary' : 'text-error'}`}>{row.quantity > 0 ? '+' : ''}{row.quantity}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{row.reason}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Adjustment" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save Adjustment</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="product" label="Product Name" value={formData.product || ''} onChange={handleInputChange} required />
          <Input id="quantity" label="Variance Quantity (+/-)" type="number" value={formData.quantity || ''} onChange={handleInputChange} required />
          <Input id="reason" label="Reason" value={formData.reason || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default Adjustments;