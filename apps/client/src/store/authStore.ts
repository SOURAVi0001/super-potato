import { create } from 'zustand';
import { IUser } from '@lms/shared/src/types/user.types';
import { setAccessToken } from '../lib/auth';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  setAuth: (user: IUser | null, token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    setAccessToken(token);
    set({ user, isAuthenticated: !!user });
  },
  clearAuth: () => {
    setAccessToken(null);
    set({ user: null, isAuthenticated: false });
  },
}));
export default useAuthStore;
