import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'src/data');

const products = [
  { id: 1, name: 'Wireless Earphones', sku: 'ELEC-001', category: 1, warehouse: 'Main Hub', stock: 500, minStock: 50, price: 99.99, status: 'In Stock' },
  { id: 2, name: 'Smart Watch Pro', sku: 'WEAR-001', category: 2, warehouse: 'Main Hub', stock: 15, minStock: 20, price: 199.99, status: 'Low Stock' },
  { id: 3, name: 'Ergonomic Chair', sku: 'FURN-001', category: 3, warehouse: 'East Store', stock: 0, minStock: 10, price: 299.99, status: 'Out of Stock' },
  { id: 4, name: 'USB-C Cable', sku: 'ACC-001', category: 4, warehouse: 'West Wing', stock: 1200, minStock: 100, price: 19.99, status: 'In Stock' },
  { id: 5, name: 'Leather Wallet', sku: 'ACC-002', category: 4, warehouse: 'Main Hub', stock: 45, minStock: 20, price: 49.99, status: 'In Stock' },
  { id: 6, name: 'Gaming Mouse', sku: 'ELEC-002', category: 1, warehouse: 'West Wing', stock: 150, minStock: 30, price: 59.99, status: 'In Stock' },
  { id: 7, name: 'Mechanical Keyboard', sku: 'ELEC-003', category: 1, warehouse: 'East Store', stock: 10, minStock: 15, price: 129.99, status: 'Low Stock' },
  { id: 8, name: 'Standing Desk', sku: 'FURN-002', category: 3, warehouse: 'Main Hub', stock: 25, minStock: 5, price: 499.99, status: 'In Stock' }
];

const categories = [
  { id: 1, name: 'Electronics', description: 'Gadgets and devices' },
  { id: 2, name: 'Wearables', description: 'Smart watches and fitness trackers' },
  { id: 3, name: 'Furniture', description: 'Office and home furniture' },
  { id: 4, name: 'Accessories', description: 'Cables, wallets, and small items' }
];

const warehouses = [
  { id: 1, name: 'Main Hub', location: 'New York, NY', capacity: 10000, currentLoad: 8500, manager: 'Alice Smith', status: 'Active' },
  { id: 2, name: 'East Store', location: 'Boston, MA', capacity: 5000, currentLoad: 4900, manager: 'Bob Jones', status: 'Near Capacity' },
  { id: 3, name: 'West Wing', location: 'San Francisco, CA', capacity: 7500, currentLoad: 3000, manager: 'Charlie Brown', status: 'Active' }
];

const suppliers = [
  { id: 1, name: 'TechCorp', contact: 'tech@corp.com', phone: '555-0101', rating: 4.8, status: 'Active' },
  { id: 2, name: 'FurniPlus', contact: 'sales@furniplus.com', phone: '555-0202', rating: 4.2, status: 'Active' },
  { id: 3, name: 'Global Goods', contact: 'supply@global.net', phone: '555-0303', rating: 3.5, status: 'Reviewing' }
];

const orders = [
  { id: 'ORD-1001', customer: 'Acme Corp', items: 3, total: 450.00, status: 'Processing', date: '2026-08-01' },
  { id: 'ORD-1002', customer: 'Globex', items: 1, total: 299.99, status: 'Shipped', date: '2026-08-05' },
  { id: 'ORD-1003', customer: 'Initech', items: 5, total: 1250.50, status: 'Delivered', date: '2026-08-08' }
];

const purchase = [
  { id: 'PO-2001', supplier: 'TechCorp', total: 5500.00, status: 'Pending', expectedDate: '2026-08-15' },
  { id: 'PO-2002', supplier: 'FurniPlus', total: 2400.00, status: 'Received', expectedDate: '2026-08-02' }
];

const receipts = [
  { id: 'REC-3001', poId: 'PO-2002', warehouse: 'Main Hub', receivedBy: 'John Doe', date: '2026-08-02', status: 'Completed' },
  { id: 'REC-3002', poId: 'PO-2001', warehouse: 'West Wing', receivedBy: 'Pending', date: '2026-08-15', status: 'Pending' }
];

const transfers = [
  { id: 'TRF-4001', from: 'Main Hub', to: 'East Store', items: 'Ergonomic Chair (20)', status: 'In Transit', date: '2026-08-09' },
  { id: 'TRF-4002', from: 'West Wing', to: 'Main Hub', items: 'USB-C Cable (500)', status: 'Completed', date: '2026-08-07' }
];

const deliveries = [
  { id: 'DEL-5001', orderId: 'ORD-1002', destination: 'Globex HQ', driver: 'Mike T.', status: 'Out for Delivery', date: '2026-08-10' },
  { id: 'DEL-5002', orderId: 'ORD-1003', destination: 'Initech Office', driver: 'Sarah W.', status: 'Delivered', date: '2026-08-09' }
];

const adjustments = [
  { id: 'ADJ-6001', product: 'Smart Watch Pro', type: 'Shrinkage', quantity: -2, reason: 'Damaged in transit', date: '2026-08-06', approvedBy: 'Admin' },
  { id: 'ADJ-6002', product: 'Leather Wallet', type: 'Found', quantity: 5, reason: 'Audit recount', date: '2026-08-08', approvedBy: 'Admin' }
];

const ledger = [
  { id: 'TXN-7001', type: 'Sale', amount: 1250.50, description: 'Order ORD-1003 Payment', date: '2026-08-08', status: 'Settled' },
  { id: 'TXN-7002', type: 'Purchase', amount: -2400.00, description: 'PO-2002 Payment', date: '2026-08-02', status: 'Settled' }
];

const reports = [
  { id: 'REP-8001', name: 'Monthly Sales Report', type: 'Financial', generated: '2026-08-01', size: '2.4MB' },
  { id: 'REP-8002', name: 'Stock Valuation Q2', type: 'Inventory', generated: '2026-07-01', size: '1.1MB' }
];

const customers = [
  { id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '555-1234', totalOrders: 15, status: 'Active' },
  { id: 2, name: 'Globex', email: 'sales@globex.com', phone: '555-5678', totalOrders: 3, status: 'Active' },
  { id: 3, name: 'Initech', email: 'billing@initech.com', phone: '555-9012', totalOrders: 28, status: 'Active' }
];

const dashboard = [
  { activity: 'Order ORD-1003 delivered', time: '10 mins ago', user: 'System' },
  { activity: 'Transfer TRF-4001 initiated', time: '1 hour ago', user: 'Alice S.' },
  { activity: 'New PO-2001 created', time: '3 hours ago', user: 'Admin' }
];

const writeData = (filename, varName, data) => {
  const fileContent = 'export const ' + varName + ' = ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(path.join(dataDir, filename), fileContent);
}

writeData('productsData.js', 'productsData', products);
writeData('categoriesData.js', 'categoriesData', categories);
writeData('warehousesData.js', 'warehousesData', warehouses);
writeData('suppliersData.js', 'suppliersData', suppliers);
writeData('ordersData.js', 'ordersData', orders);
writeData('purchaseData.js', 'purchaseData', purchase);
writeData('receiptsData.js', 'receiptsData', receipts);
writeData('transfersData.js', 'transfersData', transfers);
writeData('deliveriesData.js', 'deliveriesData', deliveries);
writeData('adjustmentsData.js', 'adjustmentsData', adjustments);
writeData('ledgerData.js', 'ledgerData', ledger);
writeData('reportsData.js', 'reportsData', reports);
writeData('customersData.js', 'customersData', customers);
writeData('dashboardData.js', 'dashboardData', dashboard);

console.log('Dummy data generated');
