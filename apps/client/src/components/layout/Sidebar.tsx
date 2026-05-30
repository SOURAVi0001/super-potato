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
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const sanctionIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const disburseIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 11h2m4 0h2" />
    </svg>
  );

  const collectionIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );

  const applyIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const myLoanIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 backdrop-blur-xl h-screen sticky top-0 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950/40">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]">
            L
          </div>
          <span className="font-extrabold text-base tracking-widest bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase">
            LMS Portal
          </span>
        </div>

        {/* Links list */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-900/30 border-l-4 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile card */}
      <div className="p-4 border-t border-slate-805 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-xl border border-slate-850">
          <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm">
            {user.fullName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-200 truncate">{user.fullName}</h4>
            <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase block truncate">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
