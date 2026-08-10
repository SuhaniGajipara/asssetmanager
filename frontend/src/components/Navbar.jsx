import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme, toggleMobileMenu } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const dummyNotifications = [
    { id: 1, text: "15 Low Stock Items", time: "10 mins ago", color: "text-warning", bg: "bg-warning-container", border: "border-warning/30" },
    { id: 2, text: "4 Out of Stock", time: "1 hour ago", color: "text-error", bg: "bg-error-container", border: "border-error/30" },
    { id: 3, text: "3 Pending Purchase Orders", time: "2 hours ago", color: "text-primary", bg: "bg-primary-container", border: "border-primary/30" },
    { id: 4, text: "5 Orders Received", time: "5 hours ago", color: "text-secondary", bg: "bg-primary-container", border: "border-secondary/30" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-surface flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 gap-4 border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button
          className="md:hidden p-2 -ml-2 text-on-surface hover:bg-surface-dim rounded-full"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} />
        </button>

        <div className="relative w-full max-w-md hidden md:block">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-4 pr-10 py-2.5 h-10 bg-surface border border-outline-variant rounded-full focus:ring-1 focus:ring-primary focus:border-primary text-sm placeholder:text-outline transition-colors outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
            <Search size={18} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex p-2 rounded-full border border-outline-variant bg-surface text-on-surface-variant hover:text-primary hover:border-primary transition-colors items-center gap-2"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-surface text-on-surface-variant hover:text-primary hover:border-primary rounded-full transition-colors relative border border-outline-variant"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-md shadow-xl border border-outline-variant overflow-hidden z-50">
              <div className="p-3 bg-surface-dim border-b border-outline-variant/50 flex justify-between items-center">
                <h3 className="font-semibold text-on-surface">Notifications</h3>
                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{dummyNotifications.length} New</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {dummyNotifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-outline-variant/30 hover:bg-surface-dim transition-colors cursor-pointer flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.bg} border ${notif.border}`}></div>
                    <div>
                      <p className={`text-sm font-medium ${notif.color}`}>{notif.text}</p>
                      <p className="text-xs text-outline mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center bg-surface-dim border-t border-outline-variant/50 hover:bg-primary-container transition-colors cursor-pointer text-primary text-sm font-semibold">
                View All
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
