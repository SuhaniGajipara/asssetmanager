import React from 'react';

const Badge = ({ status }) => {
  const getBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN STOCK':
      case 'ACTIVE':
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-primary-container text-on-primary-container font-medium';
      case 'LOW STOCK':
        return 'bg-tertiary-container text-on-tertiary-container font-medium';
      case 'OUT OF STOCK':
      case 'CANCELLED':
      case 'ERROR':
        return 'bg-error-container text-on-error-container font-medium';
      case 'PENDING':
      default:
        return 'bg-surface-variant text-on-surface-variant font-medium';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-label-caps ${getBadgeStyle(status)}`}>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default Badge;
