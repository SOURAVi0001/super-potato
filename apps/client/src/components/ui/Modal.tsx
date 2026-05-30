import React, { useState } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
  title: string;
  placeholder?: string;
  submitLabel?: string;
  submitVariant?: 'primary' | 'danger' | 'accent';
}

export function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder = 'Enter details...',
  submitLabel = 'Confirm',
  submitVariant = 'danger',
}: ModalProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!value.trim()) {
      setError('This field is required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(value);
      setValue('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <h3 className="font-semibold text-slate-100 text-base">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 hover:border-slate-800 transition-all resize-none"
          />
          {error && (
            <p className="mt-2 text-xs text-rose-400 font-semibold tracking-wide">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={submitVariant}
            isLoading={loading}
            onClick={handleConfirm}
          >
            {submitLabel}
          </Button>
        </div>

      </div>
    </div>
  );
}
export default Modal;
