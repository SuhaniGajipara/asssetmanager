import React from 'react';
import { PlusCircle } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = PlusCircle, 
  title = "No data available", 
  description = "Get started by creating a new entry.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-surface border border-outline-variant rounded-lg shadow-sm text-center h-full min-h-[400px]">
      <div className="w-16 h-16 bg-[#D5E3FF] text-primary rounded-full flex items-center justify-center mb-6">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <PlusCircle size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
