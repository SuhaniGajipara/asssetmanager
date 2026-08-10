export const dashboardData = {
  kpi: {
    totalProducts: 1520,
    totalStock: 45000,
    lowStock: 12,
    outOfStock: 3,
    inventoryValue: '$125,000',
    pendingOrders: 45,
    purchaseOrders: 8,
    warehouses: 3
  },
  stockInVsOut: [
    { month: 'Jan', stockIn: 4000, stockOut: 2400 },
    { month: 'Feb', stockIn: 3000, stockOut: 1398 },
    { month: 'Mar', stockIn: 2000, stockOut: 9800 },
    { month: 'Apr', stockIn: 2780, stockOut: 3908 },
    { month: 'May', stockIn: 1890, stockOut: 4800 },
    { month: 'Jun', stockIn: 2390, stockOut: 3800 },
    { month: 'Jul', stockIn: 3490, stockOut: 4300 }
  ],
  inventoryByCategory: [
    { name: 'Electronics', value: 400 },
    { name: 'Wearables', value: 300 },
    { name: 'Furniture', value: 300 },
    { name: 'Accessories', value: 200 }
  ],
  warehouseUtilization: [
    { name: 'Main Hub', current: 8500, capacity: 10000 },
    { name: 'East Store', current: 4900, capacity: 5000 },
    { name: 'West Wing', current: 3000, capacity: 7500 }
  ],
  recentActivity: [
    { id: 1, type: 'Stock Received', item: 'Wireless Earphones', qty: 500, date: '10 mins ago' },
    { id: 2, type: 'Stock Dispatched', item: 'Ergonomic Chair', qty: 20, date: '1 hour ago' },
    { id: 3, type: 'Stock Transfer', item: 'USB-C Cable', qty: 500, date: '3 hours ago' },
    { id: 4, type: 'Purchase Received', item: 'Smart Watch Pro', qty: 15, date: 'Yesterday' }
  ]
};
