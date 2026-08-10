import React, { useState } from 'react';
import { ordersData } from '../data/ordersData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, ShoppingCart, Clock, CheckCircle, TrendingUp, Eye } from 'lucide-react';

const SalesOrders = () => {
  const [orders, setOrders] = useState(ordersData || []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: 'ORD-' + Math.floor(Math.random()*10000), ...formData, status: 'Processing', date: new Date().toISOString().split('T')[0] };
    setOrders(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.customer?.toLowerCase().includes(search.toLowerCase()) || o.id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Sales Orders" 
        subtitle="Manage customer orders and fulfillment workflows."
        action={
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md">
            <Plus size={18} /> New Order
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-primary rounded-full"><ShoppingCart size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Orders</p><h3 className="text-xl font-bold">{orders.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><TrendingUp size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Revenue</p><h3 className="text-xl font-bold">${totalRevenue.toLocaleString()}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-warning-container text-warning rounded-full"><Clock size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Processing</p><h3 className="text-xl font-bold text-warning">{pendingCount}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-surface-container text-primary rounded-full"><CheckCircle size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Fulfilled Rate</p><h3 className="text-xl font-bold">{(orders.filter(o => o.status === 'Delivered').length / orders.length * 100).toFixed(0)}%</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim grid grid-cols-1 md:grid-cols-3 gap-4 rounded-t-lg">
          <div className="md:col-span-2">
            <SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders by customer or ID..." />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface outline-none focus:border-primary">
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Order ID</th>
                <th className="py-3 px-6 font-semibold">Customer</th>
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold text-right">Items</th>
                <th className="py-3 px-6 font-semibold text-right">Total</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => {
                let statusColor = 'bg-surface-variant text-on-surface-variant';
                if (row.status === 'Processing') statusColor = 'bg-warning-container text-warning';
                if (row.status === 'Shipped') statusColor = 'bg-primary-container text-primary';
                if (row.status === 'Delivered') statusColor = 'bg-primary-container text-secondary';

                return (
                  <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                    <td className="px-6 py-4 font-semibold text-on-surface">{row.id}</td>
                    <td className="px-6 py-4 text-on-surface">{row.customer}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.date}</td>
                    <td className="px-6 py-4 text-right text-on-surface-variant">{row.items}</td>
                    <td className="px-6 py-4 text-right font-medium">${Number(row.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>{row.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded opacity-0 group-hover:opacity-100"><Eye size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Order" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save Order</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="customer" label="Customer Name" value={formData.customer || ''} onChange={handleInputChange} required />
          <Input id="items" label="Item Count" type="number" value={formData.items || ''} onChange={handleInputChange} required />
          <Input id="total" label="Total Amount" type="number" value={formData.total || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default SalesOrders;