'use client';

import React from 'react';
import { useLoan } from '../../../../hooks/useLoan';
import useApplicationStore from '../../../../store/applicationStore';
import FileUpload from '../../../../components/ui/FileUpload';
import Button from '../../../../components/ui/Button';

export default function SalaryUpload() {
  const { uploadSalarySlip, loading } = useLoan();
  const { setSalarySlip, setStep } = useApplicationStore();

  const handleFileUpload = async (file: File) => {
    try {
      const response = await uploadSalarySlip(file);
      setSalarySlip(response.salarySlipUrl);
    } catch (err) {
      console.error('Salary slip upload failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-widest mb-1">
            Upload Salary Slip
          </h2>
          <p className="text-xs text-slate-400">Step 2: Upload recent financial slips to verify salary</p>
        </div>
        <div className="bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          BRE Passed
        </div>
      </div>

      <FileUpload onFileSelect={handleFileUpload} isLoading={loading} />

      <div className="pt-2 border-t border-slate-850 flex justify-start">
        <Button
          variant="ghost"
          onClick={() => setStep(1)}
          disabled={loading}
          className="text-xs"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Details
        </Button>
      </div>
    </div>
  );
}
