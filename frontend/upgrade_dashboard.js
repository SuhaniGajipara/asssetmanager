import fs from 'fs';
import path from 'path';

const dashboardContent = `import React from 'react';
import { dashboardData } from '../data/dashboardData';
import { productsData } from '../data/productsData';
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
  Plus, Search
} from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, highlight = false }) => (
  <Card className={\`relative overflow-hidden p-6 transition-all hover:border-primary group \${highlight ? 'border-l-4 border-primary' : 'border-l-4 border-transparent'}\`}>
    <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-on-surface-variant text-sm font-semibold tracking-wide uppercase mb-1">{title}</p>
        <h3 className="text-on-surface text-3xl font-bold mb-2 tabular-nums">{value}</h3>
        <p className={\`text-xs font-medium \${subtitle.includes('↑') ? 'text-info' : subtitle.includes('↓') || subtitle.includes('Critical') ? 'text-error' : subtitle.includes('attention') ? 'text-warning' : 'text-on-surface-variant'}\`}>
          {subtitle}
        </p>
      </div>
      <div className={\`w-10 h-10 rounded-lg flex items-center justify-center \${colorClass}\`}>
        <Icon size={20} />
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { kpi, stockInVsOut, inventoryByCategory, warehouseUtilization, recentActivity } = dashboardData;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Stock Received': return <ArrowDownRight className="text-info" size={18} />;
      case 'Stock Dispatched': return <ArrowUpRight className="text-primary" size={18} />;
      case 'Stock Transfer': return <Repeat className="text-secondary" size={18} />;
      case 'Stock Adjustment': return <GitCompare className="text-warning" size={18} />;
      case 'Purchase Received': return <ArrowDownCircle className="text-primary" size={18} />;
      default: return <Package size={18} className="text-outline" />;
    }
  };

  const PIE_COLORS = ['#2563eb', '#6366f1', '#475569', '#38bdf8', '#818cf8'];

  const lowStockItems = productsData ? productsData.filter(p => p.stock > 0 && p.stock <= (p.minStock || 10)).slice(0, 4) : [];

  return (
    <div className="space-y-8 pb-12 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Inventory Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">Overview of your current inventory, stock levels, and recent operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-sm text-on-surface font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-info"></span> Live Updates
          </div>
          <Button onClick={() => navigate('/products')} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md shadow-sm">
            <Search size={16} /> Browse Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={kpi.totalProducts} subtitle="↑ 4.2% vs last month" icon={Package} colorClass="bg-primary-container text-primary" highlight />
        <StatCard title="Total Stock" value={kpi.totalStock.toLocaleString()} subtitle="↑ 1.8% vs last month" icon={Layers} colorClass="bg-secondary-container text-secondary" />
        <StatCard title="Inventory Value" value={kpi.inventoryValue} subtitle="↑ $12,450 this quarter" icon={DollarSign} colorClass="bg-surface-variant text-on-surface-variant" />
        <StatCard title="Low Stock" value={kpi.lowStock} subtitle="Needs attention" icon={AlertTriangle} colorClass="bg-warning-container text-warning" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Out of Stock" value={kpi.outOfStock} subtitle="Critical action required" icon={XOctagon} colorClass="bg-error-container text-error" />
        <StatCard title="Pending Orders" value={kpi.pendingOrders} subtitle="Ready for fulfillment" icon={ShoppingCart} colorClass="bg-primary-container text-primary" />
        <StatCard title="Purchase Orders" value={kpi.purchaseOrders} subtitle="Expected this week" icon={Truck} colorClass="bg-secondary-container text-secondary" />
        <StatCard title="Warehouses" value={kpi.warehouses} subtitle="All operational" icon={Warehouse} colorClass="bg-info-container text-info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <h3 className="text-base font-semibold text-on-surface mb-6">Stock Movement (In vs Out)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockInVsOut} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="stockIn" name="Stock In" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h3 className="text-base font-semibold text-on-surface mb-6">Category Distribution</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={inventoryByCategory} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
            {inventoryByCategory.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: PIE_COLORS[idx % PIE_COLORS.length]}}></span>
                {cat.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-base font-semibold text-on-surface mb-6">Warehouse Utilization</h3>
          <div className="space-y-5">
            {warehouseUtilization.map((w, i) => {
              const percentage = (w.current / w.capacity) * 100;
              let statusLabel = 'Healthy';
              let color = 'bg-info';
              if (percentage > 90) { color = 'bg-error'; statusLabel = 'Critical'; }
              else if (percentage > 75) { color = 'bg-warning'; statusLabel = 'Warning'; }

              return (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-sm font-semibold text-on-surface block">{w.name}</span>
                      <span className={\`text-xs font-medium \${percentage > 90 ? 'text-error' : 'text-on-surface-variant'}\`}>{statusLabel}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-on-surface-variant">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                    <div className={\`\${color} h-full rounded-full transition-all duration-700\`} style={{ width: \`\${percentage}%\` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-on-surface mb-6">Recent Activity</h3>
          <div className="space-y-5">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-0.5 p-2 bg-surface-variant rounded-full shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-on-surface truncate">{activity.type}</p>
                    <p className="text-xs text-outline whitespace-nowrap ml-2">{activity.date}</p>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                    <span className="font-medium text-on-surface">{activity.item}</span> • {activity.qty > 0 ? '+' : ''}{activity.qty} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-on-surface">Low Stock Items</h3>
            <Button variant="ghost" onClick={() => navigate('/products')} className="text-xs text-primary hover:bg-primary/5 px-2 py-1">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold text-right">Available</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-sm">
                {lowStockItems.length > 0 ? lowStockItems.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-surface-dim transition-colors">
                    <td className="py-3 font-medium text-on-surface">{item.name}</td>
                    <td className="py-3 text-on-surface-variant">{item.sku}</td>
                    <td className="py-3 text-right tabular-nums text-on-surface-variant">{item.stock} <span className="text-xs text-outline ml-1">/ {item.minStock||10}</span></td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-warning-container text-warning">Low</span>
                    </td>
                    <td className="py-3 text-right">
                      <Button onClick={() => navigate('/products')} variant="ghost" className="text-xs text-primary px-2 py-1 h-auto">View</Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="py-4 text-center text-on-surface-variant text-sm">No low stock items.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-base font-semibold text-on-surface mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => navigate('/products')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-primary/5 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <Plus size={16} className="text-primary mr-2" /> Add Product
            </Button>
            <Button onClick={() => navigate('/purchase-orders')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-primary/5 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <Plus size={16} className="text-primary mr-2" /> New Purchase
            </Button>
            <Button onClick={() => navigate('/transfers')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-primary/5 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <Repeat size={16} className="text-secondary mr-2" /> Stock Transfer
            </Button>
            <Button onClick={() => navigate('/adjustments')} className="w-full justify-start border border-outline-variant/50 hover:border-primary hover:bg-primary/5 bg-surface text-on-surface shadow-sm py-3 px-4 transition-all">
              <GitCompare size={16} className="text-warning mr-2" /> Stock Adjustment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;`;

fs.writeFileSync(path.join(pagesDir, 'Dashboard.jsx'), dashboardContent);
console.log('Dashboard replaced.');
