import React, { useState } from 'react';
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
                  className={`text-left px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary-container text-primary border-l-4 border-primary' : 'text-on-surface-variant hover:bg-outline-variant/10 border-l-4 border-transparent'}`}
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
export default Settings;