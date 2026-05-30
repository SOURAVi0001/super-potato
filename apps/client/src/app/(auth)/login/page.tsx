'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login, loading, error: authError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error('Login action failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-brand-600 rounded flex items-center justify-center font-medium text-[#fdf6ee] text-lg shadow-sm mx-auto mb-3">
            L
          </div>
          <h1 className="text-[20px] font-medium text-stone-900 mb-1">
            Sign in to LMS
          </h1>
          <p className="text-[12px] text-stone-400 font-normal">Enter your credentials to access the portal</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-card">
          {authError && (
            <div className="mb-4 p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. sales@lms.com"
              error={errors.email?.message}
              {...register('email')}
              disabled={loading}
            />

            <Input
              label="Account Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-[13px] text-stone-500 mt-6">
          Are you a new borrower?{' '}
          <Link href="/register" className="text-brand-600 hover:text-brand-850 font-medium underline">
            Register profile
          </Link>
        </p>
      </div>
    </div>
  );
}
