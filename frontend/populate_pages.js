import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  { 
    name: 'Categories', title: 'Categories', desc: 'Manage product categories and classifications.', 
    columns: '["Category", "Description", "Products Count", "Total Stock", "Status", "Actions"]',
    dataFile: 'categoriesData', dataVar: 'categoriesData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.name}</td>
      <td className="px-6 py-4 text-[#424750]">{row.description}</td>
      <td className="px-6 py-4 font-medium text-[#325F9C]">{row.productsCount}</td>
      <td className="px-6 py-4 text-[#424750]">{row.totalStock}</td>
      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-[#eaf1ff] text-[#006D37]">{row.status}</span></td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">Edit | Delete</td>
    `
  },
  { 
    name: 'Warehouses', title: 'Warehouses', desc: 'Manage your storage locations and capacities.', 
    columns: '["Warehouse", "Location", "Manager", "Capacity", "Current Stock", "Utilization", "Status", "Actions"]',
    dataFile: 'warehousesData', dataVar: 'warehousesData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.name}</td>
      <td className="px-6 py-4 text-[#424750]">{row.location}</td>
      <td className="px-6 py-4 text-[#424750]">{row.manager}</td>
      <td className="px-6 py-4 font-medium">{row.capacity}</td>
      <td className="px-6 py-4 font-medium text-[#325F9C]">{row.currentStock}</td>
      <td className="px-6 py-4 text-[#424750]">{row.utilization}%</td>
      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-[#eaf1ff] text-[#006D37]">{row.status}</span></td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">View</td>
    `
  },
  { 
    name: 'StockLevels', title: 'Stock Levels', desc: 'Monitor available and reserved stock across locations.', 
    columns: '["Product", "SKU", "Warehouse", "Available Stock", "Reserved Stock", "Minimum Stock", "Status"]',
    dataFile: 'stockData', dataVar: 'stockData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.product}</td>
      <td className="px-6 py-4 text-[#424750]">{row.sku}</td>
      <td className="px-6 py-4 text-[#424750]">{row.warehouse}</td>
      <td className="px-6 py-4 font-medium text-[#00366B]">{row.available}</td>
      <td className="px-6 py-4 font-medium text-[#D97706]">{row.reserved}</td>
      <td className="px-6 py-4 text-[#424750]">{row.minStock}</td>
      <td className="px-6 py-4">
        <span className={\`px-2 py-1 rounded text-xs font-medium \${row.status === 'In Stock' ? 'bg-[#eaf1ff] text-[#006D37]' : row.status === 'Low Stock' ? 'bg-[#ffedcc] text-[#D97706]' : 'bg-[#ffdad6] text-[#BA1A1A]'}\`}>
          {row.status}
        </span>
      </td>
    `
  },
  { 
    name: 'StockMovements', title: 'Stock Movements', desc: 'Track all inbound and outbound stock activity.', 
    columns: '["Date", "Product", "SKU", "Movement Type", "Quantity", "From", "To", "Reference", "User"]',
    dataFile: 'ledgerData', dataVar: 'ledgerData',
    rowMapping: `
      <td className="px-6 py-4 text-[#424750]">{new Date(row.timestamp).toLocaleDateString()}</td>
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.product}</td>
      <td className="px-6 py-4 text-[#424750]">{row.sku}</td>
      <td className="px-6 py-4 text-[#325F9C] font-medium">{row.movementType}</td>
      <td className={\`px-6 py-4 font-bold \${row.quantity > 0 ? 'text-[#006D37]' : 'text-[#BA1A1A]'}\`}>{row.quantity}</td>
      <td className="px-6 py-4 text-[#424750]">{row.movementType === 'Delivery' ? row.location : 'System'}</td>
      <td className="px-6 py-4 text-[#424750]">{row.movementType === 'Receipt' ? row.location : 'Customer'}</td>
      <td className="px-6 py-4 font-mono text-sm text-[#424750]">{row.reference}</td>
      <td className="px-6 py-4 text-[#424750]">{row.user}</td>
    `
  },
  { 
    name: 'SalesOrders', title: 'Sales Orders', desc: 'Manage customer orders and fulfillment status.', 
    columns: '["Order ID", "Customer", "Items", "Quantity", "Total", "Payment", "Status", "Date", "Actions"]',
    dataFile: 'ordersData', dataVar: 'ordersData',
    rowMapping: `
      <td className="px-6 py-4 font-bold text-[#325F9C]">{row.id}</td>
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.customer}</td>
      <td className="px-6 py-4 text-[#424750]">{row.items}</td>
      <td className="px-6 py-4 text-[#424750]">{row.quantity}</td>
      <td className="px-6 py-4 font-medium text-[#00366B]">\${row.total.toFixed(2)}</td>
      <td className="px-6 py-4 text-[#424750]">{row.payment}</td>
      <td className="px-6 py-4">
        <span className={\`px-2 py-1 rounded text-xs font-medium \${row.status === 'Delivered' || row.status === 'Shipped' ? 'bg-[#eaf1ff] text-[#006D37]' : 'bg-[#ffedcc] text-[#D97706]'}\`}>
          {row.status}
        </span>
      </td>
      <td className="px-6 py-4 text-[#424750]">{row.date}</td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">View</td>
    `
  },
  { 
    name: 'PurchaseOrders', title: 'Purchase Orders', desc: 'Manage inbound orders from suppliers.', 
    columns: '["PO Number", "Supplier", "Items", "Total Amount", "Expected Date", "Status", "Actions"]',
    dataFile: 'purchaseData', dataVar: 'purchaseData',
    rowMapping: `
      <td className="px-6 py-4 font-bold text-[#325F9C]">{row.id}</td>
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.supplier}</td>
      <td className="px-6 py-4 text-[#424750]">{row.items}</td>
      <td className="px-6 py-4 font-medium text-[#00366B]">\${row.total.toFixed(2)}</td>
      <td className="px-6 py-4 text-[#424750]">{row.expected}</td>
      <td className="px-6 py-4">
        <span className={\`px-2 py-1 rounded text-xs font-medium \${row.status === 'Received' ? 'bg-[#eaf1ff] text-[#006D37]' : 'bg-[#ffedcc] text-[#D97706]'}\`}>
          {row.status}
        </span>
      </td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">View</td>
    `
  },
  { 
    name: 'PurchaseReceipts', title: 'Purchase Receipts', desc: 'Track items received against purchase orders.', 
    columns: '["Receipt ID", "Supplier", "Destination", "Items", "Date", "Status", "Actions"]',
    dataFile: 'receiptsData', dataVar: 'receiptsData',
    rowMapping: `
      <td className="px-6 py-4 font-bold text-[#325F9C]">{row.id || ('REC-' + row.supplier.substring(0,3))}</td>
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.supplier}</td>
      <td className="px-6 py-4 text-[#424750]">{row.destinationWarehouse || 'Main Hub'}</td>
      <td className="px-6 py-4 text-[#424750]">{row.items || 1}</td>
      <td className="px-6 py-4 text-[#424750]">{row.date || new Date().toLocaleDateString()}</td>
      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-[#eaf1ff] text-[#006D37]">{row.status || 'Received'}</span></td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">View</td>
    `
  },
  { 
    name: 'Suppliers', title: 'Suppliers', desc: 'Manage your vendor and supplier relationships.', 
    columns: '["Supplier", "Company", "Contact", "Email", "Products Supplied", "Orders", "Outstanding", "Status", "Actions"]',
    dataFile: 'suppliersData', dataVar: 'suppliersData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.name}</td>
      <td className="px-6 py-4 text-[#424750]">{row.company}</td>
      <td className="px-6 py-4 text-[#424750]">{row.contact}</td>
      <td className="px-6 py-4 text-[#424750]">{row.email}</td>
      <td className="px-6 py-4 font-medium">{row.products}</td>
      <td className="px-6 py-4 font-medium">{row.orders}</td>
      <td className="px-6 py-4 font-medium text-[#BA1A1A]">\${row.outstanding.toFixed(2)}</td>
      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-[#eaf1ff] text-[#006D37]">{row.status}</span></td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">Edit</td>
    `
  },
  { 
    name: 'Customers', title: 'Customers', desc: 'Manage customer accounts and order history.', 
    columns: '["Customer", "Contact", "Email", "Total Orders", "Total Purchase", "Outstanding", "Last Order", "Status", "Actions"]',
    dataFile: 'customersData', dataVar: 'customersData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.name}</td>
      <td className="px-6 py-4 text-[#424750]">{row.contact}</td>
      <td className="px-6 py-4 text-[#424750]">{row.email}</td>
      <td className="px-6 py-4 font-medium">{row.totalOrders}</td>
      <td className="px-6 py-4 font-medium text-[#006D37]">\${row.totalPurchase.toFixed(2)}</td>
      <td className="px-6 py-4 font-medium text-[#BA1A1A]">\${row.outstanding.toFixed(2)}</td>
      <td className="px-6 py-4 text-[#424750]">{row.lastOrder}</td>
      <td className="px-6 py-4">
        <span className={\`px-2 py-1 rounded text-xs font-medium \${row.status === 'Active' ? 'bg-[#eaf1ff] text-[#006D37]' : 'bg-[#ffdad6] text-[#BA1A1A]'}\`}>
          {row.status}
        </span>
      </td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">Edit</td>
    `
  },
  { 
    name: 'Users', title: 'Users', desc: 'Manage system users and their access levels.', 
    columns: '["Name", "Email", "Role", "Department", "Status", "Last Login", "Actions"]',
    dataFile: 'usersData', dataVar: 'usersData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.name}</td>
      <td className="px-6 py-4 text-[#424750]">{row.email}</td>
      <td className="px-6 py-4 font-medium text-[#325F9C]">{row.role}</td>
      <td className="px-6 py-4 text-[#424750]">{row.department}</td>
      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-[#eaf1ff] text-[#006D37]">{row.status}</span></td>
      <td className="px-6 py-4 text-[#424750]">{row.lastLogin}</td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">Manage</td>
    `
  },
  { 
    name: 'RolesPermissions', title: 'Roles & Permissions', desc: 'Configure access controls and user capabilities.', 
    columns: '["Role", "Description", "Users", "Permissions", "Status", "Actions"]',
    dataFile: 'rolesPermissionsData', dataVar: 'rolesPermissionsData',
    rowMapping: `
      <td className="px-6 py-4 font-semibold text-[#0B1C30]">{row.role}</td>
      <td className="px-6 py-4 text-[#424750]">{row.description}</td>
      <td className="px-6 py-4 font-medium">{row.users}</td>
      <td className="px-6 py-4 text-[#325F9C] text-sm">{row.permissions}</td>
      <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium bg-[#eaf1ff] text-[#006D37]">{row.status}</span></td>
      <td className="px-6 py-4 text-[#325F9C] cursor-pointer">Edit</td>
    `
  }
];

const template = (name, title, desc, columns, dataFile, dataVar, rowMapping) => `import React, { useState } from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { SearchBox } from '../components/SearchBox';
import EmptyState from '../components/EmptyState';
import { Plus } from 'lucide-react';
import { ${dataVar} } from '../data/${dataFile}';

const ${name} = () => {
  const [data, setData] = useState(${dataVar} || []);
  const [search, setSearch] = useState('');
  const columns = ${columns};
  
  const handleAction = () => {
    console.log("Action button clicked on ${title}");
    alert("Action button clicked for ${title}! This would open a modal or navigate to a form.");
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="${title}" 
        subtitle="${desc}"
        action={
          <Button onClick={handleAction} className="bg-[#00366B] hover:bg-[#325F9C] text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors">
            <Plus size={18} />
            Add New
          </Button>
        }
      />

      <Card className="flex flex-col bg-white border border-[#C3C6D1] rounded-lg shadow-sm min-h-[400px]">
        <div className="p-4 border-b border-[#C3C6D1]/50 bg-[#F8F9FF] flex items-center justify-between gap-4 rounded-t-lg">
          <div className="w-full max-w-sm">
            <SearchBox 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..." 
            />
          </div>
        </div>
        
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#eaf1ff] border-b border-[#C3C6D1]/50 text-[#00366B] text-sm">
                  {columns.map((col, i) => (
                    <th key={i} className="py-3 px-6 font-semibold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#C3C6D1]/30 hover:bg-[#F8F9FF] transition-colors text-sm">
                    ${rowMapping}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState 
              title="No data found" 
              description="There are no records to display here yet." 
              actionLabel="Add New" 
              onAction={handleAction}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ${name};
`;

pages.forEach(p => {
  fs.writeFileSync(path.join(__dirname, 'src/pages', p.name + '.jsx'), template(p.name, p.title, p.desc, p.columns, p.dataFile, p.dataVar, p.rowMapping));
});
console.log('Pages populated with data!');
