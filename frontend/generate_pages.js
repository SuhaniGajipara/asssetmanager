import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  { name: 'Categories', title: 'Categories', desc: 'Manage product categories and classifications.', columns: '["Category", "Description", "Products Count", "Total Stock", "Status", "Actions"]' },
  { name: 'Warehouses', title: 'Warehouses', desc: 'Manage your storage locations and capacities.', columns: '["Warehouse", "Location", "Manager", "Capacity", "Current Stock", "Utilization", "Status", "Actions"]' },
  { name: 'StockLevels', title: 'Stock Levels', desc: 'Monitor available and reserved stock across locations.', columns: '["Product", "SKU", "Warehouse", "Available Stock", "Reserved Stock", "Minimum Stock", "Status"]' },
  { name: 'StockMovements', title: 'Stock Movements', desc: 'Track all inbound and outbound stock activity.', columns: '["Date", "Product", "SKU", "Movement Type", "Quantity", "From", "To", "Reference", "User"]' },
  { name: 'SalesOrders', title: 'Sales Orders', desc: 'Manage customer orders and fulfillment status.', columns: '["Order ID", "Customer", "Items", "Quantity", "Total", "Payment", "Status", "Date", "Actions"]' },
  { name: 'OrderDetails', title: 'Order Details', desc: 'View complete order information and timeline.', columns: '[]' },
  { name: 'PurchaseOrders', title: 'Purchase Orders', desc: 'Manage inbound orders from suppliers.', columns: '["PO Number", "Supplier", "Items", "Total Amount", "Expected Date", "Status", "Actions"]' },
  { name: 'PurchaseReceipts', title: 'Purchase Receipts', desc: 'Track items received against purchase orders.', columns: '["Receipt ID", "Supplier", "Destination", "Items", "Date", "Status", "Actions"]' },
  { name: 'Suppliers', title: 'Suppliers', desc: 'Manage your vendor and supplier relationships.', columns: '["Supplier", "Company", "Contact", "Email", "Products Supplied", "Orders", "Outstanding", "Status", "Actions"]' },
  { name: 'Customers', title: 'Customers', desc: 'Manage customer accounts and order history.', columns: '["Customer", "Contact", "Email", "Total Orders", "Total Purchase", "Outstanding", "Last Order", "Status", "Actions"]' },
  { name: 'Users', title: 'Users', desc: 'Manage system users and their access levels.', columns: '["Name", "Email", "Role", "Department", "Status", "Last Login", "Actions"]' },
  { name: 'RolesPermissions', title: 'Roles & Permissions', desc: 'Configure access controls and user capabilities.', columns: '["Role", "Description", "Users", "Permissions", "Actions"]' },
  { name: 'ReportsDashboard', title: 'Reports Dashboard', desc: 'Analyze inventory metrics and business performance.', columns: '[]' },
  { name: 'Support', title: 'Support', desc: 'Get help and contact the support team.', columns: '[]' }
];

const template = (name, title, desc, columns) => `import React from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { SearchBox } from '../components/SearchBox';
import EmptyState from '../components/EmptyState';
import { Plus } from 'lucide-react';

const ${name} = () => {
  const columns = ${columns};
  
  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="${title}" 
        subtitle="${desc}"
        action={
          <Button className="bg-[#00366B] hover:bg-[#325F9C] text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors">
            <Plus size={18} />
            Add New
          </Button>
        }
      />

      <Card className="flex flex-col bg-white border border-[#C3C6D1] rounded-lg shadow-sm min-h-[400px]">
        <div className="p-4 border-b border-[#C3C6D1]/50 bg-[#F8F9FF] flex items-center justify-between gap-4 rounded-t-lg">
          <div className="w-full max-w-sm">
            <SearchBox placeholder="Search..." />
          </div>
        </div>
        
        {columns.length > 0 ? (
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
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <EmptyState 
                      title="No data found" 
                      description="There are no records to display here yet." 
                      actionLabel="Add New" 
                      onAction={() => console.log('Action')}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState 
              title="Coming Soon" 
              description="This detailed view is under construction." 
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
  fs.writeFileSync(path.join(__dirname, 'src/pages', p.name + '.jsx'), template(p.name, p.title, p.desc, p.columns));
});
console.log('Pages generated!');
