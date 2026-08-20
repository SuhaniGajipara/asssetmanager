import React, { useState } from 'react';
import { categoriesData } from '../data/categoriesData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { SearchBox } from '../components/SearchBox';
import { Plus, Tags, Edit, Trash2, Layers } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, isSelected = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative rounded-xl overflow-hidden p-4 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-[#2a1b54] to-[#3b2774] text-white shadow-md ${isSelected ? 'scale-[1.02] ring-2 ring-purple-400' : 'hover:-translate-y-1 hover:shadow-lg'}`}
  >
    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/4 pointer-events-none" />
    <div className="absolute -bottom-8 right-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="flex flex-col h-full justify-between">
        <p className="text-white/80 text-[11px] font-semibold tracking-wider uppercase mb-1.5">{title}</p>
        <h3 className="text-white text-2xl font-bold mb-1.5 tabular-nums">{value}</h3>
        <p className="text-[11px] font-medium text-white/70">{subtitle}</p>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white border border-white/5 shadow-inner group-hover:bg-white/20 transition-colors duration-300 shrink-0">
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  </div>
);

const Categories = () => {
  const [data, setData] = useState(categoriesData || []);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    if (isEditMode) {
      setData(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } : c));
    } else {
      const newEntry = { id: Math.random(), status: 'Active', ...formData };
      setData(prev => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
    setFormData({});
    setIsEditMode(false);
  };

  const confirmDelete = () => {
    if (deleteCategory) {
      setData(prev => prev.filter(c => c.id !== deleteCategory.id));
    }
    setIsDeleteModalOpen(false);
    setDeleteCategory(null);
  };

  const filtered = data.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Categories" 
        subtitle="Manage product categories and classifications." 
        action={
          <Button variant="white" onClick={() => { setIsEditMode(false); setFormData({}); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2">
            <Plus size={18} /> Add Category
          </Button>
        } 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Categories" 
          value={data.length} 
          subtitle="All product classifications" 
          icon={Tags} 
        />
        <StatCard 
          title="Active Categories" 
          value={data.filter(c => c.status !== 'Inactive').length} 
          subtitle="Currently in use" 
          icon={Layers} 
        />
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50">
          <h2 className="text-lg font-bold text-on-surface">Category List</h2>
        </div>
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim">
          <SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="h-11 max-w-md" />
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/50 text-on-surface-variant text-sm">
                <th className="py-3 px-6 font-semibold">Category Name</th>
                <th className="py-3 px-6 font-semibold">Description</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-outline-variant/10 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface flex items-center gap-3"><Tags size={18} className="text-primary"/> {row.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.description}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative group/btn inline-block">
                        <button onClick={() => { setFormData(row); setIsEditMode(true); setIsModalOpen(true); }} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary"><Edit size={16} /></button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-on-surface bg-surface border border-outline-variant rounded shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">Edit Category</div>
                      </div>
                      <div className="relative group/btn inline-block">
                        <button onClick={() => { setDeleteCategory(row); setIsDeleteModalOpen(true); }} className="p-1.5 text-error hover:bg-error/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-error"><Trash2 size={16} /></button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-on-surface bg-surface border border-outline-variant rounded shadow-sm opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">Delete Category</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setIsEditMode(false); setFormData({}); }} 
        title={isEditMode ? "Edit Category" : "Add Category"} 
        footer={<><Button variant="ghost" onClick={() => { setIsModalOpen(false); setIsEditMode(false); setFormData({}); }}>Cancel</Button><Button variant="primary" type="submit" form="addForm">Save Category</Button></>}
      >
        <form className="space-y-4" onSubmit={handleAddSubmit} id="addForm">
          <Input id="name" label="Category Name" value={formData.name || ''} onChange={handleInputChange} required />
          <Input id="description" label="Description" value={formData.description || ''} onChange={handleInputChange} required />
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Deletion" 
        footer={<><Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></>}
      >
        <p className="text-on-surface-variant mb-4">Are you sure you want to delete this category? This action cannot be undone.</p>
        {deleteCategory && (
          <div className="p-3 bg-surface-dim border border-outline-variant/50 rounded font-medium text-on-surface flex items-center gap-2">
            <Tags size={16} className="text-outline" />
            {deleteCategory.name}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Categories;