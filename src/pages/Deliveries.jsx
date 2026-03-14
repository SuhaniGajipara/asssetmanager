import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, ArrowUpCircle, Search, Calendar, User, Package, Warehouse as WarehouseIcon } from 'lucide-react';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    destination: '',
    warehouse: '',
    items: [{ product: '', quantity: 1 }]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, wRes, pRes] = await Promise.all([
        api.get('deliveries/'),
        api.get('system/warehouses/'),
        api.get('products/')
      ]);
      setDeliveries(dRes.data);
      setWarehouses(wRes.data);
      setProducts(pRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        destination: formData.destination,
        warehouse: formData.warehouse,
        products: formData.items.map(item => ({
          product: item.product,
          quantity: parseInt(item.quantity)
        }))
      };
      await api.post('deliveries/', payload);
      setShowAddForm(false);
      setFormData({ destination: '', warehouse: '', items: [{ product: '', quantity: 1 }] });
      fetchData();
    } catch (err) {
      console.error('Error creating delivery:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Deliveries</h1>
          <p className="text-gray-500 mt-1">Record outgoing stock from warehouses to customers or destinations.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          {showAddForm ? 'Cancel' : 'New Delivery'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Delivery</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Destination / Customer</label>
                <input
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Retail Store #5"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Source Warehouse</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Items</label>
                <button 
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
              
              {formData.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Product</label>
                    <select
                      className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={item.product}
                      onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                      required
                    >
                      <option value="">Select Product (SKU)</option>
                      {products.map(p => <option key={p.id} value={p.sku}>{p.name} ({p.sku})</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Dispatch Delivery
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Source Wh</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                  No deliveries found.
                </td>
              </tr>
            ) : (
              deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle size={16} className="text-orange-500" />
                      <span className="text-sm font-mono font-bold text-gray-900">#DEL-{d.id.toString().padStart(4, '0')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{d.destination}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <WarehouseIcon size={14} />
                      {warehouses.find(w => w.id === d.warehouse)?.name || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {d.products.length} types
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Calendar size={14} />
                      {new Date(d.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deliveries;
