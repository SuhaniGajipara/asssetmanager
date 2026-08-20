import React, { useState } from 'react';
import { purchaseData } from '../data/purchaseData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Truck, FileText, AlertTriangle, Eye } from 'lucide-react';

const PurchaseOrders = () => {
  const [data, setData] = useState(purchaseData || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: 'PO-' + Math.floor(Math.random()*10000), ...formData, status: 'Pending' };
    setData(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = data.filter(d => {
    const matchSearch = d.supplier?.toLowerCase().includes(search.toLowerCase()) || d.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPo = data.length;
  const pendingCount = data.filter(d => d.status === 'Pending').length;
  const totalValue = data.reduce((acc, d) => acc + (d.total || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Purchase Orders" subtitle="Manage inbound orders from suppliers." action={<Button variant="white" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2"><Plus size={18} /> New PO</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-primary rounded-full"><FileText size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total POs</p><h3 className="text-xl font-bold">{totalPo}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-warning-container text-warning rounded-full"><AlertTriangle size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Pending Receipts</p><h3 className="text-xl font-bold text-warning">{pendingCount}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><Truck size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Value</p><h3 className="text-xl font-bold">${totalValue.toLocaleString()}</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim grid grid-cols-1 md:grid-cols-3 gap-4 rounded-t-lg">
          <div className="md:col-span-2"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers or PO ID..." /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm outline-none">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Received">Received</option>
          </select>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/50 text-on-surface-variant text-sm">
                <th className="py-3 px-6 font-semibold">PO Number</th>
                <th className="py-3 px-6 font-semibold">Supplier</th>
                <th className="py-3 px-6 font-semibold text-right">Total Amount</th>
                <th className="py-3 px-6 font-semibold">Expected Date</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => {
                let statusColor = 'bg-surface-variant text-on-surface-variant';
                if (row.status === 'Pending') statusColor = 'bg-warning-container text-warning';
                if (row.status === 'Received') statusColor = 'bg-primary-container text-secondary';

                return (
                  <tr key={idx} className="border-b border-outline-variant/30 hover:bg-outline-variant/10 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-on-surface">{row.id}</td>
                    <td className="px-6 py-4 text-on-surface">{row.supplier}</td>
                    <td className="px-6 py-4 text-right font-medium">${Number(row.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.expectedDate}</td>
                    <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>{row.status}</span></td>
                    <td className="px-6 py-4 text-center"><button className="p-1.5 text-primary hover:bg-primary/10 rounded opacity-0 group-hover:opacity-100"><Eye size={16} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Purchase Order" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save PO</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="supplier" label="Supplier Name" value={formData.supplier || ''} onChange={handleInputChange} required />
          <Input id="total" label="Total Amount" type="number" value={formData.total || ''} onChange={handleInputChange} required />
          <Input id="expectedDate" label="Expected Date" type="date" value={formData.expectedDate || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default PurchaseOrders;