import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Topbar() {
  const { user, logout, loading } = useAuth();

  if (!user) return null;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/40 backdrop-blur-xl px-6 flex justify-between items-center w-full sticky top-0 z-40">
      <div>
        <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          Welcome Back
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-200">{user.fullName}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{user.email}</span>
        </div>

        <button
          onClick={logout}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg border border-slate-800 hover:border-rose-900/40 transition-all duration-300 disabled:opacity-50"
          title="Sign out of portal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
export default Topbar;
