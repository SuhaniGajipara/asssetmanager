import React, { useState } from 'react';
import { transfersData } from '../data/transfersData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Repeat, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const Transfers = () => {
  const [data, setData] = useState(transfersData || []);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: 'TRF-' + Math.floor(Math.random()*10000), ...formData, status: 'In Transit', date: new Date().toISOString().split('T')[0] };
    setData(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = data.filter(d => d.id?.toLowerCase().includes(search.toLowerCase()) || d.from?.toLowerCase().includes(search.toLowerCase()) || d.to?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Stock Transfers" subtitle="Manage inventory moving between warehouses." action={<Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md"><Plus size={18} /> New Transfer</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-primary rounded-full"><Repeat size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Transfers</p><h3 className="text-xl font-bold">{data.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-warning-container text-warning rounded-full"><Clock size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">In Transit</p><h3 className="text-xl font-bold text-warning">{data.filter(d => d.status === 'In Transit').length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-surface-container text-primary rounded-full"><CheckCircle size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Completed</p><h3 className="text-xl font-bold">{data.filter(d => d.status === 'Completed').length}</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transfers..." /></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Transfer ID</th>
                <th className="py-3 px-6 font-semibold">Route</th>
                <th className="py-3 px-6 font-semibold">Items</th>
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface">{row.id}</td>
                  <td className="px-6 py-4 flex items-center gap-2 text-on-surface-variant">
                    <span className="font-medium text-on-surface">{row.from}</span>
                    <ArrowRight size={14} className="text-outline"/>
                    <span className="font-medium text-on-surface">{row.to}</span>
                  </td>
                  <td className="px-6 py-4 text-on-surface">{row.items}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'In Transit' ? 'bg-warning-container text-warning' : 'bg-primary-container text-secondary'}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Transfer" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Start Transfer</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="from" label="Source Warehouse" value={formData.from || ''} onChange={handleInputChange} required />
          <Input id="to" label="Destination Warehouse" value={formData.to || ''} onChange={handleInputChange} required />
          <Input id="items" label="Items / Quantity" value={formData.items || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default Transfers;