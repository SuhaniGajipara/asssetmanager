import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';

const reportsContent = `import React, { useState } from 'react';
import { reportsData } from '../data/reportsData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { SearchBox } from '../components/SearchBox';
import { FileBarChart, Download, FileText, PieChart } from 'lucide-react';

const ReportsDashboard = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const reports = [
    { id: 'REP-8001', name: 'Monthly Sales Report', type: 'Financial', generated: '2026-08-01', size: '2.4MB' },
    { id: 'REP-8002', name: 'Stock Valuation Q2', type: 'Inventory', generated: '2026-07-01', size: '1.1MB' },
    { id: 'REP-8003', name: 'Low Stock Alert History', type: 'Inventory', generated: '2026-08-05', size: '0.8MB' },
    { id: 'REP-8004', name: 'Supplier Performance', type: 'Performance', generated: '2026-08-10', size: '1.5MB' }
  ];

  const filtered = reports.filter(r => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Reports & Analytics" subtitle="Generate and download business intelligence reports." action={<Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md"><Plus size={18} /> New Report</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-secondary">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><FileBarChart size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Inventory Reports</p><h3 className="text-xl font-bold">12</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-primary-container text-primary rounded-full"><PieChart size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Financial Reports</p><h3 className="text-xl font-bold">8</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-warning">
          <div className="p-3 bg-warning-container text-warning rounded-full"><FileText size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Performance Reports</p><h3 className="text-xl font-bold">5</h3></div>
        </Card>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim grid grid-cols-1 md:grid-cols-3 gap-4 rounded-t-lg">
          <div className="md:col-span-2"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." /></div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm outline-none">
            <option value="All">All Categories</option>
            <option value="Financial">Financial</option>
            <option value="Inventory">Inventory</option>
            <option value="Performance">Performance</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                <th className="py-3 px-6 font-semibold">Report Name</th>
                <th className="py-3 px-6 font-semibold">Category</th>
                <th className="py-3 px-6 font-semibold">Date Generated</th>
                <th className="py-3 px-6 font-semibold">Size</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface flex items-center gap-3">
                     <FileText size={18} className="text-outline"/> {row.name}
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 rounded text-xs font-medium bg-surface-variant text-on-surface-variant">{row.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{row.generated}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{row.size}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="Download"><Download size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default ReportsDashboard;`;

// Need to replace Plus with import if not there
const finalContent = reportsContent.replace("import { FileBarChart, Download, FileText, PieChart } from 'lucide-react';", "import { FileBarChart, Download, FileText, PieChart, Plus } from 'lucide-react';");

fs.writeFileSync(path.join(pagesDir, 'ReportsDashboard.jsx'), finalContent);
console.log('Updated ReportsDashboard');
