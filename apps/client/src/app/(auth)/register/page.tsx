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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] mx-auto mb-4">
            L
          </div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-wider uppercase mb-1">
            Create Borrower Account
          </h1>
          <p className="text-xs text-slate-400">Register profile to apply for instant loans</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl">
          {authError && (
            <div className="mb-6 p-4 rounded-lg bg-rose-950/40 border border-rose-900/40 text-xs font-semibold text-rose-400 tracking-wide">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
