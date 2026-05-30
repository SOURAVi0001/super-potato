import React, { useState, useRef } from 'react';
import Button from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF, JPG, PNG are allowed.');
      return false;
    }

    if (file.size > maxSizeBytes) {
      setError('File size exceeds the 5 MB limit.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    try {
      await onFileSelect(selectedFile);
    } catch (err: any) {
      setError(err.response?.data?.message || 'File upload failed.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full min-h-[220px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/10'
            : selectedFile
            ? 'border-indigo-500 bg-indigo-950/10'
            : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-indigo-900/40 border border-indigo-700/60 rounded-xl flex items-center justify-center text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-100">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setSelectedFile(null)}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={handleUploadSubmit}
              >
                Upload & Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={onButtonClick}>
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop your salary slip, or <span className="text-indigo-400 underline hover:text-indigo-300">browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Accepts PDF, JPG, or PNG (Max 5 MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-rose-400 font-semibold tracking-wide text-center">{error}</p>
      )}
    </div>
  );
}
export default FileUpload;
