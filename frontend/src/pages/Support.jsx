import React from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { SearchBox } from '../components/SearchBox';
import EmptyState from '../components/EmptyState';
import { Plus } from 'lucide-react';

const Support = () => {
  const columns = [];
  
  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Support" 
        subtitle="Get help and contact the support team."
        action={
          <Button className="flex items-center gap-2 px-4 py-2 transition-colors">
            <Plus size={18} />
            Add New
          </Button>
        }
      />

      <Card className="flex flex-col bg-surface border border-outline-variant rounded-lg shadow-sm min-h-[400px]">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-dim flex items-center justify-between gap-4 rounded-t-lg">
          <div className="w-full max-w-sm">
            <SearchBox placeholder="Search..." />
          </div>
        </div>
        
        {columns.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface border-b border-outline-variant/50 text-on-surface-variant text-sm">
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
                      onAction={() => alert("Action clicked!")}
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

export default Support;
