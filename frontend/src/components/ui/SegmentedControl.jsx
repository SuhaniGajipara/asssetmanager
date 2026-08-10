import React from 'react';

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <div className="flex bg-surface-variant p-1 rounded-lg w-full max-w-md">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex-1 py-3 px-4 text-center rounded-md text-label-md transition-colors min-h-[48px]
              ${
                isActive
                  ? 'bg-surface shadow-sm text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-container-high active:bg-surface-container-highest'
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
