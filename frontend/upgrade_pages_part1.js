import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';

const productsContent = `import React, { useState } from 'react';
import { productsData } from '../data/productsData';
import { categoriesData } from '../data/categoriesData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Package, Layers, AlertTriangle, XOctagon, Eye, Edit, Trash2 } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState(productsData || []);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const newEntry = { id: Math.random(), ...formData, stock: 0, status: 'In Stock' };
    setProducts(prev => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({});
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category == catFilter;
    let matchStock = true;
    if (stockFilter === 'Low Stock') matchStock = p.stock <= (p.minStock || 10) && p.stock > 0;
    if (stockFilter === 'Out of Stock') matchStock = p.stock === 0;
    if (stockFilter === 'In Stock') matchStock = p.stock > (p.minStock || 10);
    return matchSearch && matchCat && matchStock;
  });

  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock <= (p.minStock || 10) && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Products & Inventory" 
        subtitle="Manage your items, categories, and stock levels."
        action={
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md">
            <Plus size={18} /> Add Product
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-primary rounded-full"><Package size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Products</p><h3 className="text-xl font-bold">{products.length}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary-container text-primary rounded-full"><Layers size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Stock Units</p><h3 className="text-xl font-bold">{totalStock}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-warning/50">
          <div className="p-3 bg-warning-container text-warning rounded-full"><AlertTriangle size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Low Stock Items</p><h3 className="text-xl font-bold text-warning">{lowStockCount}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-error/50">
          <div className="p-3 bg-error-container text-error rounded-full"><XOctagon size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Out of Stock</p><h3 className="text-xl font-bold text-error">{outOfStockCount}</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim grid grid-cols-1 md:grid-cols-4 gap-4 rounded-t-lg">
          <div className="md:col-span-2">
            <SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products by name or SKU..." />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface outline-none focus:border-primary">
            <option value="All">All Categories</option>
            {categoriesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface outline-none focus:border-primary">
            <option value="All">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Product</th>
                <th className="py-3 px-6 font-semibold">SKU</th>
                <th className="py-3 px-6 font-semibold text-right">Stock</th>
                <th className="py-3 px-6 font-semibold text-right">Price</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => {
                const isOut = row.stock === 0;
                const isLow = row.stock <= (row.minStock || 10) && row.stock > 0;
                let statusColor = 'bg-primary-container text-secondary';
                if (isOut) statusColor = 'bg-error-container text-error';
                else if (isLow) statusColor = 'bg-warning-container text-warning';

                return (
                  <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                    <td className="px-6 py-4 font-semibold text-on-surface">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.sku}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={\`font-medium \${isOut ? 'text-error' : (isLow ? 'text-warning' : 'text-on-surface')}\`}>{row.stock}</span>
                      <span className="text-xs text-on-surface-variant ml-1">/ {row.minStock || 10} min</span>
                    </td>
                    <td className="px-6 py-4 text-right text-on-surface-variant">\${Number(row.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={\`px-2 py-1 rounded text-xs font-medium \${statusColor}\`}>{isOut ? 'Out of Stock' : (isLow ? 'Low Stock' : 'In Stock')}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-primary hover:bg-primary/10 rounded"><Eye size={16} /></button>
                        <button className="p-1.5 text-primary hover:bg-primary/10 rounded"><Edit size={16} /></button>
                        <button className="p-1.5 text-error hover:bg-error/10 rounded"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Product" footer={<><Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save Product</Button></>}>
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="name" label="Product Name" value={formData.name || ''} onChange={handleInputChange} required />
          <Input id="sku" label="SKU" value={formData.sku || ''} onChange={handleInputChange} required />
          <Input id="price" label="Price" type="number" value={formData.price || ''} onChange={handleInputChange} required />
          <Select id="category" label="Category" options={[{label: 'Electronics', value: 1}, {label: 'Furniture', value: 3}]} value={formData.category || ''} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};
export default Products;`;

const ordersContent = `import React, { useState } from 'react';
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
          <div><p className="text-sm text-on-surface-variant">Total Revenue</p><h3 className="text-xl font-bold">\${totalRevenue.toLocaleString()}</h3></div>
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
                    <td className="px-6 py-4 text-right font-medium">\${Number(row.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={\`px-2 py-1 rounded text-xs font-medium \${statusColor}\`}>{row.status}</span>
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
export default SalesOrders;`;

fs.writeFileSync(path.join(pagesDir, 'Products.jsx'), productsContent);
fs.writeFileSync(path.join(pagesDir, 'SalesOrders.jsx'), ordersContent);
console.log('Updated Products and Orders');
