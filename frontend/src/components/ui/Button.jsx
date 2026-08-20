import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-on-primary shadow-sm hover:shadow-md hover:brightness-110 active:brightness-95 border-0',
    secondary: 'bg-secondary-container text-on-secondary-container shadow-sm hover:shadow-md hover:brightness-110 active:brightness-95 border-0',
    outline: 'border border-outline bg-transparent text-primary hover:bg-surface-variant active:brightness-95',
    ghost: 'bg-transparent text-primary hover:bg-surface-variant active:brightness-95',
    danger: 'bg-error text-on-error shadow-sm hover:shadow-md hover:brightness-110 active:brightness-95 border-0',
    white: 'bg-white text-[#2a1b54] shadow-sm hover:bg-gray-50 active:bg-gray-100 border border-gray-100',
  };

  const sizes = {
    sm: 'h-8 px-3 text-label-md',
    md: 'h-11 px-4 text-body-md',
    lg: 'h-12 px-6 text-body-lg',
    icon: 'h-11 w-11',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
