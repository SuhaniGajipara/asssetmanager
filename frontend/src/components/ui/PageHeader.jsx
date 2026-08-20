import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2a1b54] to-[#3b2774] shadow-md mb-6">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full transform translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute -bottom-16 right-24 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
      
      <div className="relative z-10 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 md:pb-6">
        <div className="max-w-2xl">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-sm leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 flex items-center gap-3">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
