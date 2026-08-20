import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  BarChart2,
  Activity,
  ShoppingCart,
  FileText,
  Truck,
  ArrowDownCircle,
  Users,
  Repeat,
  ArrowUpCircle,
  ArrowRightLeft,
  GitCompare,
  UserCheck,
  Shield,
  PieChart,
  PhoneCall,
  Settings,
  LogOut,
  User,
  Menu,
  ChevronLeft
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = React.useContext(AuthContext);
  const { sidebarTheme, isSidebarCollapsed, toggleSidebarCollapse, isMobileMenuOpen, setIsMobileMenuOpen } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: null,
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' }
      ]
    },
    {
      title: 'INVENTORY',
      items: [
        { label: 'Products', icon: Package, path: '/products' },
        { label: 'Categories', icon: Tags, path: '/categories' },
        { label: 'Warehouses', icon: Warehouse, path: '/warehouses' },
        { label: 'Stock Levels', icon: BarChart2, path: '/stock-levels' },
        { label: 'Stock Movements', icon: Activity, path: '/stock-movements' }
      ]
    },
    {
      title: 'ORDERS',
      items: [
        { label: 'Sales Orders', icon: ShoppingCart, path: '/sales-orders' },
        { label: 'Order Details', icon: FileText, path: '/order-details' }
      ]
    },
    {
      title: 'PURCHASE',
      items: [
        { label: 'Purchase Orders', icon: Truck, path: '/purchase-orders' },
        { label: 'Purchase Receipts', icon: ArrowDownCircle, path: '/purchase-receipts' },
        { label: 'Suppliers', icon: Users, path: '/suppliers' }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Transfers', icon: Repeat, path: '/transfers' },
        { label: 'Deliveries', icon: ArrowUpCircle, path: '/deliveries' },
        { label: 'Receipts', icon: ArrowDownCircle, path: '/receipts' },
        { label: 'Adjustments', icon: GitCompare, path: '/adjustments' }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Customers', icon: UserCheck, path: '/customers' },
        { label: 'Users', icon: Users, path: '/users' },
        { label: 'Roles & Permissions', icon: Shield, path: '/roles-permissions' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Reports Dashboard', icon: PieChart, path: '/reports' }
      ]
    },
    {
      title: null,
      items: [
        { label: 'Ledger', icon: FileText, path: '/ledger' },
        { label: 'Support', icon: PhoneCall, path: '/support' },
        { label: 'Settings', icon: Settings, path: '/settings' }
      ]
    }
  ];

  const isDark = sidebarTheme === 'dark';

  // BACKUP: OLD SIDEBAR COLOR
  // const bgClass = 'bg-[#1c7f94] border-r border-[#105c6c]';
  // const textMutedClass = 'text-[#e0f2f7]';
  // const groupTitleClass = 'text-[#a8dce7]';
  
  const bgClass = 'bg-gradient-to-br from-[#2a1b54] to-[#3b2774] border-r border-[#2a1b54]/50';
  const textClass = 'text-white';
  const textMutedClass = 'text-white/70';
  const groupTitleClass = 'text-purple-300';
  const hoverClass = 'hover:text-white transition-colors';
  const activeClass = 'bg-white text-[#2a1b54] font-semibold rounded-md shadow-sm';

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${bgClass} ${textClass} ${isSidebarCollapsed ? 'w-20' : 'w-64'
          } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:relative'}`}
      >

        <div className="h-20 flex items-center justify-between px-4 border-b border-white/20">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap px-2">
              <Package className="text-white" size={28} />
              <span className={`text-xl font-bold tracking-tight text-white`}>Asset Manager</span>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="mx-auto">
              <Package className="text-white" size={28} />
            </div>
          )}
          <button
            onClick={toggleSidebarCollapse}
            className={`hidden md:flex p-1.5 rounded-full ${hoverClass} text-white/80`}
          >
            <ChevronLeft size={20} className={`transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={`md:hidden p-1.5 rounded-full ${hoverClass} text-white/80`}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b border-white/20 flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/20 text-white">
            <User size={20} />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="text-sm font-semibold truncate text-white">Admin User</h2>
              <p className={`text-xs ${textMutedClass} truncate`}>Inventory Manager</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              {!isSidebarCollapsed && group.title && (
                <h3 className={`px-3 mb-2 text-xs font-semibold tracking-wider ${groupTitleClass} uppercase`}>
                  {group.title}
                </h3>
              )}
              {isSidebarCollapsed && group.title && <div className="h-4"></div>}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md transition-all ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'} ${isActive ? activeClass : `${textMutedClass} ${hoverClass}`
                      }`
                    }
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                        {!isSidebarCollapsed && <span className={`text-sm ${isActive ? 'font-medium' : ''} whitespace-nowrap`} style={{ textShadow: 'none' }}>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full rounded-md transition-colors ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'} bg-white text-error font-semibold shadow-sm`}
            title={isSidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
