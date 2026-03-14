import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, GitCompare, Search, Calendar, Package, Warehouse as WarehouseIcon, AlertCircle } from 'lucide-react';

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    product: '',
    warehouse: '',
    counted_quantity: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, wRes, pRes] = await Promise.all([
        api.get('adjustments/'),
        api.get('system/warehouses/'),
        api.get('products/')
      ]);
      setAdjustments(aRes.data);
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
    const product = products.find(p => p.id === parseInt(formData.product));
    if (!product) return;

    const system_quantity = product.initial_stock;
    const difference = formData.counted_quantity - system_quantity;

    try {
      const payload = {
        ...formData,
        system_quantity,
        difference
      };
      await api.post('adjustments/', payload);
      setShowAddForm(false);
      setFormData({ product: '', warehouse: '', counted_quantity: 0 });
      fetchData();
    } catch (err) {
      console.error('Error creating adjustment:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Adjustments</h1>
          <p className="text-gray-500 mt-1">Reconcile system quantities with physical counts.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} />
          {showAddForm ? 'Cancel' : 'New Adjustment'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Adjustment</h2>
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
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current: {p.initial_stock})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Warehouse</label>
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
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Physical Count</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.counted_quantity}
                onChange={(e) => setFormData({ ...formData, counted_quantity: e.target.value })}
                required
              />
            </div>
            <div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Apply Adjustment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">System</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Counted</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Adjustment</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {adjustments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                  No adjustments found.
                </td>
              </tr>
            ) : (
              adjustments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <GitCompare size={16} className="text-amber-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {products.find(p => p.id === a.product)?.name || 'Product'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {warehouses.find(w => w.id === a.warehouse)?.name || 'Warehouse'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{a.system_quantity}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{a.counted_quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${a.difference >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {a.difference >= 0 ? `+${a.difference}` : a.difference}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(a.created_at).toLocaleDateString()}
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

export default Adjustments;
