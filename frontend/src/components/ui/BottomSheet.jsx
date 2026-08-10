import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (sheetRef.current && !sheetRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={sheetRef}
        className="w-full max-h-[90vh] bg-surface rounded-t-[28px] shadow-level-2 animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center p-4">
          <div className="w-8 h-1 bg-outline-variant rounded-full"></div>
        </div>
        
        <div className="px-6 pb-4 flex justify-between items-center border-b border-surface-variant">
          <h2 className="text-headline-sm text-on-surface">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors active:bg-surface-container-high"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BottomSheet;
