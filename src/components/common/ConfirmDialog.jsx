// src/components/common/ConfirmDialog.jsx
import React from 'react';

export const ConfirmDialog = ({ isOpen, title = 'Are you sure?', message = '', onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/75 z-[1000] backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-charcoal border border-gold/20 max-w-md w-full rounded-xl p-6 shadow-2xl animate-scaleIn">
        <h3 className="font-display text-gold text-lg font-semibold mb-2">{title}</h3>
        {message && <p className="font-body text-xs text-champagne/80 mb-6">{message}</p>}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-champagne/70 hover:bg-white/10 hover:text-champagne transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-burgundy hover:bg-burgundy/80 text-white rounded-lg text-xs font-semibold border border-gold/20 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
