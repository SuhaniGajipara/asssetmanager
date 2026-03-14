import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  BarChart2, 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Repeat, 
  Settings, 
  LogOut,
  User,
  GitCompare
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', icon: BarChart2, path: '/' },
        { label: 'Products', icon: Package, path: '/products' },
      ]
    },
    {
      label: 'OPERATIONS',
      items: [
        { label: 'Receipts', icon: ArrowDownCircle, path: '/receipts' },
        { label: 'Deliveries', icon: ArrowUpCircle, path: '/deliveries' },
        { label: 'Transfers', icon: Repeat, path: '/transfers' },
        { label: 'Adjustments', icon: GitCompare, path: '/adjustments' },
      ]
    },
    {
      label: 'REPORTING',
      items: [
        { label: 'Stock Ledger', icon: BarChart2, path: '/ledger' },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { label: 'Settings', icon: Settings, path: '/settings' },
      ]
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          CoreInventory
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">User</p>
            <p className="text-xs text-slate-500">WAREHOUSE STAFF</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
