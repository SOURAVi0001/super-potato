import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Topbar() {
  const { user, logout, loading } = useAuth();

  if (!user) return null;

  return (
    <header className="h-12 bg-white border-b border-stone-200 px-6 flex justify-between items-center w-full sticky top-0 z-40">
      <div>
        <h2 className="text-[13px] font-medium text-stone-850">
          Welcome back, {user.fullName.split(' ')[0]}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-medium text-stone-700">{user.fullName}</p>
          <span className="text-[10px] text-stone-400 block leading-none">{user.email}</span>
        </div>

        <button
          onClick={logout}
          disabled={loading}
          className="p-1.5 text-stone-500 hover:text-[#7a2e20] hover:bg-[#f5ebe8] rounded border border-stone-200 hover:border-[#d4a898] transition-colors duration-150 disabled:opacity-40"
          title="Sign out of portal"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
export default Topbar;
