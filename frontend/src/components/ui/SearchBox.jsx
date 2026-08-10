import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const SearchBox = ({ value, onChange, placeholder = "Search...", className = "", onFilterClick }) => {
  return (
    <div className={`flex gap-2 w-full ${className}`}>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 h-11 border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {value && (
          <button
            onClick={() => onChange({ target: { value: '' } })}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className="h-11 w-11 flex-shrink-0 flex items-center justify-center border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container transition-colors active:bg-surface-container-high"
          title="Filter Options"
        >
          <SlidersHorizontal size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
