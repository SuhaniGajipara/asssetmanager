import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages';

const ledgerContent = `import React, { useState } from 'react';
import { ledgerData } from '../data/ledgerData';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { SearchBox } from '../components/SearchBox';
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Ledger = () => {
  const [data, setData] = useState(ledgerData || []);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = data.filter(d => {
    const matchSearch = d.description?.toLowerCase().includes(search.toLowerCase()) || d.id?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalIn = data.filter(d => d.amount > 0).reduce((acc, d) => acc + d.amount, 0);
  const totalOut = data.filter(d => d.amount < 0).reduce((acc, d) => acc + Math.abs(d.amount), 0);
  const balance = totalIn - totalOut;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="General Ledger & Reports" subtitle="Financial tracking and transaction history." action={<Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-md">Generate Report</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-secondary">
          <div className="p-3 bg-primary-container text-secondary rounded-full"><TrendingUp size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Inflow</p><h3 className="text-xl font-bold text-secondary">\${totalIn.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-error">
          <div className="p-3 bg-error-container text-error rounded-full"><TrendingDown size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Total Outflow</p><h3 className="text-xl font-bold text-error">\${totalOut.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3></div>
        </Card>
        <Card className="p-4 flex items-center gap-4 border-l-4 border-primary">
          <div className="p-3 bg-surface-container text-primary rounded-full"><DollarSign size={24}/></div>
          <div><p className="text-sm text-on-surface-variant">Net Balance</p><h3 className="text-xl font-bold">\${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="p-4 border-b border-outline-variant/50 bg-surface-dim grid grid-cols-1 md:grid-cols-3 gap-4 rounded-t-lg">
            <div className="md:col-span-2"><SearchBox value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." /></div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm outline-none">
              <option value="All">All Types</option>
              <option value="Sale">Sale (Inflow)</option>
              <option value="Purchase">Purchase (Outflow)</option>
            </select>
          </div>
          
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-container border-b border-outline-variant/50 text-primary text-sm">
                  <th className="py-3 px-6 font-semibold">Transaction ID</th>
                  <th className="py-3 px-6 font-semibold">Date</th>
                  <th className="py-3 px-6 font-semibold">Description</th>
                  <th className="py-3 px-6 font-semibold">Type</th>
                  <th className="py-3 px-6 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-dim transition-colors">
                    <td className="px-6 py-4 font-semibold text-on-surface">{row.id}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{row.date}</td>
                    <td className="px-6 py-4 text-on-surface">{row.description}</td>
                    <td className="px-6 py-4">
                      <span className={\`px-2 py-1 rounded text-xs font-medium \${row.type === 'Sale' ? 'bg-primary-container text-secondary' : 'bg-error-container text-error'}\`}>{row.type}</span>
                    </td>
                    <td className={\`px-6 py-4 text-right font-medium \${row.amount > 0 ? 'text-secondary' : 'text-error'}\`}>
                      {row.amount > 0 ? '+' : ''}\${row.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <div className="flex flex-col gap-6">
          <Card className="p-6 h-full flex flex-col justify-center border border-outline-variant">
             <h3 className="text-lg font-semibold text-primary mb-4 border-b border-outline-variant/50 pb-2">Financial Trend</h3>
             <div className="flex-1 flex items-end gap-2 mt-4 h-40">
                {[45, 60, 30, 80, 55, 90, 70].map((h, i) => (
                   <div key={i} className="flex-1 bg-primary/80 rounded-t-sm transition-all duration-500 hover:bg-secondary" style={{height: \`\${h}%\`}} />
                ))}
             </div>
             <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Ledger;`;

const settingsContent = `import React, { useState } from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Save, Shield, Settings as SettingsIcon, Bell, Database } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Company Profile', 'Notifications', 'Data & Backup'];

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved successfully!");
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <PageHeader title="System Settings" subtitle="Configure system preferences and default values." />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <Card className="overflow-hidden">
            <div className="flex flex-col">
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={\`text-left px-4 py-3 text-sm font-medium transition-colors \${activeTab === tab ? 'bg-primary-container text-primary border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-dim border-l-4 border-transparent'}\`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="p-6 min-h-[400px]">
            <h2 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
              {activeTab === 'General' && <SettingsIcon size={20} />}
              {activeTab === 'Company Profile' && <Shield size={20} />}
              {activeTab === 'Notifications' && <Bell size={20} />}
              {activeTab === 'Data & Backup' && <Database size={20} />}
              {activeTab} Configuration
            </h2>

            {activeTab === 'General' && (
              <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input id="currency" label="Default Currency" defaultValue="USD ($)" />
                  <Input id="timezone" label="Timezone" defaultValue="America/New_York" />
                  <Input id="dateFormat" label="Date Format" defaultValue="YYYY-MM-DD" />
                  <Input id="itemsPerPage" label="Items Per Page" type="number" defaultValue="25" />
                </div>
                <div className="pt-4 border-t border-outline-variant/50 flex justify-end">
                  <Button type="submit" variant="primary" className="flex items-center gap-2"><Save size={16}/> Save Settings</Button>
                </div>
              </form>
            )}

            {activeTab === 'Company Profile' && (
              <form className="space-y-6" onSubmit={handleSave}>
                <Input id="companyName" label="Company Name" defaultValue="Global Logistics Inc." />
                <Input id="address" label="Address" defaultValue="123 Supply Chain Ave, New York, NY 10001" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input id="phone" label="Contact Phone" defaultValue="+1 (555) 123-4567" />
                  <Input id="email" label="Contact Email" defaultValue="admin@globallogistics.com" />
                </div>
                <div className="pt-4 border-t border-outline-variant/50 flex justify-end">
                  <Button type="submit" variant="primary" className="flex items-center gap-2"><Save size={16}/> Save Profile</Button>
                </div>
              </form>
            )}

            {(activeTab === 'Notifications' || activeTab === 'Data & Backup') && (
              <div className="text-on-surface-variant flex items-center justify-center h-48 border-2 border-dashed border-outline-variant/50 rounded-lg">
                <p>This module is currently under active development.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Settings;`;

fs.writeFileSync(path.join(pagesDir, 'Ledger.jsx'), ledgerContent);
fs.writeFileSync(path.join(pagesDir, 'Settings.jsx'), settingsContent);
console.log('Updated Ledger, Settings');
