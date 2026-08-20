import React from 'react';

const Badge = ({ status }) => {
  const getBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN STOCK':
      case 'ACTIVE':
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-success/10 text-success font-medium';
      case 'LOW STOCK':
        return 'bg-warning/10 text-warning font-medium';
      case 'OUT OF STOCK':
      case 'CANCELLED':
      case 'ERROR':
        return 'bg-error/10 text-error font-medium';
      case 'PENDING':
      default:
        return 'bg-info/10 text-info font-medium';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-label-caps ${getBadgeStyle(status)}`}>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default Badge;
