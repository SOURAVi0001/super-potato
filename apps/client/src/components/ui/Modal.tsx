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
    <div className="fixed inset-0 bg-stone-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-lg w-full max-w-md shadow-[0_8px_30px_rgba(61,40,18,0.12)] overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-stone-900">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            rows={3}
            className="w-full border border-stone-300 rounded bg-[#fdfcfa] text-[14px] text-stone-800 p-3 resize-none focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15 transition-all duration-150 placeholder:text-stone-400"
          />
          {error && (
            <p className="mt-1.5 text-xs text-[#7a2e20] font-semibold">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-100 flex justify-end gap-2 bg-stone-50/50">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant={submitVariant}
            isLoading={loading}
            onClick={handleConfirm}
            className="text-xs"
          >
            {submitLabel}
          </Button>
        </div>

      </div>
    </div>
  );
}
export default Modal;
