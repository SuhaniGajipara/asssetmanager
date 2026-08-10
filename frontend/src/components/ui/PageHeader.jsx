import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-stack-lg gap-4">
      <div>
        <h1 className="text-headline-lg text-on-background mb-1">{title}</h1>
        {subtitle && (
          <p className="text-body-md text-on-surface-variant">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
