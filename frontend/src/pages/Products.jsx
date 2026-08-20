import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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

const StatCard = ({ title, value, subtitle, icon: Icon, isSelected = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative rounded-xl overflow-hidden p-4 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-[#2a1b54] to-[#3b2774] text-white shadow-md ${isSelected ? 'scale-[1.02] ring-2 ring-purple-400' : 'hover:-translate-y-1 hover:shadow-lg'}`}
  >
    {/* Decorative circles */}
    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/4 pointer-events-none" />
    <div className="absolute -bottom-8 right-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="flex flex-col h-full justify-between">
        <p className="text-white/80 text-[11px] font-semibold tracking-wider uppercase mb-1.5">{title}</p>
        <h3 className="text-white text-2xl font-bold mb-1.5 tabular-nums">{value}</h3>
        <p className={`text-[11px] font-medium ${subtitle.includes('Critical') ? 'text-red-300' : subtitle.includes('attention') ? 'text-yellow-300' : 'text-white/70'}`}>
          {subtitle}
        </p>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white border border-white/5 shadow-inner group-hover:bg-white/20 transition-colors duration-300 shrink-0">
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  </div>
);

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState(productsData || []);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState(location.state?.stockFilter || 'All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const [viewProduct, setViewProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    if (isEditMode) {
      setProducts(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData, stock: Number(formData.stock || 0), minStock: Number(formData.minStock || 10) } : p));
    } else {
      const newEntry = { id: Math.random(), stock: Number(formData.stock || 0), minStock: Number(formData.minStock || 10), status: 'In Stock', ...formData };
      setProducts(prev => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
    setFormData({});
    setIsEditMode(false);
  };

  const confirmDelete = () => {
    if (deleteProduct) {
      setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    }
    setIsDeleteModalOpen(false);
    setDeleteProduct(null);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const catName = categoriesData.find(c => c.id == p.category)?.name || p.category;
    const matchCat = catFilter === 'All' || catName === catFilter;
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
          <Button variant="white" onClick={() => { setIsEditMode(false); setFormData({}); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2">
            <Plus size={18} /> Add Product
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={products.length} 
          subtitle="Active catalog items" 
          icon={Package} 
          isSelected={stockFilter === 'All'}
          onClick={() => setStockFilter('All')} 
        />
        <StatCard 
          title="Total Stock Units" 
          value={totalStock.toLocaleString()} 
          subtitle="Units across all locations" 
          icon={Layers} 
          onClick={() => {}} 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockCount} 
          subtitle="Items need attention" 
          icon={AlertTriangle} 
          isSelected={stockFilter === 'Low Stock'}
          onClick={() => setStockFilter('Low Stock')} 
        />
        <StatCard 
          title="Out of Stock" 
          value={outOfStockCount} 
          subtitle="Critical action required" 
          icon={XOctagon} 
          isSelected={stockFilter === 'Out of Stock'}
          onClick={() => setStockFilter('Out of Stock')} 
        />
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50">
          <h2 className="text-lg font-bold text-on-surface">Product List</h2>
        </div>
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products by name or SKU..." className="h-11" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="h-11 bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-48 transition-colors">
            <option value="All">All Categories</option>
            {categoriesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="h-11 bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-48 transition-colors">
            <option value="All">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/50 text-on-surface-variant text-sm">
                <th className="py-3 px-6 font-semibold">Product</th>
                <th className="py-3 px-6 font-semibold">SKU</th>
                <th className="py-3 px-6 font-semibold">Category</th>
                <th className="py-3 px-6 font-semibold text-right">Current Stock</th>
                <th className="py-3 px-6 font-semibold text-right">Min. Stock</th>
                <th className="py-3 px-6 font-semibold text-right">Price</th>
                <th className="py-3 px-6 font-semibold text-center">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((row, idx) => {
                const stock = Number(row.stock || 0);
                const min = Number(row.minStock || 10);
                const isOut = stock === 0;
                const isLow = stock > 0 && stock <= min;
                
                let statusColor = 'bg-primary-container text-primary';
                let statusText = 'In Stock';
                if (isOut) { statusColor = 'bg-error-container text-error'; statusText = 'Out of Stock'; }
                else if (isLow) { statusColor = 'bg-warning-container text-warning'; statusText = 'Low Stock'; }
                
                const catName = categoriesData.find(c => c.id == row.category)?.name || row.category || 'N/A';

                return (
                  <tr key={row.id || idx} className="border-b border-outline-variant/30 hover:bg-outline-variant/10 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-on-surface">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.sku}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{catName}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${isOut ? 'text-error' : (isLow ? 'text-warning' : 'text-on-surface')}`}>{stock}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-on-surface-variant">{min}</td>
                    <td className="px-6 py-4 text-right text-on-surface-variant">${Number(row.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>{statusText}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="relative group/btn inline-block">
                          <button onClick={() => { setViewProduct(row); setIsViewModalOpen(true); }} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary"><Eye size={16} /></button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-on-surface bg-surface border border-outline-variant rounded shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">View Product</div>
                        </div>
                        <div className="relative group/btn inline-block">
                          <button onClick={() => { setFormData(row); setIsEditMode(true); setIsModalOpen(true); }} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary"><Edit size={16} /></button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-on-surface bg-surface border border-outline-variant rounded shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">Edit Product</div>
                        </div>
                        <div className="relative group/btn inline-block">
                          <button onClick={() => { setDeleteProduct(row); setIsDeleteModalOpen(true); }} className="p-1.5 text-error hover:bg-error/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-error"><Trash2 size={16} /></button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-on-surface bg-surface border border-outline-variant rounded shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">Delete Product</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-on-surface-variant">
                    No products found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Product Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setIsEditMode(false); setFormData({}); }} 
        title={isEditMode ? "Edit Product" : "Add Product"} 
        footer={<><Button variant="ghost" onClick={() => { setIsModalOpen(false); setIsEditMode(false); setFormData({}); }}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save Product</Button></>}
      >
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="name" label="Product Name" value={formData.name || ''} onChange={handleInputChange} required />
          <Input id="sku" label="SKU" value={formData.sku || ''} onChange={handleInputChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="stock" label="Current Stock" type="number" value={formData.stock || 0} onChange={handleInputChange} required />
            <Input id="minStock" label="Min. Stock" type="number" value={formData.minStock || 10} onChange={handleInputChange} required />
          </div>
          <Input id="price" label="Price" type="number" step="0.01" value={formData.price || ''} onChange={handleInputChange} required />
          <Select id="category" label="Category" options={[{label: 'Select a category...', value: ''}, ...categoriesData.map(c => ({ label: c.name, value: c.id }))]} value={formData.category || ''} onChange={handleInputChange} required />
        </form>
      </Modal>

      {/* View Product Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title="Product Details" 
        footer={<Button variant="primary" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {viewProduct && (
          <div className="space-y-3 text-sm mt-2">
            <div className="grid grid-cols-3 gap-2 border-b border-outline-variant/30 pb-3">
              <span className="text-on-surface-variant font-medium">Name</span>
              <span className="col-span-2 font-semibold text-on-surface">{viewProduct.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-outline-variant/30 pb-3">
              <span className="text-on-surface-variant font-medium">SKU</span>
              <span className="col-span-2 text-on-surface">{viewProduct.sku}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-outline-variant/30 pb-3">
              <span className="text-on-surface-variant font-medium">Category</span>
              <span className="col-span-2 text-on-surface">{viewProduct.category || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b border-outline-variant/30 pb-3">
              <span className="text-on-surface-variant font-medium">Stock Level</span>
              <span className="col-span-2 text-on-surface">
                {viewProduct.stock || 0} <span className="text-outline text-xs">/ {viewProduct.minStock || 10} min</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pb-1">
              <span className="text-on-surface-variant font-medium">Price</span>
              <span className="col-span-2 text-on-surface">${Number(viewProduct.price || 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Deletion" 
        footer={<><Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></>}
      >
        <p className="text-on-surface-variant mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        {deleteProduct && (
          <div className="p-3 bg-surface-dim border border-outline-variant/50 rounded font-medium text-on-surface flex items-center gap-2">
            <Package size={16} className="text-outline" />
            {deleteProduct.name} <span className="text-outline font-normal">({deleteProduct.sku})</span>
          </div>
        )}
      </Modal>

    </div>
  );
};
export default Products;