'use client';

import React, { useEffect, useState } from 'react';
import { useLoan } from '../../../hooks/useLoan';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  applicationStatus: 'DRAFT' | 'BRE_FAILED' | null;
}

export default function SalesPage() {
  const { getLeads, loading, error } = useLoan();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeadsData = async (activePage: number) => {
    try {
      const response = await getLeads(activePage, 10);
      setLeads(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Failed to get leads:', err);
    }
  };

  useEffect(() => {
    fetchLeadsData(page);
  }, [page]);

  const columns = [
    {
      header: 'Borrower name',
      accessor: (row: Lead) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-medium text-brand-600 text-xs">
            {row.fullName.charAt(0)}
          </div>
          <span className="font-medium text-stone-900">{row.fullName}</span>
        </div>
      ),
    },
    {
      header: 'Email address',
      accessor: (row: Lead) => <span className="font-normal text-stone-500">{row.email}</span>,
    },
    {
      header: 'Registration date',
      accessor: (row: Lead) => (
        <span className="text-stone-500 font-normal">
          {new Date(row.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Wizard progress',
      accessor: (row: Lead) => {
        if (!row.applicationStatus) {
          return <Badge variant="secondary">Not Started</Badge>;
        }
        if (row.applicationStatus === 'BRE_FAILED') {
          return <Badge variant="danger">BRE Failed</Badge>;
        }
        return <Badge variant="primary">Draft</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[15px] font-medium text-stone-900">
          Sales lead board
        </h1>
        <p className="text-[12px] text-stone-400">Track registered borrowers who have not finished submissions</p>
      </div>

      {error && (
        <div className="p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
          {error}
        </div>
      )}

      {/* Leads Table */}
      <Table
        columns={columns}
        data={leads}
        loading={loading}
        emptyMessage="No registered leads tracked in the system yet."
      />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-stone-50 border border-stone-200 px-4 py-3 rounded-lg shadow-card">
          <span className="text-[11px] font-medium text-stone-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage(prev => prev - 1)}
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(prev => prev + 1)}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
