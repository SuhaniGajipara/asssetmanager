import React from 'react';

const InventoryBar = ({ current = 0, capacity = 100, threshold = 20, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (current / capacity) * 100)) || 0;
  
  let fillColor = 'bg-primary';
  if (percentage <= threshold) {
    fillColor = percentage === 0 ? 'bg-error' : 'bg-tertiary';
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden flex">
        <div 
          className={`h-full ${fillColor} transition-all duration-300 ease-in-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-code-sm font-medium text-on-surface whitespace-nowrap w-12 text-right">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default InventoryBar;
