import React from 'react';
import { Search } from 'lucide-react';

export const SearchBox = ({ placeholder = "Search...", onChange, value }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-4 w-4 text-gray-400" />
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-md leading-5 bg-surface placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-[#00366B] sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
