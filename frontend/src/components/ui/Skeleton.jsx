import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClass = "animate-pulse bg-outline-variant/30";
  
  const variants = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4 w-full"
  };

  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`}></div>
  );
};

export default Skeleton;
