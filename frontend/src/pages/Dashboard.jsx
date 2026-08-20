import React, { useState, useEffect } from 'react';
import { dashboardData as fallbackDashboardData } from '../data/dashboardData';
import { productsData as fallbackProductsData } from '../data/productsData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import {
  Package, Layers, DollarSign, AlertTriangle, XOctagon, ShoppingCart, Truck, 
  Warehouse, ArrowDownRight, ArrowUpRight, Repeat, GitCompare, ArrowDownCircle,
  Plus, Search, RefreshCw, Eye
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

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
        <p className={`text-[11px] font-medium ${subtitle.includes('↑') ? 'text-green-300' : subtitle.includes('↓') || subtitle.includes('Critical') ? 'text-red-300' : subtitle.includes('attention') ? 'text-yellow-300' : 'text-white/70'}`}>
          {subtitle}
        </p>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white border border-white/5 shadow-inner group-hover:bg-white/20 transition-colors duration-300 shrink-0">
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [summary, setSummary] = useState(null);
  const [stockMovement, setStockMovement] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dateRange, setDateRange] = useState(30);
  
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    setIsSuccess(false);
    try {
      const [sumRes, moveRes, catRes, whRes, lowRes, actRes] = await Promise.all([
        api.get('dashboard/summary').catch(() => null),
        api.get(`dashboard/stock-movement?days=${dateRange}`).catch(() => null),
        api.get('dashboard/category-distribution').catch(() => null),
        api.get('dashboard/warehouse-utilization').catch(() => null),
        api.get('dashboard/low-stock').catch(() => null),
        api.get('dashboard/recent-activity').catch(() => null)
      ]);

      setSummary(sumRes?.data || null);
      setStockMovement(moveRes?.data?.length > 0 ? moveRes.data : fallbackDashboardData.stockInVsOut);
      setCategoryDist(catRes?.data?.length > 0 ? catRes.data : fallbackDashboardData.inventoryByCategory);
      setWarehouses(whRes?.data?.length > 0 ? whRes.data : fallbackDashboardData.warehouseUtilization.map(w => ({
        warehouse: w.name,
        capacity: w.capacity,
        used: w.current,
        utilization_percentage: (w.current / w.capacity) * 100,
        status: (w.current / w.capacity) * 100 > 90 ? 'Critical' : 'Healthy'
      })));
      setLowStock(lowRes?.data?.length > 0 ? lowRes.data : fallbackProductsData.filter(p => p.stock > 0 && p.stock <= (p.minStock || 10)).slice(0, 4).map(p => ({
        product: p.name,
        sku: p.sku,
        warehouse: p.warehouse || 'N/A',
        available_stock: p.stock,
        minimum_stock: p.minStock || 10,
        status: 'Low Stock'
      })));
      setRecentActivity(actRes?.data?.length > 0 ? actRes.data : fallbackDashboardData.recentActivity.map(a => ({
        id: a.id,
        type: a.type,
        product: a.item,
        quantity: a.qty,
        time: a.date,
        warehouse: 'Main WH'
      })));
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const handleCardClick = (title) => {
    setSelectedCard(prev => prev === title ? null : title);
  };

  const getActivityIcon = (type) => {
    if (type.includes('Received') || type.includes('Receipt') || type.includes('IN')) return <ArrowDownRight className="text-success" size={18} />;
    if (type.includes('Dispatched') || type.includes('Delivery') || type.includes('OUT')) return <ArrowUpRight className="text-error" size={18} />;
    if (type.includes('Transfer')) return <Repeat className="text-warning" size={18} />;
    if (type.includes('Adjustment')) return <GitCompare className="text-warning" size={18} />;
    return <Package size={18} className="text-outline" />;
  };

  const PIE_COLORS = ['#0284c7', '#0d9488', '#f59e0b', '#ef4444', '#64748b'];
  const STOCK_IN_COLOR = '#0d9488'; 
  const STOCK_OUT_COLOR = '#f43f5e'; 

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[400px]">
      <RefreshCw className="animate-spin mb-4 text-primary" size={32} />
      <p>Loading Dashboard...</p>
    </div>;
  }

  const kpi = summary || {
    total_products: fallbackDashboardData.kpi.totalProducts,
    total_stock: fallbackDashboardData.kpi.totalStock,
    inventory_value: fallbackDashboardData.kpi.inventoryValue,
    low_stock_count: fallbackDashboardData.kpi.lowStock,
    out_of_stock_count: fallbackDashboardData.kpi.outOfStock,
    pending_orders: fallbackDashboardData.kpi.pendingOrders,
    purchase_orders: fallbackDashboardData.kpi.purchaseOrders,
    warehouse_count: fallbackDashboardData.kpi.warehouses
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1400px] mx-auto">
      <PageHeader 
        title="Inventory Dashboard" 
        subtitle="Overview of your current inventory, stock levels, and recent operations."
        action={
          <>
            <Button 
              variant="white"
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${isSuccess ? 'text-success' : ''}`}
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> 
              {isRefreshing ? 'Refreshing...' : isSuccess ? 'Updated Successfully' : 'Live Updates'}
            </Button>
            <Button variant="white" onClick={() => navigate('/products')} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold">
              <Search size={16} /> Browse Inventory
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Products" value={kpi.total_products} subtitle="Active catalog items" icon={Package} isSelected={selectedCard === "Total Products"} onClick={() => handleCardClick("Total Products")} />
        <StatCard title="Total Stock" value={kpi.total_stock.toLocaleString()} subtitle="Units across all locations" icon={Layers} isSelected={selectedCard === "Total Stock"} onClick={() => handleCardClick("Total Stock")} />
        <StatCard title="Inventory Value" value={typeof kpi.inventory_value === 'number' ? `$${kpi.inventory_value.toLocaleString()}` : kpi.inventory_value} subtitle="Estimated current value" icon={DollarSign} isSelected={selectedCard === "Inventory Value"} onClick={() => handleCardClick("Inventory Value")} />
        <StatCard title="Low Stock" value={kpi.low_stock_count} subtitle="Items need attention" icon={AlertTriangle} onClick={() => navigate('/products', { state: { stockFilter: 'Low Stock' } })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Out of Stock" value={kpi.out_of_stock_count} subtitle="Critical action required" icon={XOctagon} onClick={() => navigate('/products', { state: { stockFilter: 'Out of Stock' } })} />
        <StatCard title="Pending Orders" value={kpi.pending_orders} subtitle="Ready for fulfillment" icon={ShoppingCart} isSelected={selectedCard === "Pending Orders"} onClick={() => handleCardClick("Pending Orders")} />
        <StatCard title="Purchase Orders" value={kpi.purchase_orders} subtitle="Expected deliveries" icon={Truck} isSelected={selectedCard === "Purchase Orders"} onClick={() => handleCardClick("Purchase Orders")} />
        <StatCard title="Warehouses" value={kpi.warehouse_count} subtitle="All operational" icon={Warehouse} isSelected={selectedCard === "Warehouses"} onClick={() => handleCardClick("Warehouses")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-on-surface">Stock Movement</h3>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(Number(e.target.value))}
              disabled={isRefreshing}
              className="bg-surface border border-outline-variant rounded-md px-2 py-1 text-sm text-on-surface outline-none focus:border-primary disabled:opacity-50"
            >
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={90}>3 Months</option>
              <option value={365}>1 Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMovement} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                <XAxis dataKey={stockMovement[0]?.month ? 'month' : 'date'} axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: isDark ? '#334155' : '#f1f5f9'}} contentStyle={{backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '8px', border: '1px solid ' + (isDark ? '#334155' : '#e2e8f0'), boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: isDark ? '#f8fafc' : '#0f172a'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey={stockMovement[0]?.stockIn !== undefined ? 'stockIn' : 'in'} name="Stock In" fill={STOCK_IN_COLOR} radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey={stockMovement[0]?.stockOut !== undefined ? 'stockOut' : 'out'} name="Stock Out" fill={STOCK_OUT_COLOR} radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col relative z-10">
          <h3 className="text-base font-semibold text-on-surface mb-6">Category Distribution</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                  {categoryDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '8px', border: '1px solid ' + (isDark ? '#334155' : '#e2e8f0'), color: isDark ? '#f8fafc' : '#0f172a'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
            {categoryDist.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: PIE_COLORS[idx % PIE_COLORS.length]}}></span>
                {cat.name} ({cat.value})
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-on-surface">Warehouse Utilization</h3>
            <Button variant="ghost" onClick={() => navigate('/warehouses')} className="text-xs text-primary hover:bg-outline-variant/10 px-2 py-1">View All &rarr;</Button>
          </div>
          <div className="space-y-5">
            {warehouses.length > 0 ? warehouses.map((w, i) => {
              const percentage = w.utilization_percentage;
              let statusLabel = w.status;
              let color = 'bg-success';
              if (percentage >= 90) { color = 'bg-error'; }
              else if (percentage >= 70) { color = 'bg-warning'; }

              return (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-sm font-semibold text-on-surface block">{w.warehouse}</span>
                      <span className={`text-xs font-medium ${percentage >= 90 ? 'text-error' : 'text-on-surface-variant'}`}>{statusLabel}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-on-surface-variant">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                    <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            }) : <p className="text-sm text-on-surface-variant">No warehouse data available.</p>}
          </div>
        </Card>

        <Card className="p-6 relative z-10">
          <h3 className="text-base font-semibold text-on-surface mb-6">Recent Activity</h3>
          <div className="space-y-5">
            {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
              <div key={activity.id || idx} className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-surface-variant rounded-full shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-on-surface truncate">{activity.type}</p>
                    <p className="text-xs text-outline whitespace-nowrap ml-2">
                      {new Date(activity.time).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                    <span className="font-medium text-on-surface">{activity.product}</span> • {activity.quantity > 0 ? '+' : ''}{activity.quantity} units
                  </p>
                </div>
              </div>
            )) : <p className="text-sm text-on-surface-variant">No recent activity.</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-on-surface">Low Stock Items</h3>
            <Button variant="ghost" onClick={() => navigate('/products')} className="text-xs text-primary hover:bg-outline-variant/10 px-2 py-1">View All</Button>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold text-right">Available</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-sm">
                {lowStock.length > 0 ? lowStock.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-outline-variant/10 transition-colors">
                    <td className="py-3 font-medium text-on-surface">{item.product}</td>
                    <td className="py-3 text-on-surface-variant">{item.sku}</td>
                    <td className="py-3 text-right tabular-nums text-on-surface-variant">{item.available_stock} <span className="text-xs text-outline ml-1">/ {item.minimum_stock||10}</span></td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Out of Stock' ? 'bg-error-container text-error' : 'bg-warning-container text-warning'}`}>{item.status}</span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="relative group inline-block">
                        <button onClick={() => navigate('/products')} className="p-1.5 text-primary hover:bg-outline-variant/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                          <Eye size={18} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-on-surface bg-surface border border-outline-variant rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-20">
                          View Product
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="py-8 text-center text-on-surface-variant text-sm">No low stock items. All inventory levels healthy.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 relative z-10">
          <h3 className="text-base font-semibold text-on-surface mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => navigate('/products')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-outline-variant/10 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <Plus size={16} className="text-success mr-2" /> Add Product
            </Button>
            <Button onClick={() => navigate('/purchase-orders')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-outline-variant/10 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <Plus size={16} className="text-success mr-2" /> New Purchase
            </Button>
            <Button onClick={() => navigate('/transfers')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-outline-variant/10 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <Repeat size={16} className="text-warning mr-2" /> Stock Transfer
            </Button>
            <Button onClick={() => navigate('/adjustments')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-outline-variant/10 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <GitCompare size={16} className="text-warning mr-2" /> Stock Adjustment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
