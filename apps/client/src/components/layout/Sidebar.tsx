import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import { UserRole } from '@lms/shared/src/types/user.types';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  // Compile the allowed links map based on role configurations
  const links: { href: string; label: string; icon: React.ReactNode }[] = [];

  const addLink = (href: string, label: string, icon: React.ReactNode) => {
    links.push({ href, label, icon });
  };

  const salesIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const sanctionIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const disburseIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 11h2m4 0h2" />
    </svg>
  );

  const collectionIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const applyIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const myLoanIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  if (user.role === UserRole.ADMIN) {
    addLink('/sales', 'Sales Leads', salesIcon);
    addLink('/sanction', 'Sanction Panel', sanctionIcon);
    addLink('/disbursement', 'Disbursements', disburseIcon);
    addLink('/collection', 'Collections', collectionIcon);
  } else if (user.role === UserRole.SALES) {
    addLink('/sales', 'Sales Leads', salesIcon);
  } else if (user.role === UserRole.SANCTION) {
    addLink('/sanction', 'Sanction Panel', sanctionIcon);
  } else if (user.role === UserRole.DISBURSEMENT) {
    addLink('/disbursement', 'Disbursements', disburseIcon);
  } else if (user.role === UserRole.COLLECTION) {
    addLink('/collection', 'Collections', collectionIcon);
  } else if (user.role === UserRole.BORROWER) {
    addLink('/my-loan', 'My Active Loan', myLoanIcon);
    addLink('/apply', 'Apply For Loan', applyIcon);
  }

  return (
    <aside className="w-56 border-r border-stone-200 bg-stone-100 h-screen sticky top-0 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Logo area */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/50">
          <span className="text-[15px] font-medium text-stone-900 block tracking-tight">LMS Portal</span>
          <span className="text-[11px] text-stone-400 block font-normal">Loan Management System</span>
        </div>

        {/* Links list */}
        <nav className="p-3 flex flex-col gap-0.5">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-[13px] transition-all duration-100 ${
                  isActive
                    ? 'bg-stone-200 text-stone-900 font-medium'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <span className={isActive ? 'text-brand-600' : 'text-stone-400'}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile card */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/30">
        <div className="flex items-center gap-2.5 p-2 bg-white rounded border border-stone-200 shadow-card">
          <div className="w-8 h-8 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-medium text-brand-600 text-sm">
            {user.fullName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-[12px] font-medium text-stone-800 truncate">{user.fullName}</h4>
            <span className="text-[11px] font-normal text-stone-400 block truncate">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
