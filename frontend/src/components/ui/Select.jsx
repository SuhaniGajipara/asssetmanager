import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={generatedId} className="text-body-sm font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={generatedId}
          ref={ref}
          className={`
            flex h-11 w-full appearance-none rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 pr-10 text-body-md text-on-surface
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-error focus-visible:ring-error focus-visible:border-error' : ''}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" 
          size={16} 
        />
      </div>
      {error && <p className="text-label-sm text-error">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
