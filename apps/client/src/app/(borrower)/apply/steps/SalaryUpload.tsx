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
          <h2 className="text-[15px] font-medium text-stone-900 mb-1">
            Upload salary slip
          </h2>
          <p className="text-[12px] text-stone-400">Step 2: Upload recent financial slips to verify salary</p>
        </div>
        <div className="bg-[#edf3ec] text-[#2d5c2a] border border-[#a8c8a4] text-[11px] font-medium px-2 py-0.5 rounded shadow-sm">
          BRE Passed
        </div>
      </div>

      <FileUpload onFileSelect={handleFileUpload} isLoading={loading} />

      <div className="pt-2 border-t border-stone-200 flex justify-start">
        <Button
          variant="ghost"
          onClick={() => setStep(1)}
          disabled={loading}
          className="text-xs"
        >
          <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to details
        </Button>
      </div>
    </div>
  );
}
