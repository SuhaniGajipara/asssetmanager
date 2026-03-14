import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Repeat, Search, Calendar, Package, Warehouse as WarehouseIcon } from 'lucide-react';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    product: '',
    source_location: '',
    destination_location: '',
    quantity: 1
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, wRes, pRes] = await Promise.all([
        api.get('transfers/'),
        api.get('system/warehouses/'),
        api.get('products/')
      ]);
      setTransfers(tRes.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.source_location === formData.destination_location) {
      alert("Source and Destination warehouses cannot be the same.");
      return;
    }
    try {
      await api.post('transfers/', formData);
      setShowAddForm(false);
      setFormData({ product: '', source_location: '', destination_location: '', quantity: 1 });
      fetchData();
    } catch (err) {
      console.error('Error creating transfer:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Transfers</h1>
          <p className="text-gray-500 mt-1">Move products between your warehouses.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          {showAddForm ? 'Cancel' : 'New Transfer'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Transfer</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From Warehouse</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.source_location}
                onChange={(e) => setFormData({ ...formData, source_location: e.target.value })}
                required
              >
                <option value="">Source Warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">To Warehouse</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.destination_location}
                onChange={(e) => setFormData({ ...formData, destination_location: e.target.value })}
                required
              >
                <option value="">Destination Warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center whitespace-nowrap"
                >
                  Transfer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Flow</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transfers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                  No transfers found.
                </td>
              </tr>
            ) : (
              transfers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {products.find(p => p.id === t.product)?.name || 'Product'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">FROM</span>
                        <span className="font-semibold text-gray-700">
                          {warehouses.find(w => w.id === t.source_location)?.name || 'Wh A'}
                        </span>
                      </div>
                      <Repeat size={16} className="text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">TO</span>
                        <span className="font-semibold text-gray-700">
                          {warehouses.find(w => w.id === t.destination_location)?.name || 'Wh B'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold leading-none">
                      {t.quantity} Units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Calendar size={14} />
                      {new Date(t.created_at).toLocaleDateString()}
                    </div>
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

export default Transfers;
