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
      header: 'Borrower Name',
      accessor: (row: Lead) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs">
            {row.fullName.charAt(0)}
          </div>
          <span className="font-bold text-slate-100">{row.fullName}</span>
        </div>
      ),
    },
    {
      header: 'Email Address',
      accessor: (row: Lead) => <span className="font-semibold text-slate-400">{row.email}</span>,
    },
    {
      header: 'Registration Date',
      accessor: (row: Lead) => (
        <span className="text-slate-400 font-medium">
          {new Date(row.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Wizard Progress',
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-widest">
            Sales Lead Board
          </h1>
          <p className="text-xs text-slate-400">Track registered borrowers who have not finished submissions</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-900/40 rounded-lg text-xs font-semibold text-rose-400 tracking-wide">
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
        <div className="flex justify-between items-center bg-slate-900/20 px-6 py-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
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
