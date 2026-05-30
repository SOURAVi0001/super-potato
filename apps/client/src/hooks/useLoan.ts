import { useState } from 'react';
import api from '../lib/api';
import { IPersonalDetails } from '@lms/shared/src/types/loan.types';

export function useLoan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePersonalDetails = async (details: IPersonalDetails) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/applications/personal-details', details);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save personal details.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadSalarySlip = async (file: File) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('salarySlip', file);
    try {
      const response = await api.post('/applications/salary-slip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to upload salary slip.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveLoanConfig = async (config: { amount: number; tenureDays: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/applications/loan-config', config);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save loan config.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/applications/submit');
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit application.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMyApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/applications/mine');
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch application details.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLoans = async (status?: string, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/loans', {
        params: { status, page, limit },
      });
      return response.data; // Returns full envelopes (with meta)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch loans.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLoanById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/loans/${id}`);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch loan details.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveLoan = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/loans/${id}/approve`);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to approve loan.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectLoan = async (id: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/loans/${id}/reject`, { reason });
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to reject loan.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disburseLoan = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/loans/${id}/disburse`);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to disburse loan.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recordPayment = async (payload: {
    loanId: string;
    utrNumber: string;
    amount: number;
    paymentDate: string;
    notes?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/payments', payload);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to record payment.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLeads = async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/leads', {
        params: { page, limit },
      });
      return response.data; // Returns full envelopes (with meta)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch sales leads.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    savePersonalDetails,
    uploadSalarySlip,
    saveLoanConfig,
    submitApplication,
    getMyApplication,
    getLoans,
    getLoanById,
    approveLoan,
    rejectLoan,
    disburseLoan,
    recordPayment,
    getLeads,
  };
}
export default useLoan;
