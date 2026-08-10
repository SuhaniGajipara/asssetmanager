import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
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
      <input
        id={generatedId}
        ref={ref}
        className={`
          flex h-11 w-full rounded border border-outline-variant bg-surface-dim px-3 py-2 text-body-md text-on-surface
          file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-outline
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-error focus-visible:ring-error focus-visible:border-error' : ''}
        `}
        {...props}
      />
      {error && <p className="text-label-sm text-error">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
