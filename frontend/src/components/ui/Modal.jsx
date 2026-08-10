import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm">
      <div className="bg-surface rounded-lg w-full max-w-lg shadow-xl border border-outline-variant flex flex-col overflow-hidden max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface">
          <h2 className="text-headline-sm text-on-surface">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-variant text-outline hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-surface-dim/50">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
