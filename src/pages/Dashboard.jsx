import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, TrendingUp, AlertTriangle, Clock, ArrowDownCircle, ArrowUpCircle, Repeat, GitCompare } from 'lucide-react';

function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        totalCategories: 0,
        totalWarehouses: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [pRes, lRes, wRes, cRes] = await Promise.all([
                api.get('products/'),
                api.get('ledger/'),
                api.get('system/warehouses/'),
                api.get('system/categories/')
            ]);

            const products = pRes.data;
            const ledger = lRes.data;

            setStats({
                totalProducts: products.length,
                lowStock: products.filter(p => p.initial_stock <= p.reorder_level).length,
                totalCategories: cRes.data.length,
                totalWarehouses: wRes.data.length
            });

            setRecentActivity(ledger.slice(0, 5));
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'RECEIPT': return <ArrowDownCircle className="text-emerald-500" size={16} />;
            case 'DELIVERY': return <ArrowUpCircle className="text-orange-500" size={16} />;
            case 'TRANSFER': return <Repeat className="text-blue-500" size={16} />;
            case 'ADJUSTMENT': return <GitCompare className="text-amber-500" size={16} />;
            default: return <Clock className="text-gray-400" size={16} />;
        }
    };

    const dashboardStats = [
        { label: 'Total Products', value: stats.totalProducts, change: 'In Stock', icon: BarChart, color: 'blue' },
        { label: 'Low Stock Items', value: stats.lowStock, change: 'Action Needed', icon: AlertTriangle, color: 'amber' },
        { label: 'Categories', value: stats.totalCategories, change: 'System', icon: TrendingUp, color: 'emerald' },
        { label: 'Warehouses', value: stats.totalWarehouses, change: 'Active', icon: Clock, color: 'indigo' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all text-sm flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        Refresh
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-sm flex items-center gap-2">
                        <TrendingUp size={16} />
                        Live Reports
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}>
                        <stat.icon size={22} />
                      </div>
                      <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${stat.label.includes('Low') ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                  </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BarChart className="text-blue-600" size={22} />
                        Stock Utilization
                    </h2>
                    <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-400">
                        Visual reports reflect your recent operations.
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-sm text-blue-700 font-medium italic text-center">
                           "Real-time tracking of Receipts, Deliveries, and Transfers is now active."
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {recentActivity.length > 0 ? recentActivity.map((activity) => (
                          <div key={activity.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                              {getIcon(activity.operation_type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{activity.operation_type}</p>
                                    <span className={`text-[10px] font-bold ${activity.quantity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {activity.quantity > 0 ? `+${activity.quantity}` : activity.quantity}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleDateString()} • {activity.destination_location || activity.source_location || 'Ledger'}</p>
                            </div>
                          </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No recent activity found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
