import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { getAccessToken } from '../lib/auth';
import useAuthStore from '../store/authStore';
import { UserRole } from '@lms/shared/src/types/user.types';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      
      // Perform dynamic routing based on designated user role
      if (user.role === UserRole.BORROWER) {
        router.push('/my-loan');
      } else if (user.role === UserRole.ADMIN) {
        router.push('/sales');
      } else if (user.role === UserRole.DISBURSEMENT) {
        router.push('/disbursement');
      } else {
        router.push(`/${user.role.toLowerCase()}`);
      }
      return user;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { email, password, fullName });
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      router.push('/apply');
      return user;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      clearAuth();
      router.replace('/login');
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const response = await api.get('/auth/me');
      const { user } = response.data.data;
      setAuth(user, getAccessToken());
      return user;
    } catch (err) {
      clearAuth();
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchMe,
  };
}
export default useAuth;
