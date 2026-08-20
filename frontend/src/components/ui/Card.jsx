import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-surface rounded border border-outline-variant shadow-sm overflow-hidden transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
