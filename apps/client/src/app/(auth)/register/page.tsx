'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const registerFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: registerAction, loading, error: authError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerAction(data.email, data.password, data.fullName);
    } catch (err) {
      console.error('Registration failed:', err);
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
            Create Borrower Account
          </h1>
          <p className="text-[12px] text-stone-400 font-normal">Register profile to apply for instant loans</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-card">
          {authError && (
            <div className="mb-4 p-3 rounded bg-[#f5ebe8] border border-[#d4a898] text-[12px] font-medium text-[#7a2e20]">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Sourav Choudhary"
              error={errors.fullName?.message}
              {...register('fullName')}
              disabled={loading}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. borrower@lms.com"
              error={errors.email?.message}
              {...register('email')}
              disabled={loading}
            />

            <Input
              label="Choose Password"
              type="password"
              placeholder="Min. 6 characters"
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
              Register & Continue
            </Button>
          </form>
        </div>

        <p className="text-center text-[13px] text-stone-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 hover:text-brand-850 font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
