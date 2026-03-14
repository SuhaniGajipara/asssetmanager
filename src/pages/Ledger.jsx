import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History, Search, ArrowDownCircle, ArrowUpCircle, Repeat, GitCompare, Calendar, Package } from 'lucide-react';

const Ledger = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        api.get('ledger/'),
        api.get('products/')
      ]);
      setMovements(mRes.data);
      setProducts(pRes.data);
    } catch (err) {
      console.error('Error fetching ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'RECEIPT': return <ArrowDownCircle className="text-emerald-500" size={18} />;
      case 'DELIVERY': return <ArrowUpCircle className="text-orange-500" size={18} />;
      case 'TRANSFER': return <Repeat className="text-blue-500" size={18} />;
      case 'ADJUSTMENT': return <GitCompare className="text-amber-500" size={18} />;
      default: return <History className="text-gray-400" size={18} />;
    }
  };

  const filteredMovements = movements.filter(m => {
    const productName = products.find(p => p.id === m.product)?.name || '';
    return productName.toLowerCase().includes(filter.toLowerCase()) || 
           m.operation_type.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Ledger</h1>
          <p className="text-gray-500 mt-1">Chronological history of all stock movements and operations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Filter by product or type..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Qty Change</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Source / Destination</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                  No movements found matching your filter.
                </td>
              </tr>
            ) : (
              filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getIcon(m.operation_type)}
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{m.operation_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {products.find(p => p.id === m.product)?.name || 'Unknown Product'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-mono font-bold ${m.quantity > 0 ? 'text-emerald-600' : m.quantity < 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 leading-tight">
                      {m.source_location && <div className="mb-0.5"><span className="font-bold text-[10px] text-gray-300 mr-1">FROM</span> {m.source_location}</div>}
                      {m.destination_location && <div><span className="font-bold text-[10px] text-gray-300 mr-1">TO</span> {m.destination_location}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 font-medium">{new Date(m.date).toLocaleDateString()}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{new Date(m.date).toLocaleTimeString()}</span>
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

export default Ledger;
